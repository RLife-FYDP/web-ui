import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { Loading } from "../common/Loading";
import { AddTaskButton } from "./AddTaskButton";
import { SingleTask } from "./SingleTask";
import { TaskViewState } from "./TaskViewState";

@observer
export class Tasks extends React.Component {
  @observable private viewState = new TaskViewState();

  render() {
    const today = new Date();
    const tasks = this.viewState.assignedTasks;
    return (
      <Container>
        {tasks === undefined ? (
          <Loading />
        ) : (
          tasks.map((data, index) => {
            const header =
              data.taskSection < today
                ? "Overdue"
                : data.taskSection.toString();
            return (
              <SectionContainer key={index}>
                <SectionTitle>{header}</SectionTitle>
                {data.taskDetails.map((details) => {
                  return (
                    <SingleTask
                      key={details.id}
                      id={details.id}
                      title={details.title}
                      onRepeat={details.onRepeat}
                      assignee={details.assignee}
                    />
                  );
                })}
              </SectionContainer>
            );
          })
        )}
        {tasks === undefined ? null : <StyledAddTaskButton />}
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
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
