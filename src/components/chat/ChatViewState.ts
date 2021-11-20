import { action, computed, makeAutoObservable, observable } from "mobx";

enum ChatState {
  READ,
  UNREAD,
}

enum LastSender {
  SELF,
  RECIPANT,
}

interface ChatProps {
  chatId: string;
  recipantName: string;
  lastText: string;
  lastSender: LastSender;
  chatState: ChatState;
}

interface SingleChatProps {
  senderId: string;
  text: string;
}

export class ChatViewState {
  @observable private isSingleChatExpanded: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  sendMessage() {
    console.log("send msg");
  }
  
  @action
  showChatOverview = () => {
    this.isSingleChatExpanded = false;
  }

  @action
  expandChat = (chatId: number) => {
    console.log(`expanding chat ${chatId}`);
    this.isSingleChatExpanded = true;
  };

  @computed
  get showSingleChat(): boolean {
    return this.isSingleChatExpanded;
  }

  @computed
  get testData(): ChatProps[] {
    return [
      {
        chatId: "0",
        recipantName: "Marcus Yung",
        lastText: "pick up food?",
        lastSender: LastSender.SELF,
        chatState: ChatState.READ,
      },
      {
        chatId: "0",
        recipantName: "Marcus Yung",
        lastText: "pick up food?",
        lastSender: LastSender.SELF,
        chatState: ChatState.READ,
      },
      {
        chatId: "0",
        recipantName: "Marcus Yung",
        lastText: "pick up food?",
        lastSender: LastSender.SELF,
        chatState: ChatState.READ,
      },
    ];
  }

  @computed
  get testSingleData(): SingleChatProps[] {
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
}
