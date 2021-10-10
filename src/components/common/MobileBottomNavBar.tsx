import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import styled from "styled-components";
import { Achievements } from "../achievements/Achievements";
import { Canvas } from "../canvas/Canvas";
import { Chat } from "../chat/Chat";
import { Expenses } from "../expenses/Expenses";
import { Tasks } from "../tasks/Tasks";

export const MobileBottomNavBar: React.FC = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Chat />
          </Route>
          <Route path="/chat">
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
        <Container>
          <Link to="/chat">Chat</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/achievements">Achievements</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/canvas">Canvas</Link>
        </Container>
      </div>
    </Router>
  );
};

const Container = styled.div``;
