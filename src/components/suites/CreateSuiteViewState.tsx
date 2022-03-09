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
  users: Roommate[]
}

interface ResponseProps {
  first_name: string;
  last_name: string;
  id: number;
}

export interface Roommate {
  type: 'email' | 'user'
  email?: string
  userId?: number
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
    users: []
  };

  @observable private roommateData?: ResponseProps[];
  @observable matches: User[] = []
  @observable isLoading: boolean = false;
  @observable emailInputField: string = ''
  private user?: User

  constructor(taskToEdit?: SingleSuiteProps) {
    makeAutoObservable(this);
    this.init();

    this.newSuite = taskToEdit ?? this.newSuite;
  }

  async init() {
    this.user = await getUser();
    const response = await axios.get(
      `http://localhost:8080/suites/${this.user.suiteId}/users`
    );
    this.roommateData = response.data;
    const res = await authenticatedGetRequest(`/matches/${this.user.id}/findMatches`)
    const matches = await res!.json()
    this.matches = matches.map((matchedUser: any) => {
      const user: User = {
        age: matchedUser.age,
        birthday: new Date(matchedUser.birthday),
        createdAt: new Date(matchedUser.created_at),
        email: matchedUser.email,
        expenseItems: [], // TODO
        firstName: matchedUser.first_name,
        gender: matchedUser.gender,
        id: matchedUser.id,
        lastName: matchedUser.last_name,
        location: {}, //TODO
        profileImageLink: matchedUser.profile_img_link,
        rating: matchedUser.rating,
        setting: {}, // TODO
        suiteId: matchedUser.suite.id,
        updatedAt: new Date(matchedUser.updated_at),
      };
      return user
    })
  }

  @computed
  get roommates(): ResponseProps[] | undefined {
    return this.roommateData;
  }

  @action
  setNewSuiteValueByKey = (kVPairUpdate: Partial<SingleSuiteProps>) => {
    this.newSuite = { ...this.newSuite, ...kVPairUpdate };
  };

  @action
  setEmailInputField = (newValue: string) => {
    this.emailInputField = newValue;
  }

  @action
  addRoommateByEmail = (roommateEmail: string) => {
    this.newSuite.users.push({type: 'email', email: roommateEmail})
    this.setEmailInputField('')
  }

  @action
  addRoommateByUserIds = (userIds: number[]) => {
    this.newSuite.users = this.newSuite.users.filter(roommate => roommate.type !== 'user').concat(userIds.map(userId => ({type: 'user', userId})))
  }

  @action
  deleteRoommateByIndex = (index: number) => {
    this.newSuite.users.splice(index, 1)
  }

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

  submitNewSuite = () => {
    this.submitSuiteToServer();
  };

  private async deleteTaskToServer() {
    await authenticatedRequestWithBody(
      `/tasks/${this.newSuite.id}`,
      "",
      "DELETE"
    );

    window.location.reload();
  }

  private async submitSuiteToServer() {
    const suite = {...this.newSuite}
    suite.users = [...this.newSuite.users]
    suite.users.push({type: 'user', userId: this.user?.id})
    const body = JSON.stringify(suite);
    console.log(this.newSuite)
    this.isLoading = true;
    await authenticatedRequestWithBody("/suites/create", body);
    this.isLoading = false;

    window.location.href = TaskPageUrl;

    // console.log("rrule string: ", rule.toString());
    // console.log("rrule description: ", rule.toText());
    // console.log("rrule reaccurrances:", rule.all());
  }
}
