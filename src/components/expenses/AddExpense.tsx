import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { AddExpenseViewState } from "./AddExpenseViewState";

@observer
export class AddExpense extends Component {
  @observable viewState = new AddExpenseViewState();

  updateTaskInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.viewState.setNewExpenseValueByKey({
      [event.target.name]: event.target.value,
    });
  };

  updateSplitAmountById = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.name;
    const value = event.target.value;
    this.viewState.setNewSplitAmountById(id, value);
  };

  processMoneyValue(amount: string): string {
    let strippedAmount = amount.split("$");
    let filteredAmount = strippedAmount[strippedAmount.length - 1];

    if (
      filteredAmount === "" ||
      filteredAmount === "0" ||
      filteredAmount === "$" ||
      isNaN(Number(filteredAmount))
    ) {
      return "";
    }

    return "$" + filteredAmount;
  }

  rawMoneyValue(amount: string): number {
    let strippedAmount = amount.toString().split("$");
    let filteredAmount = strippedAmount[strippedAmount.length - 1];

    if (
      filteredAmount === "" ||
      filteredAmount === "0" ||
      filteredAmount === "$" ||
      isNaN(Number(filteredAmount))
    ) {
      return 0;
    }

    return Number(filteredAmount);
  }

  @computed
  get totalExpenseAmount(): string {
    return this.processMoneyValue(this.viewState.newExpense.amount);
  }

  render() {
    const splits = this.viewState.newExpense.splits;

    return (
      <Container>
        <HeaderContainer>
          <StyledLink to="/expenses">Cancel</StyledLink>
          <Header>New Expense</Header>
          <StyledLink to="/expenses" onClick={this.viewState.submitNewExpense}>
            Add
          </StyledLink>
        </HeaderContainer>
        <FormContainer>
          <Row>
            <ExpenseNameInput
              placeholder="What is your expense?"
              name="expenseName"
              value={this.viewState.newExpense.expenseName ?? ""}
              onChange={this.updateTaskInput}
            ></ExpenseNameInput>
            <AmountInput
              placeholder="Amount"
              name="amount"
              value={this.totalExpenseAmount}
              onChange={this.updateTaskInput}
            ></AmountInput>
          </Row>
          {splits.length === 0 ? null : (
            <SplitContainer>
              {splits.map((split, index, arr) => {
                const totalAmount = this.rawMoneyValue(
                  this.viewState.newExpense.amount
                );
                return (
                  <UserAmountContainer
                    key={index}
                    width={split.amount / totalAmount}
                    color={split.color}
                    isFirstItem={index === 0}
                    isLastItem={index === arr.length - 1}
                  >
                    {/* <UserAmountName>{split.id}</UserAmountName>
                    <UserAmountSplit>${split.amount}</UserAmountSplit> */}
                  </UserAmountContainer>
                );
              })}
            </SplitContainer>
          )}
          <UserAmountInputContainer>
            {this.viewState.roommates.map((roommate, index) => (
              <UserAmountInput
                name={roommate.id}
                placeholder={roommate.id + "'s amount owed"}
                backgroundColor={roommate.color}
                value={this.viewState.newExpense.splits[index]?.amount ?? ""}
                onChange={this.updateSplitAmountById}
              ></UserAmountInput>
            ))}
          </UserAmountInputContainer>
        </FormContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 16px);
  margin: 8px;
  /* TODO: take in consideration of when the notification section is closed:
  e.g. height should be: calc(100% - x - x)
  */
  max-height: 350px;
  overflow-y: scroll;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const Header = styled.p`
  font-size: 18px;
`;

const StyledLink = styled(NavLink)`
  color: ${COLORS.NavyBlue};
  text-decoration: none;
`;

const Input = styled.input`
  height: 30px;
  margin: 2px 0;
  padding: 4px 8px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background: ${COLORS.Graphite};
  vertical-align: top;

  &:focus {
    outline: none;
  }
`;

const ExpenseNameInput = styled(Input)`
  width: 75%;
  margin-right: 4px;
`;

const AmountInput = styled(Input)`
  width: 25%;
`;

const SplitContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  margin: 2px 0;
  border: none;
  border-radius: 5px;
  background: ${COLORS.Graphite};
  color: ${COLORS.White};
`;

const UserAmountContainer = styled.div<{
  color: string;
  width: number;
  isFirstItem: boolean;
  isLastItem: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: smaller;
  // TODO: fix truncating text
  flex-basis: ${({ width }) => `${width * 100}%`};
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  background: ${({ color }) => color};
  border-top-left-radius: ${({ isFirstItem }) => (isFirstItem ? "5px" : "0")};
  border-bottom-left-radius: ${({ isFirstItem }) =>
    isFirstItem ? "5px" : "0"};
  border-top-right-radius: ${({ isLastItem }) => (isLastItem ? "5px" : "0")};
  border-bottom-right-radius: ${({ isLastItem }) => (isLastItem ? "5px" : "0")};
`;

const UserAmountName = styled.p``;

const UserAmountSplit = styled.p``;

const UserAmountInputContainer = styled.div``;

const UserAmountInput = styled(Input)<{
  backgroundColor: string;
}>`
  width: calc(100% - 16px);
  // 4B = 75% opacity
  background: ${({ backgroundColor }) => backgroundColor + "4B"};
  border-radius: 5px;
`;
