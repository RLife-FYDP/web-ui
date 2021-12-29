import { action, makeAutoObservable, observable } from "mobx";
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

export class AddExpenseViewState {
  @observable newExpense: NewExpenseProps = {
    expenseName: "",
    amount: 100,
    splits: [
      {
        id: "Me",
        amount: 32,
        color: COLORS.NavyBlue,
      },
      {
        id: "Austin",
        amount: 47,
        color: COLORS.Teal,
      },
      {
        id: "Lincoln",
        amount: 21,
        color: COLORS.Yellow,
      },
    ],
  };

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setNewExpenseValueByKey = (kVPairUpdate: Partial<NewExpenseProps>) => {
    this.newExpense = { ...this.newExpense, ...kVPairUpdate };
  };

  submitNewExpense = () => {
    console.log(this.newExpense.amount);
  };
}
