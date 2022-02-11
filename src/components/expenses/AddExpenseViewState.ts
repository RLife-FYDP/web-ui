import { ExpenseResponseProps } from "./ExpensesViewState";
import {
  authenticatedGetRequest,
  authenticatedRequestWithBody,
} from "./../../api/apiClient";
import axios from "axios";
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  reaction,
} from "mobx";
import { getUser } from "../../api/apiClient";
import { ExpensePageUrl } from "../../commonUtils/consts";

export interface SplitByAmount {
  // id of the roommate to be assigned to
  id: number;
  amount: number;
  color: string;
}

export interface NewExpenseProps {
  id?: number;
  expenseName: string;
  amount: number;
  splits: SplitByAmount[];
  // TODO: attach image?
  receipt?: string;
}

interface RoommateProps {
  first_name: string;
  last_name: string;
  id: number;
  color: string;
}

interface AddExpenseAPIProps {
  description: string;
  totalAmount: number;
  paidById: number;
  receiptImgLink?: string;
  userOwe?: {
    id: number;
    amount: number;
  }[];
  userExpenses?: {
    userId: number;
    paidAt: string | null;
    amount: number;
  }[];
}

export class AddExpenseViewState {
  @observable newExpense: NewExpenseProps = {
    expenseName: "",
    amount: 0,
    splits: [],
  };

  @observable isSplitsTotalEqualToTotalAmount: boolean = true;

  @observable private roommateData?: RoommateProps[];
  @observable isLoading: boolean = false;

  private fetchedExpenseDetails?: ExpenseResponseProps;

  private myUserId?: number;

  constructor() {
    makeAutoObservable(this);
    this.init();

    reaction(
      () => this.newExpense.amount,
      (newValue, prevValue) => {
        if (isNaN(newValue) || prevValue === newValue) {
          return;
        }

        const isPreviouslySplitEqual =
          this.newExpense.splits.every(
            (split, _, arr) =>
              split.amount === Math.round((prevValue / arr.length) * 100) / 100
          ) ||
          this.newExpense.splits.every(
            (split, _, arr) => split.amount === arr[0].amount
          );

        if (isPreviouslySplitEqual) {
          this.newExpense.splits =
            this.roommates?.map((roommate, _, arr) => ({
              id: roommate.id,
              amount: Math.round((newValue / arr.length) * 100) / 100,
              color: roommate.color,
            })) ?? [];
        } else {
          let sum = this.newExpense.splits.reduce(
            (acc, split) => split.amount + acc,
            0
          );
          this.isSplitsTotalEqualToTotalAmount = sum === newValue;
        }
      }
    );
  }

  @action
  async init() {
    this.isLoading = true;
    const user = await getUser();
    const response = await axios.get(
      `http://localhost:8080/suites/${user.suiteId}/users`
    );
    this.roommateData = response.data;
    this.myUserId = user.id;

    this.newExpense.splits =
      this.roommates?.map((roommate) => ({
        id: roommate.id,
        amount: 0,
        color: roommate.color,
      })) ?? [];

    const idSplit = "?id=";
    let url = window.location.href;
    if (url.indexOf(idSplit) !== -1) {
      // edit existing task
      let splitUrl = decodeURI(url).split(idSplit);
      let id = splitUrl[splitUrl.length - 1];
      let taskDetailsResp = await authenticatedGetRequest(`/expenses/${id}`);
      let taskDetailsJson: ExpenseResponseProps & {
        user_expenses: {
          amount_owe: number;
          paid_at: string | null;
          user_id: number;
        }[];
      } = await taskDetailsResp?.json();

      this.fetchedExpenseDetails = taskDetailsJson;

      this.newExpense = {
        id: taskDetailsJson.expense_item_id,
        expenseName: taskDetailsJson.expense_item_description,
        amount: taskDetailsJson.expense_item_total_amount,
        splits: taskDetailsJson.user_expenses.map((expense) => {
          return {
            id: expense.user_id,
            amount: expense.amount_owe,
            color: "",
          };
        }),
        receipt: taskDetailsJson.expense_receipt_url,
      };
    }
    this.isLoading = false;
  }

  getUserNameById = (id: number) => {
    return this.roommates?.find((roommate) => roommate.id === id)?.first_name;
  };

  @computed
  get roommates(): RoommateProps[] | undefined {
    return this.roommateData;
  }

  @action
  setNewExpenseValueByKey = (kVPairUpdate: Partial<NewExpenseProps>) => {
    this.newExpense = { ...this.newExpense, ...kVPairUpdate };
  };

  @action
  setNewSplitAmountById = (id: number, amount: number) => {
    const splits = this.newExpense.splits;
    const matchingSplit = splits.find((split) => split.id === id);

    if (isNaN(amount)) {
      return;
    }

    const roundedAmount = Math.round(amount * 100) / 100;
    matchingSplit!.amount = roundedAmount;

    this.newExpense.amount = splits.reduce(
      (acc, split) => acc + split.amount,
      0
    );
  };

  submitNewExpense = () => {
    this.submitNewExpenseToServer();
  };

  deleteExpense = () => {
    this.deleteExpenseToServer();
  };

  @action
  private async deleteExpenseToServer() {
    this.isLoading = true;
    await authenticatedRequestWithBody(
      `/expenses/${this.newExpense.id}`,
      "",
      "DELETE"
    );
    this.isLoading = false;

    window.location.href = ExpensePageUrl;
  }

  private async submitNewExpenseToServer() {
    if (!this.isSplitsTotalEqualToTotalAmount) {
      return alert(
        "Sum of amounts not matching, which amount would you like to default to? (option of splits or total input)"
      );
    }

    const body: AddExpenseAPIProps = {
      description: this.newExpense.expenseName,
      totalAmount: parseInt(this.newExpense.amount.toString()),
      paidById: this.myUserId!,
      receiptImgLink: "",
    };

    if (this.newExpense.id !== undefined) {
      body.userExpenses = this.newExpense.splits.map((split) => {
        return {
          amount: split.amount,
          userId: split.id,
          paidAt:
            this.fetchedExpenseDetails?.user_expenses?.find(
              (expense) => expense.user_id === split.id
            )?.paid_at ?? null,
        };
      });
    } else {
      body.userOwe = this.newExpense.splits;
    }

    const url = this.newExpense.id
      ? `/expenses/${this.newExpense.id}`
      : "/expenses/create";

    this.isLoading = true;
    await authenticatedRequestWithBody(
      url,
      JSON.stringify(body),
      this.newExpense.id ? "PUT" : "POST"
    );
    this.isLoading = false;

    window.location.href = ExpensePageUrl;
  }
}
