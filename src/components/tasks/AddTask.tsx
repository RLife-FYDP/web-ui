import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { AddTaskViewState } from "./AddTaskViewState";
import { DatePicker, ToggleButton } from "@mui/lab";
import { styled as muiStyled } from "@mui/system";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface AddTaskProps {}

interface AddTaskState {
  isRepeatableEvent: boolean;
}

@observer
export class AddTask extends React.Component<AddTaskProps, AddTaskState> {
  @observable private viewState = new AddTaskViewState();

  // Not sure why @observable isn't working on isRepeatableEvent...
  // will resort to state for now
  constructor(props: AddTaskProps) {
    super(props);
    this.state = {
      isRepeatableEvent: false,
    };
  }

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
          <ToggleButtonGroup
            value={this.state.isRepeatableEvent}
            exclusive
            onChange={(_, isRepeatableEvent) => {
              this.setState({
                isRepeatableEvent: isRepeatableEvent ?? false,
              });
            }}
          >
            <StyledToggleButton value={false}>One time task</StyledToggleButton>
            <StyledToggleButton value={true}>Repeating task</StyledToggleButton>
          </ToggleButtonGroup>
          <DatePicker
            onChange={(date) => this.updateDateFields("startDate", date)}
            value={newTask.startDate ?? null}
            renderInput={({ inputRef, inputProps }) => (
              <Input
                ref={inputRef}
                {...inputProps}
                placeholder={
                  this.state.isRepeatableEvent ? "Start Date" : "Day of task"
                }
              ></Input>
            )}
          />
          {this.state.isRepeatableEvent ? (
            <DatePicker
              onChange={(date) => this.updateDateFields("endDate", date)}
              value={newTask.endDate ?? null}
              renderInput={({ inputRef, inputProps }) => (
                <Input
                  ref={inputRef}
                  {...inputProps}
                  placeholder="End Date"
                ></Input>
              )}
            />
          ) : null}
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

const StyledToggleButton = muiStyled(ToggleButton)({
  height: "30px",
  width: "50%",
  margin: "2px 0",
});
