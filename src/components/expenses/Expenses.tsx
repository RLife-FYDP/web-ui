import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { Loading } from "../common/Loading";
import { ExpensesViewState } from "./ExpensesViewState";
import { SingleExpense } from "./SingleExpense";
import { styled as muiStyled } from "@mui/system";

@observer
export class Expenses extends React.Component {
  @observable private viewState = new ExpensesViewState();

  toggleExpenseFilterHandler = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: string | null
  ) => {
    if (newFilter === null) {
      return;
    }
    this.viewState.toggleExpenseListFilter(newFilter);
  };

  render() {
    return this.viewState.isLoading || !this.viewState.roommates ? (
      <Loading />
    ) : (
      <Container>
        <HeaderContainer>
          <TitleContainer>
            <Title>All Expenses</Title>
            <ToggleButtonGroup
              exclusive
              value={this.viewState.expenseFilterState}
              onChange={this.toggleExpenseFilterHandler}
            >
              <StyledToggleButton value="owed">Show owed</StyledToggleButton>
              <StyledToggleButton value="all">Show all</StyledToggleButton>
            </ToggleButtonGroup>
          </TitleContainer>
          <AddExpenseButton to="/expenses/add">Add Expense</AddExpenseButton>
        </HeaderContainer>
        <ExpenseContainer>
          {this.viewState.expenseData?.length === 0 ? (
            <h3>No Expenses Yet</h3>
          ) : (
            this.viewState.expenseData?.map((data, index) => (
              <SingleExpense
                key={index}
                id={data.id}
                date={data.date}
                name={data.name}
                paidBy={data.paidBy}
                state={data.state}
                amount={data.amount}
                onClick={this.viewState.reloadData}
                splits={[]}
              ></SingleExpense>
            ))
          )}
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
  max-height: 100%;
  overflow-y: scroll;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ExpenseContainer = styled.table`
  table-layout: fixed;
  width: 100%;
  margin: 16px 0;
`;

const Title = styled.h1`
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 24px;
`;

const AddExpenseButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding: 4px 16px;
  color: ${COLORS.White};
  font-size: 14px;
  border-radius: 12px;
  border: none;
  background: ${COLORS.Orange};
  text-decoration: none;
`;

const StyledToggleButton = muiStyled(ToggleButton)({
  height: "30px",
  margin: "2px 0",
  fontSize: "12px",
});
