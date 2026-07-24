import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

const inputClassName =
  'rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-600'

type FormFieldProps = {
  label: string
  type?: 'text' | 'email' | 'password'
  autoComplete?: string
  error?: FieldError
  registration: UseFormRegisterReturn
}

export function FormField({
  label,
  type = 'text',
  autoComplete,
  error,
  registration,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      {label}
      <input
        type={type}
        autoComplete={autoComplete}
        className={inputClassName}
        {...registration}
      />
      {error?.message ? (
        <span className="text-sm text-red-600">{error.message}</span>
      ) : null}
    </label>
  )
}
