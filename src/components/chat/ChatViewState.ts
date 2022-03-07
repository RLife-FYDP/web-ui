import { action, computed, makeAutoObservable, observable } from "mobx";
import { io } from "socket.io-client";
import { ChatMessage, Suite, User } from "../../commonUtils/types";
import { authenticatedGetRequest, getUser } from "../../api/apiClient";

enum ChatState {
  READ,
  UNREAD,
}

enum LastSender {
  SELF,
  RECIPANT,
}

interface ChatProps {
  chatId: number;
  recipantName: string;
  lastText: string;
  lastSender: LastSender;
  chatState: ChatState;
  timestamp: number;
  recipientId?: number;
}

interface ChatMessageRes {
  from_user: number
  content: string
  updated_at: string
}

interface UserMessages {
  [userId: number]: ChatMessage[]
}

export class ChatViewState {
  @observable private isSingleChatExpanded: boolean = false;
  @observable messages: ChatMessage[] = []
  @observable userMessages: UserMessages = {}
  @observable user?: User;
  @observable suite?: Suite;
  @observable messageTextInput: string = ''
  @observable activeChatId: number = -1;
  private socket;

  constructor() {
    makeAutoObservable(this);
    this.socket = io("http://localhost:8080");
    this.init()
  }

  @action
  async init() {
    this.user = await getUser();
    const res = await authenticatedGetRequest(`/suites/${this.user.suiteId}`)
    const suiteData = await res?.json()
    this.suite = {
      id: suiteData.id,
      name: suiteData.name,
      active: suiteData.active,
      canvas: suiteData.canvas,
      location: suiteData.location,
      messages: suiteData.messages.map(({from_user, content, updated_at}: ChatMessageRes) => (
        {senderId: from_user, text: content, dateTime: new Date(updated_at + 'Z')}
      )),
    }
    
    this.messages = this.suite.messages?.sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime()) ?? []
    this.socket.emit('join_room', this.user.suiteId)
    this.socket.on('emit_message', (data: ChatMessageRes) => {
      this.receiveMessage(data.from_user, data.content, new Date(data.updated_at + 'Z'))
    })
  }

  @action
  receiveMessage(sender: number, message: string, dateTime: Date) {
    this.messages.push({
      senderId: sender,
      text: message,
      dateTime
    })
  }

  @action
  updateMessageTextInput(newMessage: string) {
    this.messageTextInput = newMessage
  }

  @action
  sendMessage() {
    if (this.messageTextInput === '') return;
    const data = {
      suite_id: this.user?.suiteId,
      from: this.user?.id,
      message: this.messageTextInput
    }
    this.socket.emit('send_message', data)
  }
  
  @action
  showChatOverview = () => {
    this.isSingleChatExpanded = false;
  }

  @action
  expandChat = (chatId: number) => {
    console.log(`expanding chat ${chatId}`);
    this.isSingleChatExpanded = true;
    this.activeChatId = chatId;
  };

  @computed
  get showSingleChat(): boolean {
    return this.isSingleChatExpanded;
  }

  @computed
  get testData(): ChatProps[] {
    const DMs: ChatProps[] = this.suite?.users?.filter(user => user.id !== this.user?.id).map<ChatProps>((user, i) => {
      const messages : ChatMessage[] = this.userMessages[user.id] ?? []
      return {
        chatId: i+1,
        recipantName: `${user.firstName} ${user.lastName}`,
        lastText: messages.length ? messages[messages.length-1].text : '',
        lastSender: (messages.length && messages[messages.length-1].senderId === this.user?.id) ? LastSender.SELF : LastSender.RECIPANT,
        chatState: ChatState.READ,
        timestamp: messages.length ? messages[messages.length-1].dateTime.getTime() : 0,
        recipientId: user.id
      }
    }) ?? []
    const groupChats: ChatProps[] = [
      {
        chatId: 0,
        recipantName: this.suite?.name ?? '',
        lastText: this.messages.length ? this.messages[this.messages.length-1].text : '',
        lastSender: (this.messages.length && this.messages[this.messages.length-1].senderId === this.user?.id) ? LastSender.SELF : LastSender.RECIPANT,
        chatState: ChatState.READ,
        timestamp: this.messages.length ? this.messages[this.messages.length-1].dateTime.getTime() : 0
      },
    ];
    const allChats = DMs.concat(groupChats)
    allChats.sort((a,b) => b.timestamp-a.timestamp)
    return groupChats
  }
}
