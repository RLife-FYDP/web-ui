import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { Checkbox } from "../common/Checkbox";
import { SingleTaskProps } from "./TaskViewState";

import { ReactComponent as RepeatIcon } from "../../icons/RepeatIcon.svg";

export const SingleTask: React.FC<SingleTaskProps> = ({
  title,
  assignee,
  onRepeat
}) => {
  return (
    <Container>
      <InformationContainer>
        <Checkbox
          onClick={() => {
            console.log("clicked");
          }}
        />
        <TextContainer>
          <Title>{title}</Title>
          <Assignee>Assigned to {assignee}</Assignee>
        </TextContainer>
      </InformationContainer>
      {onRepeat ? <StyledRepeatIcon /> : null}
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

const Assignee = styled.caption`
  color: ${COLORS.NavyBlue};
`;

const StyledRepeatIcon = styled(RepeatIcon)`
  width: 30px;
  height: 30px;
`;