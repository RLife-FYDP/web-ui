import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';

export const MobileNavBar: React.FC = () => {
  return (
    <Router>

    <div>
      <Switch>
        <Route path="/chat">
          <div>CHAT</div>
        </Route>
        <Route path="/tasks">
          <div>CHAT</div>
        </Route>
        <Route path="/achievements">
          <div>CHAT</div>
        </Route>
        <Route path="/expenses">
          <div>CHAT</div>
        </Route>
        <Route path="/canvas">
          <div>CHAT</div>
        </Route>

      </Switch>
    </div>
    </Router>
  )
}