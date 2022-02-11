import axios from "axios";
import { action, computed, makeAutoObservable, observable } from "mobx";
import { authenticatedGetRequest, getUser } from "../../api/apiClient";
import { SplitByAmount } from "./AddExpenseViewState";

export enum ExpenseCategory {
  GROCERY = "Groceries",
  ENTERTAINMENT = "Entertainment",
  BILL = "Bills",
}

export interface SingleExpenseProps {
  id?: number;
  date: Date;
  name: string;
  paidBy: string;
  state: string | null | undefined;
  amount: number;
  splits: SplitByAmount[];
}

interface RoommateProps {
  first_name: string;
  last_name: string;
  id: number;
}

interface ExpenseResponseProps {
  expense_item_id: number;
  amount_owe: number;
  expense_item_description: string;
  expense_item_paid_by_user_id: number;
  expense_item_total_amount: number;
  expense_receipt_url?: string;
  paid_at: string;
}

export class ExpensesViewState {
  @observable private responseData?: ExpenseResponseProps[];
  @observable private roommateData?: RoommateProps[];
  @observable isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);

    this.init();
  }

  @action
  async init() {
    this.isLoading = true;

    const resp = await authenticatedGetRequest("/users/expenses");
    const data = await resp?.json();

    const user = await getUser();
    const response = await axios.get(
      `http://localhost:8080/suites/${user.suiteId}/users`
    );
    this.roommateData = response.data;
    this.responseData = data;
    this.isLoading = false;
  }

  @action
  reloadData = () => {
    this.responseData = undefined;
    this.roommateData = undefined;
    this.init();
  };

  @computed
  get expenseData(): SingleExpenseProps[] | undefined {
    return this.responseData
      ?.map((data) => {
        return {
          id: data.expense_item_id,
          date: new Date(data.paid_at),
          name: data.expense_item_description,
          paidBy: this.getUserNameById(data.expense_item_paid_by_user_id)!,
          state: data.paid_at,
          amount: data.amount_owe,
        } as SingleExpenseProps;
      })
      .filter((data) => !data.state)
      .sort(
        (expenseA, expenseB) =>
          expenseA.date.valueOf() - expenseB.date.valueOf()
      );
  }

  @computed
  get roommates(): RoommateProps[] | undefined {
    return this.roommateData;
  }

  getUserNameById = (id: number) => {
    return this.roommates?.find((roommate) => roommate.id === id)?.first_name;
  };
}
