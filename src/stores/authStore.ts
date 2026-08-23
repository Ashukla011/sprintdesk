import { create } from 'zustand'
import {
  clearRefreshToken,
  getCurrentUser,
  hasRefreshToken,
  loginRequest,
  refreshRequest,
  setSessionExpiredHandler,
  setAccessToken,
  type AuthUser,
} from '../services/authApi'

const userStorageKey = 'sprintdesk-user-profile'

function readStoredUser(): AuthUser | null {
  const stored = window.localStorage.getItem(userStorageKey)
  if (!stored) return null
  try {
    const candidate: unknown = JSON.parse(stored)
    if (
      typeof candidate === 'object' &&
      candidate !== null &&
      'id' in candidate &&
      'username' in candidate &&
      typeof candidate.id === 'number' &&
      typeof candidate.username === 'string'
    ) {
      return candidate as AuthUser
    }
  } catch {
    // An invalid cached profile should never prevent session restoration.
  }
  return null
}

function saveUser(user: AuthUser) {
  window.localStorage.setItem(userStorageKey, JSON.stringify(user))
}

function clearStoredUser() {
  window.localStorage.removeItem(userStorageKey)
}

function hasUserProfile(value: AuthUser | { username?: unknown }): value is AuthUser {
  return typeof value.username === 'string' && value.username.length > 0
}

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
      const user = hasUserProfile(response)
        ? response
        : readStoredUser() ?? await getCurrentUser()
      saveUser(user)
      set({ status: 'authenticated', user })
    } catch {
      clearRefreshToken()
      clearStoredUser()
      setAccessToken(null)
      set({ status: 'unauthenticated', user: null })
    }
  },
  login: async (username, password) => {
    set({ error: null })
    try {
      const response = await loginRequest(username, password)
      saveUser(response)
      set({ status: 'authenticated', user: response, error: null })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unable to sign in' })
      throw error
    }
  },
  logout: () => {
    clearRefreshToken()
    clearStoredUser()
    setAccessToken(null)
    set({ status: 'unauthenticated', user: null, error: null })
  },
}))

// A failed refresh can happen inside any authenticated API request. Keeping this
// bridge here ensures that it also changes route access and returns the user to /login.
setSessionExpiredHandler(() => {
  clearStoredUser()
  useAuthStore.setState({ status: 'unauthenticated', user: null, error: null })
})
