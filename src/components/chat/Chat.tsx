import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { Alignment, ChatBubble } from "./ChatBubble";

import { ChatViewState } from "./ChatViewState";
import { ReactComponent as SendIcon } from "../../icons/SendMessage.svg";

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

        <MessageSenderContainer>
          <MessageInput />
          <SendIcon onClick={this.viewState.sendMessage}/>
        </MessageSenderContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  height: 100%;
  margin: 8px;
`;

const ContactNameContainer = styled.h2`
  margin: 8px 0;
`;

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: center;
  overflow-y: scroll;

  /* TODO: take in consideration of when the notification section is closed:
  e.g. height should be: calc(100% - x - x)
  */
  max-height: 245px;
`;

const MessageSenderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 35px;
  width: 100%;
  margin-top: 8px;
  padding: 2px 0px;
`;

const MessageInput = styled.input`
  width: 100%;
  height: 35px;
  margin-right: 8px;
  font-size: 18px;
  border: none;
  background: none;
  border-radius: 14px;
  border: 1px solid ${COLORS.SkyBlue};
  padding: 0 8px;

  &:focus-visible {
    outline: none;
  }
`;
