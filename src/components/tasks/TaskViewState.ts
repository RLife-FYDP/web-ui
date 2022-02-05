import _ from "lodash";
import { action, computed, makeAutoObservable, observable } from "mobx";
import { NumberLiteralType } from "typescript";
import { authenticatedGetRequest, getUser } from "../../api/apiClient";

export interface SingleTaskProps {
  id: number;
  title: string;
  onRepeat: boolean;
  assignee: number[];
}

interface TaskProps {
  taskSection: Date;
  taskDetails: SingleTaskProps[];
}

interface ResponseProps {
  completed: boolean;
  due_date: string;
  points: NumberLiteralType;
  title: string;
  id: number;
  users: { id: number }[];
}

export class TaskViewState {
  private responseData?: ResponseProps[];
  @observable private tasks?: TaskProps[];

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    const user = await getUser()
    const res = await authenticatedGetRequest(`/suites/${user.suiteId}/tasks`);
    const data = await res?.json()
    this.responseData = data;
    this.parseResponse();
  }

  @action
  parseResponse() {
    if (this.responseData === undefined || this.responseData?.length === 0) {
      return;
    }

    const taskSortedByDate = this.responseData.sort((taskA, taskB) => {
      const dateA = new Date(taskA.due_date);
      const dateB = new Date(taskB.due_date);
      return dateA.getTime() - dateB.getTime();
    });

    const processedTasksByDate = _.groupBy(taskSortedByDate, (task) => {
      const dateObject = new Date(task.due_date);
      const startOfDay = dateObject.setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      const history = new Date(0).valueOf();
      // grouping everything that is overdue into "yesterday"
      return startOfDay < today ? history : startOfDay;
    });

    const taskDateKeys = Object.keys(processedTasksByDate);

    this.tasks = taskDateKeys.map((key) => {
      const values = processedTasksByDate[key];
      return {
        taskSection: new Date(key),
        taskDetails: values.map((task) => {
          return {
            id: task.id,
            title: task.title,
            // TODO: will require rrule object
            onRepeat: true,
            assignee: task.users.map((obj) => obj.id),
          };
        }),
      };
    });
  }

  @computed
  get assignedTasks(): TaskProps[] | undefined {
    return this.tasks;
  }
}
