import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";

interface NotificationBubbleProps {
  backgroundColor: string;
  numNotifications: number;
  notificationType: string;
  icon: string;
  onClickHandler?: () => void;
}

export const NotificationBubble: React.FC<NotificationBubbleProps> = ({
  backgroundColor,
  numNotifications,
  notificationType,
  icon,
  onClickHandler,
}) => {
  return (
    <Container
      to="expenses"
      backgroundColor={backgroundColor}
      onClick={onClickHandler}
    >
      <IconContainer src={icon} draggable={false} />
      <TextContainer>
        {numNotifications} new {notificationType}
      </TextContainer>
    </Container>
  );
};

const Container = styled(Link)<{
  backgroundColor: string;
}>`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  flex: 1 0 auto;
  width: fit-content;
  margin-right: 8px;
  margin-bottom: 8px;
  padding-left: 4px;
  padding-right: 8px;
  background: ${({ backgroundColor }) => backgroundColor};
  border-radius: 25px;
  font-size: 14px;
  user-select: none;
  text-decoration: none;
  color: ${COLORS.Black};
`;

const IconContainer = styled.img`
  width: 20px;
  height: auto;
  margin-right: 4px;
  padding: 4px;
`;

const TextContainer = styled.p`
  padding: 0 4px;
`;
