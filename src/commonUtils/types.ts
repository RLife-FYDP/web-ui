export interface Expense {
  // TODO
}

export interface Setting {
  // TODO
}

export interface LocationType {
  // TODO
}

export interface User {
  age: number
  birthday: Date
  createdAt: Date
  email: string
  expenseItems: Expense[]
  firstName: string
  gender: string
  id: number
  lastName: string
  location: LocationType
  profileImageLink: string
  rating: number
  setting: Setting
  suiteId: number
  updatedAt: Date
}