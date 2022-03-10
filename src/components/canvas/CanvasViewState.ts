import {
  authenticatedGetRequest,
  authenticatedRequestWithBody,
} from "./../../api/apiClient";
import { action, makeAutoObservable, observable } from "mobx";
import { getUser } from "../../api/apiClient";

export class CanvasViewState {
  private suiteId?: number;
  @observable canvasData?: string;
  @observable isLoading = false;
  @observable isUpdating = false;

  constructor() {
    makeAutoObservable(this);

    this.init();
  }

  @action
  async init() {
    this.loadingState = true;
    const { suiteId } = await getUser();
    const res = await authenticatedGetRequest(`/suites/${suiteId}`);
    const suiteData: { canvas: string } = await res?.json();

    this.suiteId = suiteId;
    this.newCanvasString = suiteData.canvas;
    this.loadingState = false;
  }

  @action
  set loadingState(state: boolean) {
    this.isLoading = state;
  }

  async updateCanvasToServer(data: string) {
    let body = {
      canvas: data,
    };

    this.updateState = true;
    await authenticatedRequestWithBody(
      `/suites/${this.suiteId}/update_canvas`,
      JSON.stringify(body),
      "PUT"
    );
    this.updateState = false;
  }

  @action
  set newCanvasString(canvas: string) {
    this.canvasData = canvas;
  }

  @action
  set updateState(state: boolean) {
    this.isUpdating = state;
  }
}
