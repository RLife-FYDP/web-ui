import { action, computed } from "mobx";

interface ChatProps {
  senderId: string;
  text: string;
}

export class ChatViewState {
  @action
  sendMessage() {
    console.log("send msg")
  }

  @computed
  get testData(): ChatProps[] {
    return [
      {
        senderId: "0",
        text: "hello",
      },
      {
        senderId: "1",
        text: "hi",
      },
      {
        senderId: "1",
        text: "there",
      },
      {
        senderId: "0",
        text: "you",
      },
      {
        senderId: "0",
        text: "THIS IS A REALLY LONG STRING AND I WAN IT TO SEE HOW IT OVERFLOWS",
      },
      {
        senderId: "1",
        text: "THIS IS A REALLY LONG STRING AND I WAN IT TO SEE HOW IT OVERFLOWS",
      },
      {
        senderId: "0",
        text: "hello",
      },
      {
        senderId: "1",
        text: "hi",
      },
      {
        senderId: "1",
        text: "there",
      },
      {
        senderId: "0",
        text: "you",
      },
      {
        senderId: "0",
        text: "THIS IS A REALLY LONG STRING AND I WAN IT TO SEE HOW IT OVERFLOWS",
      },
      {
        senderId: "1",
        text: "THIS IS A REALLY LONG STRING AND I WAN IT TO SEE HOW IT OVERFLOWS",
      },
    ].reverse();
    // need reverse because of how we are showing the data on UI
    // so the data model can sort from oldest to newest (don't need to reverse otherwise)
  }

  @computed
  get testName(): string {
    return "Lincoln";
  }

  @computed
  get roomName(): string {
    return "Fergus House";
  }
}
