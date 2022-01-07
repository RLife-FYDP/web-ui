import { action, makeAutoObservable, observable } from "mobx";
import RRule, { Frequency, Options } from "rrule";

interface NewTaskProps {
  taskName: string;
  description?: string;
  tags?: string;
  assignee?: string;
  // TODO: schedule needs to be some object that is cross compatible
  startDate?: Date;
  endDate?: Date;
  rruleOptions?: Options;
}

enum RepeatIntervals {
  BYWEEKDAYS = "weekday",
  BYMONTH = "month",
}

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

export class AddTaskViewState {
  @observable newTask: NewTaskProps = {
    taskName: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setNewTaskValueByKey = (kVPairUpdate: Partial<NewTaskProps>) => {
    this.newTask = { ...this.newTask, ...kVPairUpdate };
  };

  @action
  setNewRRuleValueByKey = (kVPairUpdate: Partial<Options>) => {
    this.newTask.rruleOptions = {
      ...defaultOptions,
      ...this.newTask.rruleOptions,
      ...kVPairUpdate,
    };
  };

  submitNewTask = () => {
    console.log(this.newTask.startDate);
  };
}

// This is necessary as the rrule dependency did not include undefined
// as an option for option properties
const defaultOptions: Options = {
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
