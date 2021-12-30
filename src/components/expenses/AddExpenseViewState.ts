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
  amount: string;
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
    amount: "0",
    splits: [],
  };

  @observable isSplitsTotalEqualToTotalAmount: boolean = true;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.newExpense.amount,
      (newAmount, prevAmount) => {
        const prevValue = Number(prevAmount.replaceAll("$", ""));
        const newValue = Number(newAmount.replaceAll("$", ""));

        if (isNaN(newValue) || isNaN(prevValue) || prevValue === newValue) {
          return;
        }

        const isPreviouslySplitEqual = this.newExpense.splits.every(
          (split, _, arr) => split.amount === prevValue / arr.length
        );

        if (isPreviouslySplitEqual) {
          this.newExpense.splits = this.roommates.map((roommate, _, arr) => ({
            id: roommate.id,
            amount: newValue / arr.length,
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
  setNewSplitAmountById = (id: string, amount: string) => {
    const splits = this.newExpense.splits;
    const matchingSplit = splits.find((split) => split.id === id);
    const filteredAmount = Number(amount.replaceAll("$", ""));

    if (isNaN(Number(filteredAmount))) {
      return "";
    }

    if (matchingSplit === undefined) {
      const colorById =
        this.roommates.find((roommate) => roommate.id === id)?.color ?? "";

      splits.push({
        id,
        amount: Number(filteredAmount),
        color: colorById,
      });
      return;
    }

    matchingSplit!.amount = Number(filteredAmount);
  };

  submitNewExpense = () => {
    console.log(this.newExpense.amount);
  };
}
