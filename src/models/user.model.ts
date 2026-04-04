import { Role, UserStatus } from "../constants"

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  role: Role
  status: UserStatus
  created_at: Date
  updated_at: Date
}

export interface AuthenticatedUser {
  id: number
  name: string
  email: string
  role: Role
  status: UserStatus
}