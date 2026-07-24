import { FormError } from '../../../shared/forms/FormError'
import { FormField } from '../../../shared/forms/FormField'
import { useAppForm } from '../../../shared/forms/useAppForm'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'

export function LoginForm() {
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<LoginFormValues>({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4"
    >
      <FormField
        label="Email"
        type="email"
        autoComplete="username"
        error={errors.email}
        registration={register('email')}
      />
      <FormField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password}
        registration={register('password')}
      />
      {loginMutation.isError ? (
        <FormError>Invalid email or password</FormError>
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
