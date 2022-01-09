import axios from "axios";
import { computed, makeAutoObservable } from "mobx";

export interface SingleTaskProps {
  title: String;
  onRepeat: Boolean;
  assignee: String;
}

interface TaskProps {
  taskSection: Date;
  taskDetails: SingleTaskProps[];
}

export class TaskViewState {
  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    const response = await axios.get("http://localhost:8080/suites/4/tasks");
    console.log(response);
  }

  @computed
  get testData(): TaskProps[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      {
        taskSection: today,
        taskDetails: [
          {
            title: "Wash Dishes",
            onRepeat: true,
            assignee: "Austin",
          },
          {
            title: "Wash Dishes",
            onRepeat: false,
            assignee: "Austin",
          },
          {
            title: "Wash Dishes",
            onRepeat: true,
            assignee: "Austin",
          },
        ],
      },
      {
        taskSection: tomorrow,
        taskDetails: [
          {
            title: "Wash Dishes",
            onRepeat: true,
            assignee: "Austin",
          },
          {
            title: "Wash Dishes",
            onRepeat: true,
            assignee: "Austin",
          },
          {
            title: "Wash Dishes",
            onRepeat: true,
            assignee: "Austin",
          },
        ],
      },
    ];
  }
}
