import { makeAutoObservable } from "mobx";

export class CanvasViewState {
  constructor() {
    makeAutoObservable(this);
  }
}
