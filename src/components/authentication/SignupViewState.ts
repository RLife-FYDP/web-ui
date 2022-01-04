import { action, computed, makeAutoObservable, observable } from "mobx";

export enum State {
  // select signup or signin
  INTRO,
  // email verification page
  SIGNUP_EMAIL_VERIFICATION,
  // signup: user name and password page
  SIGNUP_ID,
  // login: user name and password page
  LOGIN_ID,
  // select either create or create room
  ROOM_OPTIONS,
  // UI for room search
  ROOM_SEARCH,
  // UI for room create
  ROOM_CREATE,
  // take to home (chat) page
  HOME,
}

export class SignupViewState {
  @observable private state: State = State.INTRO;

  constructor() {
    makeAutoObservable(this);
  }

  @computed
  get authState() {
    return this.state;
  }

  @action
  set newAuthState(state: State) {
    this.state = state;
  }
}
