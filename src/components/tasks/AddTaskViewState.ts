import { action, makeAutoObservable, observable } from "mobx";

interface NewTaskProps {
  taskName: string;
  description?: string;
  tags?: string;
  assignee?: string;
  // TODO: schedule needs to be some object that is cross compatible
  startDate?: Date;
  endDate?: Date;
}

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

  submitNewTask = () => {
    console.log(this.newTask.startDate);
  };
}
