import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => (
  <section className="w-full max-w-lg rounded-xl border border-border bg-surface p-8">
    <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">Sign in</h2>
    <p className="mb-6 text-sm text-muted">Enter your credentials to continue</p>
    <LoginForm />
  </section>
);
