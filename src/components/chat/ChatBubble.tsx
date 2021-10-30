import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";

export enum Alignment {
  LEFT,
  RIGHT,
}

interface ChatBubbleProps {
  alignment: Alignment;
  text: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ alignment, text }) => (
  <Container alignment={alignment}>
    <Bubble alignment={alignment}>
      {text}
    </Bubble>
  </Container>
);

const Container = styled.div<{
  alignment: Alignment;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: ${({ alignment }) =>
    alignment === Alignment.LEFT ? "flex-start" : "flex-end"};
  width: 100%;
`;

const Bubble = styled.div<{
  alignment: Alignment;
}>`
  width: fit-content;
  max-width: 60%;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 10px;
  background: ${({ alignment }) => alignment === Alignment.LEFT ? COLORS.SkyBlue : COLORS.Yellow }
`;
