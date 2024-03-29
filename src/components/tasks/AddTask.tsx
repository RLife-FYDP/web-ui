/* eslint-disable eqeqeq */
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import {
  AddTaskViewState,
  SingleTaskProps,
  RRuleFrequencies,
  RRuleWeekdayIntervals,
} from "./AddTaskViewState";
import { DatePicker } from "@mui/lab";
import { styled as muiStyled } from "@mui/system";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FormControl, MenuItem, Select, ToggleButton } from "@mui/material";
import { Frequency, Weekday } from "rrule";
import { Loading } from "../common/Loading";

interface AddTaskProps {
  taskToEdit?: SingleTaskProps | undefined;
  dismiss?: () => void;
}

interface AddTaskState {
  isRepeatableEvent: boolean;
}

@observer
export class AddTask extends React.Component<AddTaskProps, AddTaskState> {
  @observable private viewState = new AddTaskViewState(this.props.taskToEdit);

  // Not sure why @observable isn't working on isRepeatableEvent...
  // will resort to state for now
  constructor(props: AddTaskProps) {
    super(props);
    this.state = {
      isRepeatableEvent: !!this.props.taskToEdit?.rruleOptions,
    };
  }

  handleIsRepeatableEventChange = (state: boolean) => {
    this.setState({
      isRepeatableEvent: state ?? this.state.isRepeatableEvent,
    });

    this.updateDateFields("startDate", undefined);
    this.viewState.newTask.rruleOptions = undefined;
  };

  getRRuleFreqNameFromEnum = (value: number) => {
    return RRuleFrequencies.find((freq) => freq.value === value)?.label;
  };

