import type { SelectFieldProps, SelectOption } from "./SelectField";
import { SelectField } from "./SelectField";

type ServerSelectQuery<T> = {
  rows: readonly T[];
  isLoading: boolean;
  isError: boolean;
};

type ServerSelectFieldProps<T> = Omit<SelectFieldProps, "options" | "disabled" | "placeholder"> & {
  query: ServerSelectQuery<T>;
  toOption: (row: T) => SelectOption;
  placeholder?: string;
  loadingPlaceholder?: string;
  emptyPlaceholder?: string;
  errorMessage?: string;
  emptyMessage?: string;
  disabled?: boolean;
};

export const ServerSelectField = <T,>({
  query,
  toOption,
  placeholder = "Select…",
  loadingPlaceholder = "Loading…",
  emptyPlaceholder = "No options available",
  errorMessage = "Could not load options.",
  emptyMessage,
  disabled = false,
  error,
  ...selectProps
}: ServerSelectFieldProps<T>) => {
  const { rows, isLoading, isError } = query;
  const isEmpty = !isLoading && !isError && rows.length === 0;

  const resolvedPlaceholder = isLoading
    ? loadingPlaceholder
    : isError
      ? "Unavailable"
      : isEmpty
        ? emptyPlaceholder
        : placeholder;

  const options = isLoading || isError ? [] : rows.map(toOption);

  return (
    <div className="flex flex-col gap-1">
      <SelectField
        {...selectProps}
        options={options}
        placeholder={resolvedPlaceholder}
        disabled={disabled || isLoading || isError || isEmpty}
        error={error}
      />
      {isEmpty && emptyMessage ? <span className="text-sm text-muted">{emptyMessage}</span> : null}
      {isError ? <span className="text-sm text-danger">{errorMessage}</span> : null}
    </div>
  );
};
