import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { AddTaskViewState } from "./AddTaskViewState";

@observer
export class AddTask extends Component {
  @observable private viewState = new AddTaskViewState();

  updateTaskInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.viewState.setNewTaskValueByKey({
      [event.target.name]: event.target.value,
    });
  };

  updateTaskTextField = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.viewState.setNewTaskValueByKey({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <Container>
        <HeaderContainer>
          <StyledLink to="/tasks">Cancel</StyledLink>
          <Header>New Task</Header>
          <StyledLink to="/tasks" onClick={this.viewState.submitNewTask}>Add</StyledLink>
        </HeaderContainer>
        <FormContainer>
          <Input
            placeholder="What is your task?"
            name="taskName"
            value={this.viewState.newTask.taskName ?? ""}
            onChange={this.updateTaskInput}
          ></Input>
          <DescriptionInput
            placeholder="Description..."
            name="description"
            value={this.viewState.newTask.description ?? ""}
            onChange={this.updateTaskTextField}
          ></DescriptionInput>
          <Input
            placeholder="Tags"
            name="tags"
            value={this.viewState.newTask.tags ?? ""}
            onChange={this.updateTaskInput}
          ></Input>
          <Input
            placeholder="Assign to"
            name="assignee"
            value={this.viewState.newTask.assignee ?? ""}
            onChange={this.updateTaskInput}
          ></Input>
          <Input
            placeholder="Schedule"
            name="schedule"
            value={this.viewState.newTask.schedule ?? ""}
            onChange={this.updateTaskInput}
          ></Input>
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
  margin: 2px 0;
  padding: 4px 8px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background: ${COLORS.Graphite};
  vertical-align: top;
`;

const DescriptionInput = styled.textarea`
  resize: none;
  height: 120px;
  margin: 2px 0;
  padding: 4px 8px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background: ${COLORS.Graphite};
  vertical-align: top;
`;
