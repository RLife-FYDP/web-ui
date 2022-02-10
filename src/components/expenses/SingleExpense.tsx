import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { SingleExpenseProps } from "./ExpensesViewState";
import { ReactComponent as GroceryIcon } from "../../icons/GroceryIcon.svg";
import { NewExpenseProps } from "./AddExpenseViewState";
import { ExpensePageUrl } from "../../commonUtils/consts";

export const SingleExpense: React.FC<SingleExpenseProps> = ({
  date,
  category,
  paidBy,
  state,
  amount,
}) => {
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  const onClickExpense = () => {
    let obj: NewExpenseProps = {
      expenseName: "test",
      amount: 4,
      splits: [{ id: 1, amount: 2, color: COLORS.NavyBlue }],
      receipt: "example.com",
    };

    window.location.href = encodeURI(
      `${ExpensePageUrl}/add/${JSON.stringify(obj)}`
    );
  };

  return (
    <TableRow onClick={onClickExpense}>
      <TableCell>
        <CreatedDateContainer>
          <CreatedDate>
            <Month>{month}</Month>
            <Day>{day}</Day>
          </CreatedDate>
        </CreatedDateContainer>
      </TableCell>
      <TableCell>
        <Category>
          <GroceryIcon />
          {category}
        </Category>
      </TableCell>
      <TableCell>
        <Payee>
          <PaidBy>Paid By</PaidBy>
          <PaidByName>{paidBy}</PaidByName>
        </Payee>
      </TableCell>
      <TableCell>
        <StateContainer>
          <State>
            <StateHeader>{state}</StateHeader>
            <Amount>{amount}</Amount>
          </State>
        </StateContainer>
      </TableCell>
    </TableRow>
  );
};

const TableRow = styled.tr`
  border-spacing: 0;
`;

const TableCell = styled.td`
  padding-bottom: 16px;
`;

const CreatedDateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CreatedDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 8px;
`;

const Month = styled.p`
  font-size: 12px;
`;
const Day = styled.p`
  font-size: 20px;
`;

const Category = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Payee = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PaidBy = styled.p`
  font-size: 12px;
  color: ${COLORS.Gray};
`;

const PaidByName = styled.p`
  font-size: 20px;
`;

const StateContainer = styled(CreatedDateContainer)`
  align-items: center;
`;

const State = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
`;

const StateHeader = styled.p`
  font-size: 12px;
  color: ${COLORS.Gray};
`;

const Amount = styled.p`
  font-size: 20px;
`;
