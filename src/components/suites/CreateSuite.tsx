/* eslint-disable eqeqeq */
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import {
  CreateSuiteViewState,
} from "./CreateSuiteViewState";
import { DatePicker } from "@mui/lab";
import { styled as muiStyled } from "@mui/system";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FormControl, MenuItem, Select, ToggleButton } from "@mui/material";
import { Frequency, Weekday } from "rrule";
import { Loading } from "../common/Loading";

interface AddSuiteState {
  page: AddSuitePage;
}

enum AddSuitePage {
  SUITE,
  USERS
}

@observer
export class AddTask extends React.Component<{}, AddSuiteState> {
  @observable private viewState = new CreateSuiteViewState();

  // Not sure why @observable isn't working on isRepeatableEvent...
  // will resort to state for now
  constructor() {
    super({});
    this.state = {
      page: AddSuitePage.SUITE,
    };
  }

  updateTaskTextField = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.viewState.setNewSuiteValueByKey({
      [event.target.name]: event.target.value,
    });
  };

  updateTaskInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.viewState.setNewSuiteValueByKey({
      [event.target.name]: event.target.value,
    });
  };

  updateDateFields = (type: string, date?: Date | undefined | null) => {
    this.viewState.setNewSuiteValueByKey({
      [type]: date,
    });
  };

  renderEditSuitePage() {
    const {newSuite} = this.viewState
    return (
      <FormContainer>
      <Input
        placeholder="What is your task?"
        name="name"
        value={newSuite.name ?? ""}
        onChange={this.updateTaskInput}
      ></Input>
      <DescriptionInput
        placeholder="Address"
        name="address"
        value={newSuite.address ?? ""}
        onChange={this.updateTaskTextField}
      ></DescriptionInput>
      </FormContainer>
    )
  }

  renderEditUsersPage() {
    return <></>
  }

  render() {
    let formPage;
    switch (this.state.page) {
      case AddSuitePage.SUITE:
        formPage = this.renderEditSuitePage()
        break;
      case AddSuitePage.USERS:
      default:
        formPage = this.renderEditUsersPage()
    }
    return (
      <Container>
        {!this.viewState.isLoading ? (
          <>
            {" "}
            <HeaderContainer>
              <Header>New Suite</Header>
              <StyledText onClick={this.viewState.submitNewUser}>
                {"Save"}
              </StyledText>
            </HeaderContainer>
            {formPage}
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
