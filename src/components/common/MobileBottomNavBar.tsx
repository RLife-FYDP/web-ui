import React from "react";
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
import { Chat } from "../chat/Chat";
import { Expenses } from "../expenses/Expenses";
import { Tasks } from "../tasks/Tasks";
import { MobileTopNavBar } from "../common/MobileTopNavBar";
import { NotificationBar } from "../common/NotificationBar";

import { ReactComponent as AchievementIcon } from "../../icons/AchievementMainIcon.svg";
import { ReactComponent as ChatIcon } from "../../icons/ChatMainIcon.svg";
import { ReactComponent as TaskIcon } from "../../icons/TaskMainIcon.svg";
import { ReactComponent as WhiteboardIcon } from "../../icons/WhiteboardMainIcon.svg";
import { ReactComponent as ExpenseIcon } from "../../icons/ExpenseMainIcon.svg";

export const MobileBottomNavBar: React.FC = () => {
  const NavigationRouter = (
    <Switch>
      <Route exact path="/">
        <Chat />
      </Route>
      <Route path="/tasks">
        <Tasks />
      </Route>
      <Route path="/achievements">
        <Achievements />
      </Route>
      <Route path="/expenses">
        <Expenses />
      </Route>
      <Route path="/canvas">
        <Canvas />
      </Route>
    </Switch>
  );

  return (
    <Router>
      <Container>
        <StickyContainer>
          <MobileTopNavBar />
          <NotificationBar />
          {NavigationRouter}
        </StickyContainer>
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
          <StyledLink to="/achievements">
            <NavItem>
              <AchievementIcon />
              Achievements
            </NavItem>
          </StyledLink>
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
      </Container>
    </Router>
  );
};

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 16px);
  margin: 8px;
`;

const StickyContainer = styled.div`
  width: 100%;
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
  background: ${COLORS.White}
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
