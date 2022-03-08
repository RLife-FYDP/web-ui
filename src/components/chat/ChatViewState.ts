import { action, computed, makeAutoObservable, observable } from "mobx";
import { io } from "socket.io-client";
import { ChatMessage, Suite, User } from "../../commonUtils/types";
import { authenticatedGetRequest, getUser } from "../../api/apiClient";
import { RoommateProps } from "../expenses/AddExpenseViewState";
import { decryptMessage, encryptFirstMessage, generateSignalId } from "../../commonUtils/signal";
import {
  MessageType,
} from "@privacyresearch/libsignal-protocol-typescript";
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

interface ChatGroupMessageRes {
  from_user: number
  content: string
  updated_at: string
}

interface ChatDmMessageRes {
  from_user: number
  to_user: number
  encrypted_message: MessageType
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
  @observable suiteUsers?: RoommateProps[];
  @observable messageTextInput: string = ''
  @observable activeChatId: number = -1;
  private socket;

  constructor() {
    makeAutoObservable(this);
    this.socket = io("http://localhost:8080");
    console.log('constructor')
    this.init()
  }

  @action
  async init() {
    this.user = await getUser();
    console.log('init')
    generateSignalId(this.user.id) // asynchronously generate signal keys
    const resList = await Promise.all([authenticatedGetRequest(`/suites/${this.user.suiteId}`), authenticatedGetRequest(`/suites/${this.user.suiteId}/users`)])
    const [suiteData, users] = await Promise.all(resList.map(res => res?.json()))
    this.suite = {
      id: suiteData.id,
      name: suiteData.name,
      active: suiteData.active,
      canvas: suiteData.canvas,
      location: suiteData.location,
      messages: suiteData.messages.map(({from_user, content, updated_at}: ChatGroupMessageRes) => (
        {senderId: from_user, text: content, dateTime: new Date(updated_at + 'Z')}
      )),
    }
    this.suiteUsers = users;
    
    this.messages = this.suite.messages?.sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime()) ?? []
    this.socket.emit('join_room', this.user.suiteId)
    this.socket.on('emit_message', (data: ChatGroupMessageRes) => {
      this.receiveGroupMessage(data.from_user, data.content, new Date(data.updated_at + 'Z'))
    })
    this.socket.on('emit_dm_message', (data: ChatDmMessageRes) => {

      // if (data.to_user !== this.user?.id || data.from_user !== this.user?.id) {
      //   return;
      // }
      if (data.to_user !== this.user?.id) return;
      const participant = data.to_user === this.user?.id ? data.from_user : data.to_user
      this.receiveDmMessage(data.from_user, participant, data.encrypted_message, new Date())
    })
  }

  @action
  receiveGroupMessage(sender: number, message: string, dateTime: Date) {
    this.messages.push({
      senderId: sender,
      text: message,
      dateTime
    })
  }

  @action
  async receiveDmMessage(sender: number, participant: number, message: MessageType, dateTime: Date) {
    if (!this.userMessages[participant]) {
      this.userMessages[participant] = []
    }

    const decryptedMessage = await decryptMessage(sender, message)
    this.userMessages[participant].push({
      senderId: sender,
      text: decryptedMessage,
      dateTime
    })
  }

  @action
  updateMessageTextInput(newMessage: string) {
    this.messageTextInput = newMessage
  }

  @action
  async sendMessage(toUserId?: number) {
    if (this.messageTextInput === '') return;

    if (this.activeChatId === 0) { // group message
      const data = {
        suite_id: this.user?.suiteId,
        from: this.user?.id,
        message: this.messageTextInput
      }
      this.socket.emit('send_message', data)
    } else { // dm
      const encryptedMessage = await encryptFirstMessage(toUserId!, this.messageTextInput)
      const data = {
        suite_id: this.user?.suiteId,
        from: this.user?.id,
        to: toUserId,
        encrypted_message: encryptedMessage
      }
      this.socket.emit('send_dm_message', data);
    }
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
    const DMs: ChatProps[] = this.suiteUsers?.filter(user => user.id !== this.user?.id).map<ChatProps>((user, i) => {
      const messages : ChatMessage[] = this.userMessages[user.id] ?? []
      return {
        chatId: i+1,
        recipantName: `${user.first_name} ${user.last_name}`,
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
    return allChats
  }
}
