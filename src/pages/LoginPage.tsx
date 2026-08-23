import { useState, type FormEvent } from 'react'
import { useAuthStore } from '../stores/authStore'

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const error = useAuthStore((state) => state.error)
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
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
    <main className="grid min-h-screen place-items-center bg-stone-50 px-6 text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <section aria-labelledby="login-heading" className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">SprintDesk</p>
        <h1 id="login-heading" className="mt-3 text-3xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300">Sign in to continue to your team workspace.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-bold" htmlFor="username">Username
            <input className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 font-normal outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-950" id="username" onChange={(event) => setUsername(event.target.value)} required value={username} />
          </label>
          <label className="block text-sm font-bold" htmlFor="password">Password
            <input className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 font-normal outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-950" id="password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
          </label>
          {error && <p aria-live="polite" className="text-sm font-semibold text-rose-600">{error}</p>}
          <button className="w-full rounded-md bg-stone-950 px-4 py-3 font-bold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-400 dark:text-stone-950 dark:hover:bg-amber-300" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}