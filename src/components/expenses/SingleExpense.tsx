import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { SingleExpenseProps } from "./ExpensesViewState";

export const SingleExpense: React.FC<SingleExpenseProps> = ({
  date,
  category,
  paidBy,
  state,
  amount,
}) => {
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return (
    <Container>
      <CreatedDataContainer>
        <CreatedDate>
          <Month>{month}</Month>
          <Day>{day}</Day>
        </CreatedDate>
      </CreatedDataContainer>
      <Category>
        {"<ICON>"}
        {category}
      </Category>
      <Payee>
        <PaidBy>Paid By</PaidBy>
        <PaidByName>{paidBy}</PaidByName>
      </Payee>
      <StateContainer>
        <State>
          <StateHeader>{state}</StateHeader>
          <Amount>{amount}</Amount>
        </State>
      </StateContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin: 8px 0;
`;

const CreatedDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-basis: 25%;
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
  flex-basis: 25%;
`;

const Payee = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: 25%;
`;

const PaidBy = styled.p`
  font-size: 12px;
  color: ${COLORS.Gray};
`;

const PaidByName = styled.p`
  font-size: 20px;
`;

const StateContainer = styled(CreatedDataContainer)`
  align-items: flex-end;
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
