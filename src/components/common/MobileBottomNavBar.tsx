import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { Achievements } from "../achievements/Achievements";
import { Canvas } from "../canvas/Canvas";
import { Expenses } from "../expenses/Expenses";
import { Tasks } from "../tasks/Tasks";
import { MobileTopNavBar } from "../common/MobileTopNavBar";
import { NotificationBar } from "../common/NotificationBar";

import { ReactComponent as AchievementIcon } from "../../icons/AchievementMainIcon.svg";
import { ReactComponent as ChatIcon } from "../../icons/ChatMainIcon.svg";
import { ReactComponent as TaskIcon } from "../../icons/TaskMainIcon.svg";
import { ReactComponent as WhiteboardIcon } from "../../icons/WhiteboardMainIcon.svg";
import { ReactComponent as ExpenseIcon } from "../../icons/ExpenseMainIcon.svg";
import { Chat } from "../chat/Chat";
import { AddTask } from "../tasks/AddTask";
import { AddExpense } from "../expenses/AddExpense";
import { observer } from "mobx-react";
import { NotificationBarViewState } from "./NotificationBarViewState";
import { observable } from "mobx";
import { Signup } from "../authentication/Signup";
import { Settings } from "../settings/Settings";
import { withAuthentication } from "../../commonUtils/withAuthentication";
import { CreateSuite } from "../suites/CreateSuite";

@observer
export class MobileBottomNavBar extends Component {
  @observable private notificationsViewState = new NotificationBarViewState();
  // TODO: convert path to using react router props later
  @observable private path = window.location.pathname;

  render() {
    const NavigationRouter = (
      <Switch>
        <Route exact path="/">
          {withAuthentication(Chat)}
        </Route>
        <Route exact path="/tasks">
          {withAuthentication(Tasks)}
        </Route>
        <Route exact path="/tasks/add">
          {withAuthentication(AddTask)}
        </Route>
        {/* <Route path="/achievements">{withAuthentication(Achievements)}</Route> */}
        <Route exact path="/expenses">
          {withAuthentication(Expenses)}
        </Route>
        <Route path="/expenses/add">{withAuthentication(AddExpense)}</Route>
        <Route path="/canvas">{withAuthentication(Canvas)}</Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/settings">
          {withAuthentication(Settings)}
        </Route>
        <Route exact path="/create">
          {withAuthentication(CreateSuite)}
        </Route>
      </Switch>
    );

    const Navigation = (
      <NavigationContainer>
        <StyledLink exact to="/">
          <NavItem>
            <ChatIcon />
            Chat
          </NavItem>
        </StyledLink>
        <StyledLink to="/tasks">
          <NavItem>
            <TaskIcon />
            Tasks
          </NavItem>
        </StyledLink>
        {/* <StyledLink to="/achievements">
          <NavItem>
            <AchievementIcon />
            Achievements
          </NavItem>
        </StyledLink> */}
        <StyledLink to="/expenses">
          <NavItem>
            <ExpenseIcon />
            Expenses
          </NavItem>
        </StyledLink>
        <StyledLink to="/canvas">
          <NavItem>
            <WhiteboardIcon />
            Canvas
          </NavItem>
        </StyledLink>
      </NavigationContainer>
    );
    return (
      <Router>
        <Container>
          {this.path.includes("signup") ? (
            NavigationRouter
          ) : (
            <>
              <StickyContainer>
                <MobileTopNavBar />
                {this.notificationsViewState.isNotificationsVisible &&
                !(
                  this.path.includes("settings") || this.path.includes("create")
                ) ? (
                  <NotificationBar viewState={this.notificationsViewState} />
                ) : null}
                <ComponentContainer
                  isNotificationsActive={
                    this.notificationsViewState.isNotificationsVisible
                  }
                >
                  {NavigationRouter}
                </ComponentContainer>
              </StickyContainer>
              {!this.path.includes("create") && Navigation}
            </>
          )}
        </Container>
      </Router>
    );
  }
}

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 16px);
  height: 100%;
  margin: 8px;
`;

const StickyContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ComponentContainer = styled.div<{
  isNotificationsActive: boolean;
}>`
  height: ${({ isNotificationsActive }) =>
    isNotificationsActive
      ? "calc(100% - 48px - 75px - 130px - 50px)"
      : "calc(100% - 48px - 75px - 50px)"};
  overflow-y: scroll;
`;

const NavigationContainer = styled.div`
  z-index: 10000;
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 16px);
  bottom: 0;
  padding: 8px;
  background: ${COLORS.White};
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;

  svg {
    width: 100%;
    height: auto;
    margin: 8px auto;
  }
`;

const StyledLink = styled(NavLink)`
  font-size: 8px;
  color: ${COLORS.Black};
  text-decoration: none;

  &.active {
    color: ${COLORS.NavyBlue};
  }
`;
