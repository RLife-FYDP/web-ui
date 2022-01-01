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
  id: string;
  amount: number;
  color: string;
}

interface NewExpenseProps {
  expenseName: string;
  amount: number;
  splits: SplitByAmount[];
  // TODO: attach image?
  receipt?: string;
}

interface RoommateProps {
  id: string;
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
      { id: "Justin", color: COLORS.Yellow },
      { id: "Marcus", color: COLORS.NavyBlue },
      { id: "Lincoln", color: COLORS.SkyBlue },
      { id: "Austin", color: COLORS.Teal },
    ];
  }

  @action
  setNewExpenseValueByKey = (kVPairUpdate: Partial<NewExpenseProps>) => {
    this.newExpense = { ...this.newExpense, ...kVPairUpdate };
  };

  @action
  setNewSplitAmountById = (id: string, amount: number) => {
    const splits = this.newExpense.splits;
    const matchingSplit = splits.find((split) => split.id === id);

    if (isNaN(amount)) {
      return;
    }

    matchingSplit!.amount = Math.round(amount * 100) / 100;
  };

  submitNewExpense = () => {
    console.log(this.newExpense.amount);
  };
}
