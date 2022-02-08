/* eslint-disable eqeqeq */
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { Loading } from "../common/Loading";
import { AddTask } from "./AddTask";
import { AddTaskButton } from "./AddTaskButton";
import { AddTaskViewState } from "./AddTaskViewState";
import { SingleTask } from "./SingleTask";
import { TaskViewState } from "./TaskViewState";

interface TasksState {
  isEditState: number | undefined;
}

@observer
export class Tasks extends React.Component<{}, TasksState> {
  @observable private viewState = new TaskViewState();
  @observable private addTaskViewState = new AddTaskViewState();

  constructor(props: {}) {
    super(props);
    this.state = {
      isEditState: undefined,
    };
  }

  handleViewTask = (id: number) => {
    console.log(`Selected ${id} to edit`);
    this.setState({
      isEditState: id,
    });
  };

  render() {
    const tasks = this.viewState.assignedTasks;
    const today = new Date();
    return (
      <Container>
        {tasks == undefined ? (
          <Loading />
        ) : this.state.isEditState == undefined ? (
          tasks.map((data, index) => {
            const header =
              data.taskSection < today
                ? "Overdue"
                : data.taskSection.toLocaleDateString();
            return (
              <SectionContainer key={index}>
                <SectionTitle>{header}</SectionTitle>
                {data.taskDetails.map((details) => {
                  return (
                    <SingleTask
                      key={details.id}
                      id={details.id}
                      title={details.title}
                      rruleOptions={details.rruleOptions}
                      assigneeNames={details.assignee?.map(id => this.addTaskViewState.getNameById(id, false) ?? '')}
                      onClick={this.handleViewTask}
                    />
                  );
                })}
              </SectionContainer>
            );
          })
        ) : (
          <AddTask
            taskToEdit={this.viewState.getTaskDetailsById(
              this.state.isEditState
            )}
            dismiss={() => this.setState({ isEditState: undefined })}
          />
        )}
        {tasks == undefined ? null : <StyledAddTaskButton />}
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
