export interface TAuthUser {
  id: string
  username: string
}

export interface TComment {
  id: string
  body: string
  gameId: string
  userId: string
  createdAt: string | Date
  updatedAt: string | Date
  user: TAuthUser
}
