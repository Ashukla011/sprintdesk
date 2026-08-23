import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import App from './App'
import { useAuthStore } from './stores/authStore'

const refreshTokenKey = 'sprintdesk-refresh-token'
const user = {
  id: 1,
  username: 'emilys',
  firstName: 'Emily',
  lastName: 'Johnson',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
}

function mockAuthResponse() {
  vi.stubGlobal('fetch', vi.fn(async (input) => {
    const body = String(input).includes('/auth/') ? user : { tasks: [] }
    return new Response(JSON.stringify(body), { status: 200 })
  }))
}

describe('App authentication', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/dashboard')
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
    useAuthStore.setState({ status: 'loading', user: null, error: null })
    vi.restoreAllMocks()
  })

  test('shows the session validation state before routing', async () => {
    let resolveRefresh
    const refreshPromise = new Promise((resolve) => { resolveRefresh = resolve })
    vi.stubGlobal('fetch', vi.fn(() => refreshPromise))
    window.localStorage.setItem(refreshTokenKey, 'refresh-token')

    render(<App />)
    expect(screen.getByLabelText(/validating session/i)).toBeInTheDocument()

    resolveRefresh(new Response(JSON.stringify(user), { status: 200 }))
    expect(await screen.findByRole('heading', { name: /your sprint at a glance/i })).toBeInTheDocument()
  })

  test('redirects unauthenticated users to login', async () => {
    window.history.pushState({}, '', '/board')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
  })

  test('logs in through the authentication API', async () => {
    const currentUser = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async (input) => {
      const body = String(input).includes('/auth/') ? user : { tasks: [] }
      return new Response(JSON.stringify(body), { status: 200 })
    }))
    window.history.pushState({}, '', '/login')
    render(<App />)

    await currentUser.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('heading', { name: /your sprint at a glance/i })).toBeInTheDocument()
    expect(window.localStorage.getItem(refreshTokenKey)).toBe('refresh-token')
    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/auth/login', expect.objectContaining({ method: 'POST' }))
  })

  test('renders the authenticated shell and supports navigation', async () => {
    const currentUser = userEvent.setup()
    window.localStorage.setItem(refreshTokenKey, 'refresh-token')
    mockAuthResponse()
    render(<App />)

    expect(await screen.findByRole('heading', { name: /your sprint at a glance/i })).toBeInTheDocument()
    await currentUser.click(screen.getByRole('link', { name: /^board$/i }))
    expect(screen.getByRole('heading', { name: /sprint board/i })).toBeInTheDocument()
  })

  test('logs out and returns to login', async () => {
    const currentUser = userEvent.setup()
    window.localStorage.setItem(refreshTokenKey, 'refresh-token')
    mockAuthResponse()
    render(<App />)

    await screen.findByRole('heading', { name: /your sprint at a glance/i })
    await currentUser.click(screen.getByRole('button', { name: /log out/i }))

    expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(window.localStorage.getItem(refreshTokenKey)).toBeNull()
  })
})
