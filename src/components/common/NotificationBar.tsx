import React from "react";
import styled from "styled-components";

import COLORS from "../../commonUtils/colors";
import WaveHandIcon from "../../icons/WaveHandIcon.svg";
import ChatBubbleIcon from "../../icons/ChatBubbleIcon.svg";

import { NotificationBarViewState, NotificationProps } from "./NotificationBarViewState";
import { NotificationBubble } from "../notifications/NotificationBubble";

interface NotificationBarProps {
  userName: string;
  suiteName: string
  closeNotifications: () => void
  testData: NotificationProps[]
  isLoading: boolean
}

export const NotificationBar: React.FC<NotificationBarProps> = ({
  userName,
  suiteName,
  closeNotifications,
  testData,
  isLoading
}) => {
  return (
    <Container>
      <CloseContainer onClick={closeNotifications}>x</CloseContainer>
      {isLoading ? null : <><Header>
        Welcome back to {suiteName}, {userName}
        <Icon src={WaveHandIcon} />
      </Header>
      <Caption>Here's what you've missed!</Caption>
      <NotificationsContainer>
        {testData.map((data, index) => {
          switch (data.taskType) {
            // case TaskType.ACHIEVEMENT:
            //   return "hello";
            default:
              return (
                <NotificationBubble
                  key={index}
                  backgroundColor={COLORS.SkyBlue}
                  numNotifications={data.numNotificationsMissed}
                  notificationType="Expenses"
                  icon={ChatBubbleIcon}
                />
              );
          }
        })}
      </NotificationsContainer></>}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: 130px;
  width: calc(100% - 16px);
  margin: 8px;
  padding: 16px;
  border: 1px solid ${COLORS.Black};
  user-select: none;
`;

const Header = styled.h1`
  font-size: 14px;
`;

const Caption = styled.p`
  padding-top: 8px;
  font-size: 14px;
`;

const Icon = styled.img`
  padding: 0 4px;
`;

// TODO: fix horizontal scroll?
const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  margin-top: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const CloseContainer = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
`;