  updateTaskTextField = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.viewState.setNewTaskValueByKey({
      [event.target.name]: event.target.value,
    });
  };

  updateTaskInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.viewState.setNewTaskValueByKey({
      [event.target.name]: event.target.value,
    });
  };

  updateDateFields = (type: string, date?: Date | undefined | null) => {
    this.viewState.setNewTaskValueByKey({
      [type]: date,
    });
  };

  handleSubmitNewTask = () => {
    const { title, description, rruleOptions, startDate, assignee } =
      this.viewState.newTask;

    if (!title || !description || assignee.length === 0) {
      return alert("Please fill out all the information");
    }

    if (this.state.isRepeatableEvent) {
      if (!rruleOptions || !startDate) {
        return alert("Please enter date information");
      }
    }
    this.viewState.submitNewTask();
  };

  render() {
    const { newTask } = this.viewState;
    return (
      <Container>
        {this.viewState.roommates && !this.viewState.isLoading ? (
          <>
            {" "}
            <HeaderContainer>
              <StyledLink to="/tasks" onClick={this.props.dismiss}>
                Cancel
              </StyledLink>
              <Header>New Task</Header>
              <StyledText onClick={this.handleSubmitNewTask}>
                {this.props.taskToEdit ? "Save" : "Add"}
              </StyledText>
            </HeaderContainer>
            <FormContainer>
              <ToggleButtonGroup
                value={this.state.isRepeatableEvent}
                exclusive
                onChange={(_, isRepeatableEvent) => {
                  this.handleIsRepeatableEventChange(isRepeatableEvent);
                }}
              >
                <StyledToggleButton value={false}>
                  One time task
                </StyledToggleButton>
                <StyledToggleButton value={true}>
                  Repeating task
                </StyledToggleButton>
              </ToggleButtonGroup>
              <Input
                placeholder="What is your task?"
                name="title"
                value={newTask.title ?? ""}
                onChange={this.updateTaskInput}
              ></Input>
              <DescriptionInput
                placeholder="Description..."
                name="description"
                value={newTask.description ?? ""}
                onChange={this.updateTaskTextField}
              ></DescriptionInput>
              <FormControl fullWidth>
                <StyledSelect
                  displayEmpty
                  multiple
                  disabled={!!newTask.id}
                  value={newTask.assignee ?? []}
                  onChange={(event) => {
                    const inputValue = event.target.value as string | string[];
                    const values: string[] =
                      typeof inputValue === "string"
                        ? inputValue.split(",")
                        : inputValue;

                    const valuesAsInt = values
                      .map((val) => parseInt(val))
                      .filter((val) => !isNaN(val));

                    this.viewState.setNewTaskValueByKey({
                      assignee: valuesAsInt,
                    });
                  }}
                  renderValue={(values) => {
                    if (Array.isArray(values) && values.length === 0) {
                      return (
                        <StyledSelectValuePlaceholder>
                          Assignees
                        </StyledSelectValuePlaceholder>
                      );
                    }

                    return (
                      <StyledSelectValueHolder>
                        {(values as number[])
                          .map((id) => this.viewState.getNameById(id))
                          .join(", ")}
                      </StyledSelectValueHolder>
                    );
                  }}
                >
                  {this.viewState.roommates?.map((roommate, index) => (
                    <MenuItem key={index} value={roommate.id}>
                      {roommate.first_name + " " + roommate.last_name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
              <DatePicker
                onChange={(date) =>
                  this.updateDateFields(
                    "startDate",
                    date == undefined ? null : new Date(date)
                  )
                }
                value={newTask.startDate ?? null}
                renderInput={({ inputRef, inputProps }) => (
                  <Input
                    type="date"
                    ref={inputRef}
                    {...inputProps}
                    placeholder={
                      this.state.isRepeatableEvent ? "Start Date" : "Due Date"
                    }
                  ></Input>
                )}
              />
              {this.state.isRepeatableEvent ? (
                <>
                  <DatePicker
                    onChange={(date) => {
                      if (date?.toString() === "Invalid Date") {
                        return;
                      }
                      this.viewState.setNewRRuleValueByKey({ until: date });
                    }}
                    value={newTask.rruleOptions?.until ?? null}
                    renderInput={({ inputRef, inputProps }) => (
                      <Input
                        ref={inputRef}
                        {...inputProps}
                        placeholder="Until"
                      ></Input>
                    )}
                  />
                  <FormControl fullWidth>
                    <StyledSelect
                      displayEmpty
                      value={newTask.rruleOptions?.freq ?? Frequency.DAILY}
                      onChange={(event) => {
                        const value = event.target.value as string;
                        this.viewState.setNewRRuleValueByKey({
                          freq: parseInt(value),
                        });
                      }}
                      renderValue={(value) => {
                        const valueAsNumber = parseInt(value as string);
                        if (isNaN(valueAsNumber)) {
                          return (
                            <StyledSelectValuePlaceholder>
                              Repeat every...
                            </StyledSelectValuePlaceholder>
                          );
                        }
                        return (
                          <StyledSelectValueHolder>
                            Repeat{" "}
                            {this.getRRuleFreqNameFromEnum(valueAsNumber)}
                          </StyledSelectValueHolder>
                        );
                      }}
                    >
                      {RRuleFrequencies.map((freq, i) => (
                        <MenuItem key={i} value={freq.value}>
                          {freq.label}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                  {newTask.rruleOptions?.freq === Frequency.WEEKLY ? (
                    <FormControl fullWidth>
                      <StyledSelect
                        displayEmpty
                        multiple
                        value={newTask.rruleOptions?.byweekday ?? []}
                        onChange={(event) => {
                          const inputValue = event.target.value as
                            | string
                            | string[];
                          const values: string[] =
                            typeof inputValue === "string"
                              ? inputValue.split(",")
                              : inputValue;

                          const valuesAsInt = values
                            .map((val) => parseInt(val))
                            .filter((val) => !isNaN(val));
                          this.viewState.setNewRRuleValueByKey({
                            byweekday:
                              valuesAsInt.length === 0 ? null : valuesAsInt,
                          });
                        }}
                        renderValue={(values) => {
                          if (Array.isArray(values) && values.length === 0) {
                            return (
                              <StyledSelectValuePlaceholder>
                                Days to repeat
                              </StyledSelectValuePlaceholder>
                            );
                          }

                          return (
                            <StyledSelectValueHolder>
                              {(values as number[])
                                .sort()
                                .map((day) => new Weekday(day).toString())
                                .join(", ")}
                            </StyledSelectValueHolder>
                          );
                        }}
                      >
                        {RRuleWeekdayIntervals.map((option, index) => (
                          <MenuItem key={index} value={option.weekday}>
                            {option.toString()}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    </FormControl>
                  ) : null}
                  <RRuleDateText>{this.viewState.rruleText}</RRuleDateText>
                </>
              ) : null}
              {this.props.taskToEdit ? (
                <StyledText onClick={this.viewState.deleteTask}>
                  Delete
                </StyledText>
              ) : null}
            </FormContainer>
          </>
        ) : (
          <Loading />
        )}
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(100% - 16px);
  height: 100%;
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

const StyledText = styled.p`
  color: ${COLORS.NavyBlue};
  cursor: default;
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

const StyledSelect = muiStyled(Select)(() => ({
  height: "38px",
  margin: "2px 0",
  background: COLORS.Graphite,

  "& .MuiSelect-select": {
    padding: "4px 8px",
    color: COLORS.Gray,
    fontFamily: "Roboto",
  },

  "& p": {
    fontSize: "18px",
  },

  "& fieldset": {
    border: "none",
  },
}));

const StyledSelectValueHolder = styled.p`
  color: ${COLORS.DarkGray};
`;

const StyledSelectValuePlaceholder = styled.p`
  color: ${COLORS.Gray};
`;

const RRuleDateText = styled.em`
  margin-top: 4px;
  color: ${COLORS.Gray};
  font-size: 12px;

  &:first-letter {
    text-transform: capitalize;
  }
`;
