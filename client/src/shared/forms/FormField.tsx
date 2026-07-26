import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

const inputClassName =
  "rounded border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-ring";

type FormFieldProps = {
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
};

export const FormField = ({
  label,
  type = "text",
  autoComplete,
  error,
  registration,
}: FormFieldProps) => (
  <label className="flex flex-col gap-1 text-sm text-foreground">
    {label}
    <input type={type} autoComplete={autoComplete} className={inputClassName} {...registration} />
    {error?.message ? <span className="text-sm text-danger">{error.message}</span> : null}
  </label>
);
