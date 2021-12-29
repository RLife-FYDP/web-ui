import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { ExpensesViewState } from "./ExpensesViewState";
import { SingleExpense } from "./SingleExpense";

@observer
export class Expenses extends React.Component {
  @observable private viewState = new ExpensesViewState();

  render() {
    return (
      <Container>
        <HeaderContainer>
          <TitleContainer>
            <Title>All Expenses</Title>
            <Caption>You lent out $xx.xx</Caption>
          </TitleContainer>
          <AddExpenseButton to="/expenses/add">Add Expense</AddExpenseButton>
        </HeaderContainer>
        <ExpenseContainer>
          {this.viewState.testData.map((data, index) => (
            <SingleExpense
              key={index}
              date={data.date}
              category={data.category}
              paidBy={data.paidBy}
              state={data.state}
              amount={data.amount}
            ></SingleExpense>
          ))}
        </ExpenseContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
  margin-top: 24px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ExpenseContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 285px;
  margin: 16px 0;
`;

const Title = styled.h1`
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 24px;
`;

const Caption = styled.caption`
  font-size: 14px;
  color: ${COLORS.Yellow};
`;

const AddExpenseButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  color: ${COLORS.White};
  font-size: 14px;
  border-radius: 12px;
  border: none;
  background: ${COLORS.Orange};
  text-decoration: none;
`;
