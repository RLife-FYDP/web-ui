import { authenticatedRequestWithBody } from "./../../api/apiClient";
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
  userOwe: {
    id: number;
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

        console.log(newValue, prevValue);

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

    const dataSplit = "?data=";
    let url = window.location.href;
    if (url.indexOf(dataSplit) !== -1) {
      let splitUrl = url.split(dataSplit);
      let data = JSON.parse(decodeURIComponent(splitUrl[splitUrl.length - 1]));
      this.newExpense = data as NewExpenseProps;
    }
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
      `/expense/${this.newExpense.id}`,
      "",
      "DELETE"
    );
    this.isLoading = false;

    window.location.href = ExpensePageUrl;
  }

  private async submitNewExpenseToServer() {
    if (!this.isSplitsTotalEqualToTotalAmount) {
      alert(
        "Sum of amounts not matching, which amount would you like to default to? (option of splits or total input)"
      );
      return;
    }

    const body: AddExpenseAPIProps = {
      description: this.newExpense.expenseName,
      totalAmount: parseInt(this.newExpense.amount.toString()),
      paidById: this.myUserId!,
      receiptImgLink: "",
      userOwe: this.newExpense.splits,
    };

    this.isLoading = true;
    await authenticatedRequestWithBody(
      "/expenses/create",
      JSON.stringify(body)
    );
    this.isLoading = false;

    window.location.href = ExpensePageUrl;
  }
}
