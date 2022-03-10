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
import { styled as muiStyled } from "@mui/system";
import { Chip, Avatar, Select, ToggleButton, FilledInput, InputAdornment, IconButton, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { AddCircle } from '@mui/icons-material'
import { Loading } from "../common/Loading";

@observer
export class CreateSuite extends React.Component {
  @observable private viewState = new CreateSuiteViewState();

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

  updateEmailField = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.viewState.setEmailInputField(event.target.value)
  }

  renderEditSuitePage() {
    const {newSuite} = this.viewState
    return (
      <FormContainer>
      <Input
        placeholder="Name your suite"
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
      <Header>Add Roommates</Header>
      <StyledInputText
        id="filled-adornment-password"
        type={'text'}
        value={this.viewState.emailInputField}
        onChange={this.updateEmailField}
        placeholder='Add roommates by email'
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => this.viewState.addRoommateByEmail(this.viewState.emailInputField)}
              edge="end"
            >
              <AddCircle />
            </IconButton>
          </InputAdornment>
        }
      />
      <StyledSelect
        displayEmpty
        multiple
        value={newSuite.users.filter(roommate => roommate.type === 'user').map(user => user.userId)}
        onChange={(event) => {
          const inputValue = event.target.value as
          | string
          | string[];
          const values: string[] =
            typeof inputValue === "string"
              ? inputValue.split(",")
              : inputValue;
          const selectedUserIds = values
            .map((val) => parseInt(val))
            .filter((val) => !isNaN(val));
          this.viewState.addRoommateByUserIds(selectedUserIds)
        }}
        renderValue={values => {
          if (Array.isArray(values) && values.length === 0) {
            return (
              <StyledSelectValuePlaceholder>
                Recommended roommates
              </StyledSelectValuePlaceholder>
            );
          }
          return (
            <StyledSelectValuePlaceholder>
              {(values as number[])
                .map(userId => this.viewState.matches.find(matchedUser => matchedUser.id === userId)?.firstName)
                .join(", ")}
            </StyledSelectValuePlaceholder>
          );
        }}
      >
        {this.viewState.matches.map((matchedUser, i) => (
          <MenuItem key={matchedUser.id} value={matchedUser.id} >
            <Checkbox checked={newSuite.users.some(addedUser => addedUser.userId === matchedUser.id)} />
            <ListItemText primary={`${i+1}. ${matchedUser.firstName} ${matchedUser.lastName}`} />
          </MenuItem>
        ))}
      </StyledSelect>
      <AddedRoommatesContainer>
        {newSuite.users.map((roommate, i) => {
          if (roommate.type === 'email') {
            return (
              <Chip
                avatar={<Avatar>{roommate.email![0]}</Avatar>}
                label={roommate.email}
                variant='outlined'
                onDelete={() => this.viewState.deleteRoommateByIndex(i)}
              />
            )
          } else {
            const user = this.viewState.matches.find(matchUser => matchUser.id === roommate.userId)
            return (
              <Chip
                avatar={<Avatar alt={user!.firstName} src={user?.profileImageLink} />}
                label={`${user?.firstName} ${user?.lastName}`}
                variant='outlined'
                onDelete={() => this.viewState.deleteRoommateByIndex(i)}
              />
            )
          }
        })}
      </AddedRoommatesContainer>
      </FormContainer>
    )
  }

  render() {
    const formPage = this.renderEditSuitePage()
    return (
      <Container>
        {!this.viewState.isLoading ? (
          <>
            {" "}
            <HeaderContainer>
              <Header>New Suite</Header>
              <StyledText onClick={this.viewState.submitNewSuite}>
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

const StyledSelectValuePlaceholder = styled.p`
  color: ${COLORS.Gray};
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

const StyledInputText = muiStyled(FilledInput)(() => ({
  height: "38px",
  margin: "2px 0",
  background: COLORS.Graphite,
  fontSize: '18px',
  fontFamily: "Arial",
  color: COLORS.Gray,
  border: "none",

  "& input": {
    paddingTop: '8px',
    color: COLORS.DarkGray,
  },

  "& fieldset": {
    border: "none",
  },
}))

const AddedRoommatesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`
