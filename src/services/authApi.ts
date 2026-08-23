const apiBaseUrl = 'https://dummyjson.com'
const refreshTokenStorageKey = 'sprintdesk-refresh-token'

let accessToken: string | null = null

export type AuthUser = {
  id: number
  username: string
  firstName: string
  lastName: string
  image?: string
}

type AuthResponse = AuthUser & {
  accessToken: string
  refreshToken: string
}

class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
    return data.message
  }
  return fallback
}

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function clearRefreshToken() {
  window.localStorage.removeItem(refreshTokenStorageKey)
}

export function hasRefreshToken() {
  return Boolean(window.localStorage.getItem(refreshTokenStorageKey))
}

async function requestAuth(path: string, body: Record<string, string>) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json() as unknown
  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(data, 'Authentication request failed'))
  }
  return data as AuthResponse
}

export async function loginRequest(username: string, password: string) {
  const response = await requestAuth('/auth/login', { username, password, expiresInMins: '30' })
  setAccessToken(response.accessToken)
  window.localStorage.setItem(refreshTokenStorageKey, response.refreshToken)
  return response
}

export async function refreshRequest() {
  const refreshToken = window.localStorage.getItem(refreshTokenStorageKey)
  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token available')
  }

  const response = await requestAuth('/auth/refresh', { refreshToken, expiresInMins: '30' })
  setAccessToken(response.accessToken)
  window.localStorage.setItem(refreshTokenStorageKey, response.refreshToken)
  return response
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, hasRetried = false): Promise<T> {
  const headers = new Headers(init.headers)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers })
  if (response.status === 401 && !hasRetried && hasRefreshToken()) {
    try {
      await refreshRequest()
      return apiRequest<T>(path, init, true)
    } catch {
      clearRefreshToken()
      setAccessToken(null)
    }
  }

  const data = await response.json() as unknown
  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(data, 'Request failed'))
  }
  return data as T
}