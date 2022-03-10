import { action, computed, makeAutoObservable, observable } from "mobx";
import { authenticatedGetRequest, getUser } from "../../api/apiClient";
import { AccessTokenStorageKey } from "../../commonUtils/consts";
import { Suite, User } from "../../commonUtils/types";

export enum TaskType {
  CHAT,
  EXPENSE,
  TASK,
  CANVAS,
  ACHIEVEMENT,
}

interface NotificationAPIResponse {
  numNewExpenses: number
  numNewTasks: number
  numNewMessages: number
}

export interface NotificationProps {
  taskType: TaskType;
  numNotificationsMissed: number;
}

export interface NotificationBarProps {
  userName: string;
  roomName: string;
  notifications: NotificationProps[];
}

export class NotificationBarViewState {
  @observable isNotificationsVisible = true;
  @observable isLoading = true;
  @observable notifications?: NotificationAPIResponse;
  @observable user?: User
  @observable suite?: Suite

  constructor() {
    makeAutoObservable(this);
    this.init()
  }

  @action
  async init() {
    const accessToken = localStorage.getItem(AccessTokenStorageKey);
    if (!accessToken) return;
    this.user = await getUser()
    const resList = await Promise.all([authenticatedGetRequest(`/suites/${this.user.suiteId}`)])
    const [suiteData] = await Promise.all(resList.map(res => res?.json()))
    this.suite = {
      id: suiteData.id,
      name: suiteData.name,
      active: suiteData.active,
      canvas: suiteData.canvas,
      location: suiteData.location,
    }
    this.isLoading = false;
  }

  @action
  closeNotifications = () => {
    this.isNotificationsVisible = false;
  };

  @computed
  get testData(): NotificationProps[] {
    return [
      {
        taskType: TaskType.CHAT,
        numNotificationsMissed: this.notifications?.numNewMessages ?? 0,
      },
      {
        taskType: TaskType.EXPENSE,
        numNotificationsMissed: this.notifications?.numNewExpenses ?? 0,
      },
      {
        taskType: TaskType.TASK,
        numNotificationsMissed: this.notifications?.numNewTasks ?? 0,
      },
    ];
  }

  @computed
  get testName(): string {
    return this.user?.firstName ?? '';
  }

  @computed
  get roomName(): string {
    return this.suite?.name ?? '';
  }
}
