import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { AddTaskButton } from "./AddTaskButton";
import { SingleTask } from "./SingleTask";
import { TaskViewState } from "./TaskViewState";

@observer
export class Tasks extends React.Component {
  @observable private viewState = new TaskViewState();

  render() {
    return (
      <Container>
        {this.viewState.testData.map((data) => {
          return (
            <SectionContainer>
              <SectionTitle>{data.taskSection.toDateString()}</SectionTitle>
              {data.taskDetails.map((details, index) => {
                return (
                  <SingleTask
                    key={index}
                    title={details.title}
                    onRepeat={details.onRepeat}
                    assignee={details.assignee}
                  />
                );
              })}
            </SectionContainer>
          );
        })}
        <StyledAddTaskButton />
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  margin: 8px;
  overflow-y: scroll;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  margin: 4px;
`;

const StyledAddTaskButton = styled(AddTaskButton)`
  position: fixed;
  bottom: calc(75px + 16px);
  right: 16px;
`;
