import { computed, makeAutoObservable } from "mobx";

export enum ExpenseCategory {
  GROCERY = "Groceries",
  ENTERTAINMENT = "Entertainment",
  BILL = "Bills",
}

export enum ExpenseState {
  SETTLED = "Settled!",
  OWED = "You owe",
  PAID = "You paid",
}

export interface SingleExpenseProps {
  date: Date;
  category: ExpenseCategory;
  paidBy: String;
  state: ExpenseState;
  amount: String;
}

interface ExpenseResponseProps {

}

export class ExpensesViewState {
  // @observable private responseData?: 

  constructor() {
    makeAutoObservable(this);

    this.init();
  }

  async init() {

  }

  @computed
  get testData(): SingleExpenseProps[] {
    return [
      {
        date: new Date(),
        category: ExpenseCategory.GROCERY,
        paidBy: "Austin",
        state: ExpenseState.OWED,
        amount: "$40.12",
      },
      {
        date: new Date(),
        category: ExpenseCategory.GROCERY,
        paidBy: "You",
        state: ExpenseState.SETTLED,
        amount: "",
      },
      {
        date: new Date(),
        category: ExpenseCategory.GROCERY,
        paidBy: "Austin",
        state: ExpenseState.PAID,
        amount: "$40.12",
      },
    ];
  }
}
