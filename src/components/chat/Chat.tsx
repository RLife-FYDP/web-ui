import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { Alignment, ChatBubble } from "./ChatBubble";

import { ChatViewState } from "./ChatViewState";
import { ReactComponent as SendIcon } from "../../icons/SendMessage.svg";
import { Loading } from "../common/Loading";
import { Avatar } from "@mui/material";

@observer
export class Chat extends React.Component {
  @observable
  private viewState = new ChatViewState();

  renderOverview() {
    return this.viewState.isLoading ? (
      <Loading />
    ) : (
      <AllChatsContainer>
        {this.viewState.testData.map((data, i) => (
          <ChatContainer
            key={i}
            onClick={() => {
              this.viewState.expandChat(data.chatId);
            }}
          >
            <Avatar alt={data.recipantName} src={data.avatarUrl} sx={{width: 50, height: 50, marginRight: '16px'}}/>
            <MessageContainer>
              <ChatHead>{data.recipantName}</ChatHead>
              <ChatMessage>
                {data.lastText.length > 30
                  ? `${data.lastText.substring(0, 30)}...`
                  : data.lastText.length === 0
                  ? "No messages"
                  : data.lastText}
              </ChatMessage>
            </MessageContainer>
          </ChatContainer>
        ))}
      </AllChatsContainer>
    );
  }

  renderSingleChat() {
    const activeChat = this.viewState.testData.find(
      (chats) => chats.chatId === this.viewState.activeChatId
    );
    if (!activeChat) {
      this.viewState.showChatOverview();
      return;
    }

    const messages =
      (activeChat.chatId === 0
        ? this.viewState.messages
        : this.viewState.userMessages[activeChat.recipientId ?? 0]) ?? [];
    return (
      <Container>
        <ContactNameContainer>
          <GoBackContainer onClick={this.viewState.showChatOverview}>
            {"<"}
          </GoBackContainer>
          {activeChat.recipantName}
        </ContactNameContainer>
        <ConversationContainer>
          {messages.map((data, i) => {
            const sender = this.viewState.suiteUsers?.find(user => user.id == data.senderId)
            const senderName = `${sender?.first_name} ${sender?.last_name}`
            return (
              <ChatBubble
                key={i}
                alignment={
                  data.senderId !== this.viewState.user?.id
                    ? Alignment.LEFT
                    : Alignment.RIGHT
                }
                senderName={activeChat.chatId === 0 ? senderName : undefined}
                text={data.text}
              />
            )
          })}
        </ConversationContainer>

        <MessageSenderContainer>
          <MessageInput
            id="message-input"
            onChange={(e) =>
              this.viewState.updateMessageTextInput(e.target.value)
            }
          />
          <SendIcon
            onClick={() => {
              this.viewState.sendMessage(activeChat.recipientId);
              const input = document.getElementById(
                "message-input"
              ) as HTMLInputElement;
              input.value = "";
            }}
          />
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
  flex-direction: column;
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
