import { FormField } from '../../../shared/forms/FormField'
import { getApiErrorMessage } from '../../../shared/forms/getApiErrorMessage'
import { useAppForm } from '../../../shared/forms/useAppForm'
import { toast } from '../../../shared/ui/toast'
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
    void toast
      .promise(loginMutation.mutateAsync(data), {
        loading: 'Signing in…',
        success: 'Signed in successfully.',
        error: (error) =>
          getApiErrorMessage(error, 'Invalid email or password'),
      })
      .unwrap()
      .catch(() => {
        // Error already surfaced via toast
      })
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
        className="cursor-pointer rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
