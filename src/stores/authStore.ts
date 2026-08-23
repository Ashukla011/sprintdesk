import { create } from 'zustand'
import {
  clearRefreshToken,
  hasRefreshToken,
  loginRequest,
  refreshRequest,
  setAccessToken,
  type AuthUser,
} from '../services/authApi'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthState = {
  status: AuthStatus
  user: AuthUser | null
  error: string | null
  initialize: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,
  error: null,
  initialize: async () => {
    if (!hasRefreshToken()) {
      set({ status: 'unauthenticated', user: null })
      return
    }

    try {
      const response = await refreshRequest()
      set({ status: 'authenticated', user: response })
    } catch {
      clearRefreshToken()
      setAccessToken(null)
      set({ status: 'unauthenticated', user: null })
    }
  },
  login: async (username, password) => {
    set({ error: null })
    try {
      const response = await loginRequest(username, password)
      set({ status: 'authenticated', user: response, error: null })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unable to sign in' })
      throw error
    }
  },
  logout: () => {
    clearRefreshToken()
    setAccessToken(null)
    set({ status: 'unauthenticated', user: null, error: null })
  },
}))