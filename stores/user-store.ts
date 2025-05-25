import { create } from 'zustand'
import { mockUsers, type User } from '../lib/mock-data'

interface UserStore {
  users: User[]
  currentUser: User | null

  // Actions
  setCurrentUser: (userId: string) => void
  updateUserStatus: (userId: string, status: 'online' | 'offline' | 'away') => void
  updateUserLastSeen: (userId: string) => void
  getUserById: (userId: string) => User | undefined
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: mockUsers,
  currentUser: mockUsers.find((user) => user.id === 'current-user') || null,

  setCurrentUser: (userId) =>
    set((state) => ({
      currentUser: state.users.find((user) => user.id === userId) || state.currentUser,
    })),

  updateUserStatus: (userId, status) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === userId ? { ...user, status, lastSeen: new Date() } : user)),
      currentUser:
        state.currentUser?.id === userId ? { ...state.currentUser, status, lastSeen: new Date() } : state.currentUser,
    })),

  updateUserLastSeen: (userId) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === userId ? { ...user, lastSeen: new Date() } : user)),
      currentUser:
        state.currentUser?.id === userId ? { ...state.currentUser, lastSeen: new Date() } : state.currentUser,
    })),

  getUserById: (userId) => {
    return get().users.find((user) => user.id === userId)
  },
}))
