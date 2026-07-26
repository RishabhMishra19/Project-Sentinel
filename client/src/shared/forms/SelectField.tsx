import type { ComponentProps } from "react";
import type { FieldError } from "react-hook-form";

const selectClassName =
  "rounded border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-ring disabled:cursor-not-allowed disabled:opacity-60";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectFieldProps = {
  label?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  emptyPlaceholder?: string;
  error?: FieldError;
} & Omit<ComponentProps<"select">, "children">;

export const SelectField = ({
  label,
  options,
  placeholder,
  emptyPlaceholder = "No options available",
  error,
  className,
  disabled,
  ...selectProps
}: SelectFieldProps) => {
  const isEmpty = options.length === 0;
  const resolvedPlaceholder = isEmpty ? (placeholder ?? emptyPlaceholder) : placeholder;

  const select = (
    <select
      className={className ? `${selectClassName} ${className}` : selectClassName}
      disabled={disabled || isEmpty}
      {...selectProps}
    >
      {resolvedPlaceholder ? <option value="">{resolvedPlaceholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const errorMessage = error?.message ? (
    <span className="text-sm text-danger">{error.message}</span>
  ) : null;

  if (!label) {
    return (
      <>
        {select}
        {errorMessage}
      </>
    );
  }

  return (
    <label className="flex flex-col gap-1 text-sm text-foreground">
      {label}
      {select}
      {errorMessage}
    </label>
  );
};
