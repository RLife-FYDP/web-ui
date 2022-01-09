import { makeAutoObservable } from "mobx";

export class SettingsViewState {
  constructor() {
    makeAutoObservable(this);
  }
}
