import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { Alignment, ChatBubble } from "./ChatBubble";

import { ChatViewState } from "./ChatViewState";

@observer
export class Chat extends React.Component {
  @observable
  private viewState = new ChatViewState();

  render() {
    return (
      <Container>
        <ContactNameContainer>Marcus Yung</ContactNameContainer>
        <ConversationContainer>
          {this.viewState.testData.map((data) => (
            <ChatBubble
              alignment={
                data.senderId === "0" ? Alignment.LEFT : Alignment.RIGHT
              }
              text={data.text}
            />
          ))}
        </ConversationContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  margin: 8px;
`;

const ContactNameContainer = styled.h2`
  margin: 8px 0;
`;

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  /* TODO: take in consideration of when the notification section is closed:
  e.g. height should be: calc(100% - x - x)
  */
  height: 285px;
`;
