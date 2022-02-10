import axios from "axios";
/* eslint-disable eqeqeq */
import { action, computed, makeAutoObservable, observable } from "mobx";
import RRule, { Frequency, Options } from "rrule";
import { authenticatedRequestWithBody, getUser } from "../../api/apiClient";
import { TaskPageUrl } from "../../commonUtils/consts";

// This is necessary as the rrule dependency did not include undefined
// as an option for option properties
export const DefaultOptions: Options = {
  freq: Frequency.DAILY,
  dtstart: null,
  interval: 1,
  wkst: null,
  count: null,
  until: null,
  tzid: null,
  bysetpos: null,
  bymonth: null,
  bymonthday: null,
  bynmonthday: null,
  byyearday: null,
  byweekno: null,
  byweekday: null,
  bynweekday: null,
  byhour: null,
  byminute: null,
  bysecond: null,
  byeaster: null,
};

export const RRuleWeekdayIntervals = [
  RRule.MO,
  RRule.TU,
  RRule.WE,
  RRule.TH,
  RRule.FR,
  RRule.SA,
  RRule.SU,
];

export const RRuleFrequencies = [
  { label: "Daily", value: Frequency.DAILY },
  { label: "Weekly", value: Frequency.WEEKLY },
];

// TODO: Expand support if time permits: we will only support weekly intervals up to a month
// (e.g. min weekly = every week, max weekly = every month)
export const RRuleWeeklyIntervals = [1, 2, 3, 4];

export interface SingleTaskProps {
  id?: number; // only for editing tasks
  title: string;
  description?: string;
  tags?: string;
  assignee: number[];
  // start date should be mandatory
  startDate: Date;
  rruleOptions?: Options;
}

interface ResponseProps {
  first_name: string;
  last_name: string;
  id: number;
}

export function convertToUTC(localeDate: Date): Date {
  let now_utc = Date.UTC(
    localeDate.getUTCFullYear(),
    localeDate.getUTCMonth(),
    localeDate.getUTCDate(),
    localeDate.getUTCHours(),
    localeDate.getUTCMinutes(),
    localeDate.getUTCSeconds()
  );

  return new Date(now_utc);
}

export class AddTaskViewState {
  @observable newTask: SingleTaskProps = {
    title: "",
    assignee: [],
    startDate: new Date(),
  };

  @observable private roommateData?: ResponseProps[];
  @observable isLoading: boolean = false;

  constructor(taskToEdit?: SingleTaskProps) {
    makeAutoObservable(this);
    this.init();

    this.newTask = taskToEdit ?? this.newTask;
  }

  async init() {
    const user = await getUser();
    const response = await axios.get(
      `http://localhost:8080/suites/${user.suiteId}/users`
    );
    this.roommateData = response.data;
  }

  @computed
  get roommates(): ResponseProps[] | undefined {
    return this.roommateData;
  }

  @computed
  get rruleText(): string {
    const { rruleOptions } = this.newTask;
    if (
      rruleOptions?.dtstart == undefined &&
      rruleOptions?.until == undefined
    ) {
      return "Specify both start and end dates.";
    }
    const rrule = new RRule(rruleOptions);
    return rrule.toText();
  }

  @action
  setNewTaskValueByKey = (kVPairUpdate: Partial<SingleTaskProps>) => {
    this.newTask = { ...this.newTask, ...kVPairUpdate };
  };

  @action
  setNewRRuleValueByKey = (kVPairUpdate: Partial<Options>) => {
    this.newTask.rruleOptions = {
      ...DefaultOptions,
      dtstart: this.newTask.startDate ?? null,
      ...this.newTask.rruleOptions,
      ...kVPairUpdate,
    };
  };

  getNameById = (
    id: number,
    includeLastName: boolean = false
  ): string | undefined => {
    const roommate = this.roommateData?.find((roommate) => roommate.id === id);
    return includeLastName
      ? `${roommate?.first_name} ${roommate?.last_name}`
      : roommate?.first_name;
  };

  deleteTask = () => {
    this.deleteTaskToServer();
  };

  submitNewTask = () => {
    this.submitTaskToServer();
  };

  private async deleteTaskToServer() {
    await authenticatedRequestWithBody(
      `/tasks/${this.newTask.id}`,
      "",
      "DELETE"
    );

    window.location.reload();
  }

  private async submitTaskToServer() {
    const rule = new RRule(this.newTask.rruleOptions);
    const rruleString = rule.toString();
    this.newTask.startDate.setHours(0, 0, 0, 0);

    const body = JSON.stringify({
      title: this.newTask.title,
      description: this.newTask.description,
      // TODO: temp tags
      tags: "2",
      points: 2,
      assignee: this.newTask.assignee,
      startTime: this.newTask.startDate,
      rruleOption: rruleString,
    });

    this.isLoading = true;
    if (this.newTask.id) {
      await authenticatedRequestWithBody(
        `/tasks/${this.newTask.id}`,
        body,
        "PUT"
      );
    } else {
      await authenticatedRequestWithBody("/tasks/create", body);
    }
    this.isLoading = false;

    window.location.href = TaskPageUrl;

    // console.log("rrule string: ", rule.toString());
    // console.log("rrule description: ", rule.toText());
    // console.log("rrule reaccurrances:", rule.all());
  }
}
