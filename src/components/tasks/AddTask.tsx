import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { AddTaskViewState } from "./AddTaskViewState";
import { DatePicker } from "@mui/lab";
import TextField from "@mui/material/TextField";

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

  updateDateFields = (type: string, date?: Date | undefined | null) => {
    this.viewState.setNewTaskValueByKey({
      [type]: date,
    });
  };

  render() {
    const { newTask } = this.viewState;
    return (
      <Container>
        <HeaderContainer>
          <StyledLink to="/tasks">Cancel</StyledLink>
          <Header>New Task</Header>
          <StyledLink to="/tasks" onClick={this.viewState.submitNewTask}>
            Add
          </StyledLink>
        </HeaderContainer>
        <FormContainer>
          <Input
            placeholder="What is your task?"
            name="taskName"
            value={newTask.taskName ?? ""}
            onChange={this.updateTaskInput}
          ></Input>
          <DescriptionInput
            placeholder="Description..."
            name="description"
            value={newTask.description ?? ""}
            onChange={this.updateTaskTextField}
          ></DescriptionInput>
          <Input
            placeholder="Assign to"
            name="assignee"
            value={newTask.assignee ?? ""}
            onChange={this.updateTaskInput}
          ></Input>
          <DatePicker
            onChange={(date) => this.updateDateFields("startDate", date)}
            value={newTask.startDate ?? null}
            renderInput={({ inputRef, inputProps }) => (
              <Input
                ref={inputRef}
                {...inputProps}
                placeholder="Due Date? (Start of repeated tasks)"
              ></Input>
            )}
          />
          <DatePicker
            onChange={(date) => this.updateDateFields("endDate", date)}
            value={newTask.endDate ?? null}
            renderInput={({ inputRef, inputProps }) => (
              <Input
                ref={inputRef}
                {...inputProps}
                placeholder="End Date? (Input for repeated tasks)"
              ></Input>
            )}
          />
        </FormContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 16px);
  max-height: 100%;
  margin: 8px;
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

  &:focus {
    outline: none;
  }
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

  &:focus {
    outline: none;
  }
`;

const StyledMUITextField = styled(TextField)`
  padding: 0;
  background: ${COLORS.Graphite};
  border-radius: 5px;
  input {
    margin: 2px 0;
    padding: 4px 8px;
    font-size: 18px;

    &:focus {
      outline: none;
    }
  }

  fieldset {
    border: none;
  }
`;
