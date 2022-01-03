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

  renderOverview() {
    return (
      <AllChatsContainer>
        {this.viewState.testData.map((data, i) => (
          <ChatContainer
            onClick={() => {
              this.viewState.expandChat(i);
            }}
          >
            <ChatIcon />
            <MessageContainer>
              <ChatHead>{data.recipantName}</ChatHead>
              <ChatMessage>{data.lastText}</ChatMessage>
            </MessageContainer>
          </ChatContainer>
        ))}
      </AllChatsContainer>
    );
  }

  renderSingleChat() {
    return (
      <Container>
        <ContactNameContainer>
          <GoBackContainer onClick={this.viewState.showChatOverview}>
            {"<"}
          </GoBackContainer>
          Marcus Yung
        </ContactNameContainer>
        <ConversationContainer>
          {this.viewState.testSingleData.map((data) => (
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
          <SendIcon onClick={this.viewState.sendMessage} />
        </MessageSenderContainer>
      </Container>
    );
  }

  render() {
    return (
      <>
        {this.viewState.showSingleChat
          ? this.renderSingleChat()
          : this.renderOverview()}
      </>
    );
  }
}

const AllChatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  margin: 8px;
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 8px 0;
`;
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 45px;
`;

const ChatHead = styled.h3``;

//TODO: convert to image later
const ChatIcon = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 16px;
  border-radius: 50%;
  background: ${COLORS.SkyBlue};
`;

const ChatMessage = styled.p``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  height: 100%;
  margin: 8px;
`;

const GoBackContainer = styled.p`
  padding-right: 8px;
  cursor: default;
  color: ${COLORS.Gray};
`;

const ContactNameContainer = styled.h2`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 8px 0;
`;

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  max-height: 100%;
  overflow-y: scroll;
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
