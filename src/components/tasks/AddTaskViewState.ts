import axios from "axios";
/* eslint-disable eqeqeq */
import { action, computed, makeAutoObservable, observable } from "mobx";
import RRule, { Frequency, Options } from "rrule";

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

export interface NewTaskProps {
  taskName: string;
  description?: string;
  tags?: string;
  assignee?: number[];
  startDate?: Date;
  rruleOptions?: Options;
}

interface ResponseProps {
  first_name: string;
  last_name: string;
  id: number;
}

export class AddTaskViewState {
  @observable newTask: NewTaskProps = {
    taskName: "",
  };

  @observable private roommateData?: ResponseProps[];

  constructor(taskToEdit?: NewTaskProps) {
    makeAutoObservable(this);
    this.init();

    this.newTask = taskToEdit ?? {
      taskName: "",
    };
  }

  async init() {
    // TODO: fix hardcode of roomid = 4
    const response = await axios.get("http://localhost:8080/suites/4/users");
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
  setNewTaskValueByKey = (kVPairUpdate: Partial<NewTaskProps>) => {
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

  submitNewTask = () => {
    const rule = new RRule(this.newTask.rruleOptions);
    console.log("rrule string: ", rule.toString());
    console.log("rrule description: ", rule.toText());
    console.log("rrule reaccurrances:", rule.all());
  };
}
