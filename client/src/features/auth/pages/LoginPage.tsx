import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-lg rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900">Sentinel</h1>
        <p className="mb-6 text-sm text-slate-600">Sign in to manage API endpoints</p>
        <LoginForm />
      </section>
    </main>
  )
}
