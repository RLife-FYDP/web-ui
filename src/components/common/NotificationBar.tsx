import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import COLORS from "../../commonUtils/colors";
import WaveHandIcon from "../../icons/WaveHandIcon.svg";
import ChatBubbleIcon from "../../icons/ChatBubbleIcon.svg";

import { NotificationBarViewState, TaskType } from "./NotificationBarViewState";

import { NotificationBubble } from "../notifications/NotificationBubble";

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
        <NotificationsContainer>
          {this.notifications.testData.map((data) => {
            switch (data.taskType) {
              // case TaskType.ACHIEVEMENT:
              //   return "hello";
              default:
                return (
                  <NotificationBubble
                    backgroundColor={COLORS.SkyBlue}
                    numNotifications={4}
                    notificationType="Expenses"
                    icon={ChatBubbleIcon}
                  />
                );
            }
          })}
        </NotificationsContainer>
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

const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 12px;
`;
