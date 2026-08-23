import { beforeEach, describe, expect, test, vi } from 'vitest'
import { apiRequest, setAccessToken } from './authApi'

const userResponse = {
  id: 1,
  username: 'emilys',
  firstName: 'Emily',
  lastName: 'Johnson',
  refreshToken: 'new-refresh-token',
}

describe('auth API client', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setAccessToken(null)
    vi.restoreAllMocks()
  })

  test('attaches the access token to API requests', async () => {
    window.localStorage.setItem('sprintdesk-refresh-token', 'refresh-token')
    setAccessToken('access-token')
    const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
      .mockResolvedValue(new Response(JSON.stringify({ id: 1 }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/users/1')

    expect(fetchMock).toHaveBeenCalledWith('https://dummyjson.com/users/1', expect.objectContaining({
      headers: expect.any(Headers),
    }))
    const request = fetchMock.mock.calls[0]?.[1]
    expect(request).toBeDefined()
    expect(new Headers(request?.headers).get('Authorization')).toBe('Bearer access-token')
  })

  test('refreshes and retries once after an unauthorized response', async () => {
    window.localStorage.setItem('sprintdesk-refresh-token', 'old-refresh-token')
    setAccessToken('expired-access-token')
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ...userResponse, accessToken: 'new-access-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1 }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiRequest('/users/1')).resolves.toEqual({ id: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls[2][1].headers.get('Authorization')).toBe('Bearer new-access-token')
  })
})
