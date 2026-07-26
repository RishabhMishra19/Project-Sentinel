import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { FormError } from "./FormError";

const inputClassName =
  "rounded border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-ring disabled:cursor-not-allowed disabled:opacity-60";

type TextFieldProps = {
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  placeholder?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  disabled?: boolean;
};

export const TextField = ({
  label,
  type = "text",
  autoComplete,
  placeholder,
  error,
  registration,
  disabled,
}: TextFieldProps) => (
  <label className="flex flex-col gap-1 text-sm text-foreground">
    {label}
    <input
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClassName}
      {...registration}
    />
    {error?.message ? <FormError>{error.message}</FormError> : null}
  </label>
);
