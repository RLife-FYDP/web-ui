import { action, computed, makeAutoObservable, observable } from "mobx";

export enum TaskType {
  CHAT,
  EXPENSE,
  TASK,
  CANVAS,
  ACHIEVEMENT,
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

  constructor() {
    makeAutoObservable(this);
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
        numNotificationsMissed: 4,
      },
      {
        taskType: TaskType.EXPENSE,
        numNotificationsMissed: 4,
      },
      {
        taskType: TaskType.EXPENSE,
        numNotificationsMissed: 4,
      },
      {
        taskType: TaskType.EXPENSE,
        numNotificationsMissed: 4,
      },
    ];
  }

  @computed
  get testName(): string {
    return "Lincoln";
  }

  @computed
  get roomName(): string {
    return "Fergus House";
  }
}
