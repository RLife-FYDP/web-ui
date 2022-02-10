import { rrulestr, Weekday } from "rrule";
/* eslint-disable eqeqeq */
import { ByWeekday, RRule } from "rrule";
import _ from "lodash";
import { action, computed, makeAutoObservable, observable } from "mobx";
import {
  authenticatedGetRequest,
  authenticatedRequestWithBody,
  getUser,
} from "../../api/apiClient";
import {
  convertToUTC,
  DefaultOptions,
  SingleTaskProps,
} from "./AddTaskViewState";

export interface TaskProps {
  taskSection: Date;
  taskDetails: SingleTaskProps[];
}

interface ResponseProps {
  id: number;
  title: string;
  description?: string;
  tags?: string;
  users: { id: number }[];
  start_time: string;
  rrule_option?: string;
  // we can use lastUpdated to filter the rrule dates out
  // via rrule.after(date) function
  last_completed: string;
}

export class TaskViewState {
  private responseData?: ResponseProps[];
  @observable private tasks?: TaskProps[];

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  reloadData() {
    this.responseData = undefined;
    this.tasks = undefined;
    this.init();
  }

  async init() {
    const user = await getUser();
    const res = await authenticatedGetRequest(`/suites/${user.suiteId}/tasks`);
    const data = await res?.json();
    this.responseData = data;
    this.parseResponse();
  }

  async updateTaskCheckpoint(id: number, toDelete = false) {
    let task = this.getTaskDetailsById(id)!;
    let today = new Date();
    let canBeDeleted = task.rruleOptions
      ? task.rruleOptions.until && task.rruleOptions.until < today
      : true;
    today.setHours(0, 0, 0, 0);
    task.lastUpdated = today;

    if (canBeDeleted || toDelete) {
      // delete task now that we're done
      await authenticatedRequestWithBody(`/tasks/${task.id}`, "", "DELETE");
      return this.reloadData();
    } 

    const rule = new RRule(task.rruleOptions);
    const rruleString = rule.toString();
    const body = JSON.stringify({
      title: task.title,
      description: task.description,
      // TODO: temp tags
      tags: "2",
      points: 2,
      assignee: task.assignee,
      startTime: task.startDate,
      rruleOption: rruleString,
      lastCompleted: task.lastUpdated,
    });

    await authenticatedRequestWithBody(`/tasks/${task.id}`, body, "PUT");
    this.reloadData();
  }

  getTaskDetailsById = (id: number): SingleTaskProps | undefined => {
    let task = this.responseData?.find((task) => task?.id === id);
    if (task == undefined) {
      return undefined;
    }

    // doing some formatting to match BE field props -> FE field props
    let rrule;
    if (task.rrule_option != undefined && task.rrule_option !== "") {
      rrule = {
        ...DefaultOptions,
        ...RRule.parseString(task.rrule_option),
      };

      return {
        ...task,
        startDate: new Date(task.start_time),
        assignee: task.users?.map((user) => user.id),
        lastUpdated: new Date(task.last_completed),
        rruleOptions: {
          ...rrule,
          byweekday: Array.isArray(rrule.byweekday)
            ? (rrule.byweekday as ByWeekday[]).map(
                (obj) => (obj as Weekday).weekday
              )
            : rrule.byweekday,
        },
      };
    }

    return {
      ...task,
      startDate: new Date(task.start_time),
      assignee: task.users?.map((user) => user.id),
      lastUpdated: new Date(task.last_completed),
      rruleOptions: undefined,
    };
  };

  @action
  parseResponse() {
    if (this.responseData === undefined) {
      return;
    }

    if (this.responseData.length === 0) {
      this.tasks = [];
    }

    const filteredData = this.responseData.filter((task) => {
      if (task.rrule_option && task.rrule_option !== "") {
        let rrule = rrulestr(task.rrule_option);
        return !!rrule.after(new Date(task.last_completed));
      }

      return new Date(task.last_completed) < new Date(task.start_time);
    });

    // const taskSortedByDate = filteredData.sort((taskA, taskB) => {
    //   let dateA = new Date(taskA.start_time);
    //   let dateB = new Date(taskB.start_time);

    //   if (taskA.rrule_option) {
    //     let rrule = rrulestr(taskA.rrule_option);
    //     let firstOccurence = rrule.after(new Date(taskA.last_completed));
    //     dateA = firstOccurence;
    //   }

    //   if (taskB.rrule_option) {
    //     let rrule = rrulestr(taskB.rrule_option);
    //     let firstOccurence = rrule.after(new Date(taskB.last_completed));
    //     dateA = firstOccurence;
    //   }

    //   return dateA.getTime() - dateB.getTime();
    // });

    const processedTasksByDate = _.groupBy(filteredData, (task) => {
      const dateObject = new Date(task.start_time);
      const today = new Date().setHours(0, 0, 0, 0);
      const history = new Date(0).valueOf();
      let startOfDay = dateObject.setHours(0, 0, 0, 0);

      if (task.rrule_option && task.rrule_option !== "") {
        let rrule = rrulestr(task.rrule_option);
        startOfDay = rrule
          .after(new Date(task.last_completed))
          .setHours(0, 0, 0, 0);
      }

      // grouping everything that is overdue into "yesterday"
      return startOfDay < today ? history : startOfDay;
    });

    const taskDateKeys = Object.keys(processedTasksByDate);

    this.tasks = taskDateKeys
      .map((key) => {
        const values = processedTasksByDate[key];
        return {
          taskSection: new Date(Number(key)),
          taskDetails: values.map((task) => {
            return {
              id: task.id,
              title: task.title,
              rruleOptions: task.rrule_option,
              startDate: new Date(task.start_time),
              assignee: task.users.map(({ id }) => id),
              lastUpdated: new Date(task.last_completed),
            } as SingleTaskProps;
          }),
        };
      })
      .sort((sectionA, sectionB) => {
        return sectionA.taskSection.getTime() - sectionB.taskSection.getTime();
      });
  }

  @computed
  get assignedTasks(): TaskProps[] | undefined {
    return this.tasks;
  }
}
