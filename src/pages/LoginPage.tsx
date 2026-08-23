import { useState, type FormEvent } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Button, Input } from '../components/ui'
import { useTheme } from '../hooks/useTheme'

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const error = useAuthStore((state) => state.error)
  const { isDark, toggleTheme } = useTheme()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await login(username, password)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center bg-stone-50 px-6 text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <button aria-label="Toggle dark mode" className="absolute right-6 top-6 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-bold hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900" onClick={toggleTheme} type="button">
        {isDark ? 'Light' : 'Dark'}
      </button>
      <section aria-labelledby="login-heading" className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">SprintDesk</p>
        <h1 id="login-heading" className="mt-3 text-3xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300">Sign in to continue to your team workspace.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input id="username" label="Username" onChange={(event) => setUsername(event.target.value)} required value={username} />
          <Input id="password" label="Password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
          {error && <p aria-live="polite" className="text-sm font-semibold text-rose-600">{error}</p>}
          <Button className="w-full py-3" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </section>
    </main>
  )
}
