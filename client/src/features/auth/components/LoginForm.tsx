import { useState, type FormEvent } from 'react'
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-slate-700">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-700">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
        />
      </label>
      {loginMutation.isError ? (
        <p className="text-sm text-red-600">Invalid email or password</p>
      ) : null}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
