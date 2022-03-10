export interface Expense {
  // TODO
}

export interface Setting {
  createdAt: Date;
  id: number;
  detailedSettingsJSON: string;
}

export interface LocationType {
  // TODO
}

export interface User {
  age: number;
  birthday: Date;
  createdAt: Date;
  email: string;
  expenseItems: Expense[];
  firstName: string;
  gender: string;
  id: number;
  lastName: string;
  location: LocationType;
  profileImageLink: string;
  rating: number;
  setting?: Setting;
  suiteId?: number;
  updatedAt: Date;
}

export interface Suite {
  id: number;
  name: string;
  active: boolean;
  canvas: string;
  users?: User[];
  messages?: ChatMessage[];
  location: LocationType;
}

export interface ChatMessage {
  senderId: number;
  text: string;
  dateTime: Date;
}
