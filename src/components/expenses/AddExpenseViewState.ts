import {
  action,
  computed,
  makeAutoObservable,
  observable,
  reaction,
} from "mobx";
import COLORS from "../../commonUtils/colors";

interface SplitByAmount {
  // id of the roommate to be assigned to
  id: number;
  amount: number;
  color: string;
}

export interface NewExpenseProps {
  expenseName: string;
  amount: number;
  splits: SplitByAmount[];
  // TODO: attach image?
  receipt?: string;
}

interface RoommateProps {
  id: number;
  color: string;
}

export class AddExpenseViewState {
  @observable newExpense: NewExpenseProps = {
    expenseName: "",
    amount: 0,
    splits: [],
  };

  @observable isSplitsTotalEqualToTotalAmount: boolean = true;

  constructor() {
    makeAutoObservable(this);

    this.newExpense.splits = this.roommates.map((roommate) => ({
      id: roommate.id,
      amount: 0,
      color: roommate.color,
    }));

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
          this.newExpense.splits = this.roommates.map((roommate, _, arr) => ({
            id: roommate.id,
            amount: Math.round((newValue / arr.length) * 100) / 100,
            color: roommate.color,
          }));
        } else {
          this.isSplitsTotalEqualToTotalAmount = false;
        }
      }
    );
  }

  @computed
  get roommates(): RoommateProps[] {
    return [
      { id: 1, color: COLORS.Yellow },
      { id: 2, color: COLORS.NavyBlue },
      { id: 3, color: COLORS.SkyBlue },
      { id: 4, color: COLORS.Teal },
    ];
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
    if (!this.isSplitsTotalEqualToTotalAmount) {
      alert(
        "Sum of amounts not matching, which amount would you like to default to? (option of splits or total input)"
      );
    }
  };
}
