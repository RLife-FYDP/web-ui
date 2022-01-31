import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";

import RLifeIcon from "../../icons/RLifeIcon.svg";
import { Intro } from "./Intro";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { SignupViewState, State as AuthState } from "./SignupViewState";

@observer
export class Signup extends React.Component {
  @observable private viewState = new SignupViewState();

  updateState = (state: AuthState) => {
    this.viewState.newAuthState = state;
  };

  onClickStateHandler = () => {
    const state = this.viewState.authState;

    switch (state) {
      case AuthState.SIGNUP_EMAIL_VERIFICATION:
        return this.updateState(AuthState.SIGNUP_ID);
      case AuthState.SIGNUP_ID:
        return this.updateState(AuthState.ROOM_OPTIONS);
      case AuthState.LOGIN_ID:
        return this.updateState(AuthState.ROOM_OPTIONS);
      default:
        return this.updateState(AuthState.HOME);
    }
  };

  renderAuthStateComponent() {
    const state = this.viewState.authState;

    switch (state) {
      case AuthState.INTRO:
        return <Intro updateState={this.updateState} />;
      case AuthState.SIGNUP_EMAIL_VERIFICATION:
        return null;
      case AuthState.SIGNUP_ID:
        return <SignupForm />;
      case AuthState.LOGIN_ID:
        return <LoginForm />;
      case AuthState.ROOM_OPTIONS:
        return null;
      case AuthState.ROOM_SEARCH:
        return null;
      case AuthState.ROOM_CREATE:
        return null;
    }
  }

  render() {
    return (
      <Container>
        <LogoContainer src={RLifeIcon} />
        {this.renderAuthStateComponent()}
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 100vh;
`;

const LogoContainer = styled.img`
  height: auto;
  width: 100px;
`;

const NextButton = styled.button`
  width: 80px;
  height: 40px;
  font-size: 18px;
  border-radius: 6px;
  color: ${COLORS.White};
  background: ${COLORS.NavyBlue};
  border: none;
  outline: none;
  transition: all 0.1s linear;

  &:active {
    color: ${COLORS.NavyBlue};
    background: ${COLORS.White};
    border: 1px solid ${COLORS.NavyBlue};
  }
`;
