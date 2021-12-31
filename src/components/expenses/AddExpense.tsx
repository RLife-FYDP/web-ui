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
    this.viewState.setNewSplitAmountById(id, Number(value));
  };

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
            <AmountContainer widthPercent={30}>
              <AmountInput
                placeholder="0"
                name="amount"
                type="number"
                min={0}
                value={
                  this.viewState.newExpense.amount === 0
                    ? undefined
                    : this.viewState.newExpense.amount
                }
                onChange={this.updateTaskInput}
                onWheel={(event) => event.currentTarget.blur()}
              ></AmountInput>
            </AmountContainer>
          </Row>
          <UserAmountInputContainer>
            {splits.map((split, index) => {
              return (
                <SplitContainer>
                  <UserNameText>{split.id}: </UserNameText>
                  <AmountContainer
                    widthPercent={100}
                    progressPercent={
                      split.amount / this.viewState.newExpense.amount
                    }
                    color={split.color}
                  >
                    <UserAmountInput
                      key={index}
                      name={split.id}
                      min={0}
                      type="number"
                      backgroundColor={split.color}
                      value={split.amount === 0 ? undefined : split.amount}
                      onChange={this.updateSplitAmountById}
                      onWheel={(event) => event.currentTarget.blur()}
                    ></UserAmountInput>
                  </AmountContainer>
                </SplitContainer>
              );
            })}
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
  margin-bottom: 4px;
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
  width: 70%;
  margin-right: 4px;
`;

const AmountContainer = styled.div<{
  widthPercent: number;
  progressPercent?: number;
  color?: string;
}>`
  position: relative;
  width: ${({ widthPercent }) => widthPercent + "%"};

  &::before {
    content: "$";
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    height: calc(100% - 4px);
    margin-left: 4px;
    z-index: 100;
    color: ${COLORS.DarkGray};
  }

  &::after {
    content: "";
    z-index: -1;
    display: ${({ progressPercent }) =>
      progressPercent == null ? "none" : "block"};
    position: absolute;
    top: 0;
    left: 0;
    height: calc(100% - 4px);
    width: ${({ progressPercent }) =>
      progressPercent == null
        ? "0"
        : Math.min(100, progressPercent * 100) + "%"};
    background: ${({ color }) => (color == null ? "transparent" : color)};
    border-radius: 5px;
  }
`;

const AmountInput = styled(Input)`
  width: calc(100% - 24px);
  padding-left: 16px;
`;

const UserAmountInputContainer = styled.div``;

const SplitContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const UserNameText = styled.p``;

const UserAmountInput = styled(Input)<{
  backgroundColor: string;
}>`
  width: calc(100% - 24px);
  padding-left: 16px;
  // 4B = 75% opacity
  background: ${({ backgroundColor }) => backgroundColor + "4B"};
  border-radius: 5px;
`;
