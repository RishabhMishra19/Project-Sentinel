import { FormField } from '../../../shared/forms/FormField'
import { useAppForm } from '../../../shared/forms/useAppForm'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'

export const LoginForm = () => {
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<LoginFormValues>({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginFormValues) => {
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
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="cursor-pointer rounded bg-accent px-4 py-2 text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
