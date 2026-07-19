import type { Column } from "@tanstack/react-table";
import { Check } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SelectFilterProps<TData> {
  column: Column<TData, unknown>;
}

export function SelectFilter<TData>({ column }: SelectFilterProps<TData>) {
  const filter = column.columnDef.meta?.filter;

  if (!filter || filter.type !== "select") {
    return null;
  }

  const selected = (column.getFilterValue() as string[]) ?? [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    column.setFilterValue(next.length ? next : undefined);
  };

  const clear = () => {
    column.setFilterValue(undefined);
  };

  return (
    <Command className="h-full">
      <CommandInput placeholder={filter.placeholder ?? `Search ${column.id}...`} />

      <CommandList>
        <CommandEmpty>No options found.</CommandEmpty>

        <CommandGroup>
          {filter.options?.map((option) => {
            const checked = selected.includes(option.value);

            return (
              <CommandItem key={option.value} onSelect={() => toggle(option.value)}>
                <span className="flex-1">{option.label}</span>

                {checked && <Check className="h-4 w-4" />}
              </CommandItem>
            );
          })}
        </CommandGroup>

        {selected.length > 0 && (
          <CommandGroup>
            <CommandItem onSelect={clear}>Clear filter</CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
