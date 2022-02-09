/* eslint-disable eqeqeq */
import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { Checkbox } from "../common/Checkbox";
import { SingleTaskProps } from "./AddTaskViewState";

import { ReactComponent as RepeatIcon } from "../../icons/RepeatIcon.svg";

interface SingleTaskViewProps {
  id: number;
  assigneeNames?: string[];
  onClick: (id: number) => void;
}

export const SingleTask: React.FC<SingleTaskProps & SingleTaskViewProps> = ({
  id,
  title: taskName,
  assigneeNames,
  rruleOptions,
  onClick,
}) => {
  let namesToShow =
    assigneeNames == undefined
      ? ""
      : assigneeNames.length > 1
      ? assigneeNames[0] + ` and ${assigneeNames.length - 1} more`
      : assigneeNames[0];

  return (
    <Container onClick={() => onClick(id)}>
      <InformationContainer>
        <Checkbox
          onClick={() => {
            console.log("clicked");
          }}
        />
        <TextContainer>
          <Title>{taskName}</Title>
          <Assignee>Assigned to {namesToShow}</Assignee>
        </TextContainer>
      </InformationContainer>
      {rruleOptions ? <StyledRepeatIcon /> : null}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 4px 0;
  width: 100%;
  height: fit-content;
  min-height: 85px;
  padding: 16px;
  border-radius: 15px;
  background: ${COLORS.Graphite};
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 16px;
`;

const Title = styled.p`
  font-size: 24px;
`;

const Assignee = styled.p`
  color: ${COLORS.NavyBlue};
`;

const StyledRepeatIcon = styled(RepeatIcon)`
  width: 30px;
  height: 30px;
`;
