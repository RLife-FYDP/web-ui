import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { NotificationBarViewState } from "./NotificationBarViewState";

import WaveHandIcon from "../../icons/WaveHandIcon.svg";

@observer
export class NotificationBar extends React.Component {
  @observable
  private notifications = new NotificationBarViewState();

  render() {
    return (
      <Container>
        <Header>
          Welcome back to {this.notifications.roomName},{" "}
          {this.notifications.testName}
          <Icon src={WaveHandIcon} />
        </Header>
        <Caption>Here's what you've missed!</Caption>
      </Container>
    );
  }
}

const Container = styled.div`
  border: 1px solid ${COLORS.Black};
  margin: 8px;
  padding: 16px;
`;

const Header = styled.h1`
  font-size: 16px;
`;

const Caption = styled.p`
  padding-top: 8px;
  font-size: 14px;
`;

const Icon = styled.img`
  padding: 0 4px;
`;
