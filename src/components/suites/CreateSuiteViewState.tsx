import axios from "axios";
/* eslint-disable eqeqeq */
import { action, computed, makeAutoObservable, observable } from "mobx";
import RRule, { Frequency, Options } from "rrule";
import { authenticatedGetRequest, authenticatedRequestWithBody, getUser } from "../../api/apiClient";
import { TaskPageUrl } from "../../commonUtils/consts";
import { User } from "../../commonUtils/types";

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

export interface SingleSuiteProps {
  id?: number
  name: string
  address: string
  users?: number[]
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

export class CreateSuiteViewState {
  @observable newSuite: SingleSuiteProps = {
    name: "",
    address: "",

  };

  @observable private roommateData?: ResponseProps[];
  @observable matches: User[] = []
  @observable isLoading: boolean = false;

  constructor(taskToEdit?: SingleSuiteProps) {
    makeAutoObservable(this);
    this.init();

    this.newSuite = taskToEdit ?? this.newSuite;
  }

  async init() {
    const user = await getUser();
    const response = await axios.get(
      `http://localhost:8080/suites/${user.suiteId}/users`
    );
    this.roommateData = response.data;
    const res = await authenticatedGetRequest(`/matches/${user.id}/findMatches`)
    const matches = await res!.json()
    this.matches = matches
  }

  @computed
  get roommates(): ResponseProps[] | undefined {
    return this.roommateData;
  }

  @action
  setNewSuiteValueByKey = (kVPairUpdate: Partial<SingleSuiteProps>) => {
    this.newSuite = { ...this.newSuite, ...kVPairUpdate };
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

  submitNewUser = () => {
    this.submitUserToServer();
  };

  private async deleteTaskToServer() {
    await authenticatedRequestWithBody(
      `/tasks/${this.newSuite.id}`,
      "",
      "DELETE"
    );

    window.location.reload();
  }

  private async submitUserToServer() {
    const body = JSON.stringify(this.newSuite);

    this.isLoading = true;
    await authenticatedRequestWithBody("/suites", body);
    this.isLoading = false;

    window.location.href = TaskPageUrl;

    // console.log("rrule string: ", rule.toString());
    // console.log("rrule description: ", rule.toText());
    // console.log("rrule reaccurrances:", rule.all());
  }
}
