import type { Column } from "@tanstack/react-table";
import { Check } from "lucide-react";

import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface BooleanFilterProps<TData> {
  column: Column<TData, unknown>;
}

const OPTIONS = [
  {
    label: "True",
    value: true,
  },
  {
    label: "False",
    value: false,
  },
];

export function BooleanFilter<TData>({ column }: BooleanFilterProps<TData>) {
  const value = column.getFilterValue() as boolean | undefined;

  const select = (next: boolean) => {
    column.setFilterValue(next);
  };

  return (
    <Command className="h-full">
      <CommandList>
        <CommandGroup>
          {OPTIONS.map((option) => (
            <CommandItem key={String(option.value)} onSelect={() => select(option.value)}>
              <span className="flex-1">{option.label}</span>

              {value === option.value && <Check className="h-4 w-4" />}
            </CommandItem>
          ))}
        </CommandGroup>

        {value !== undefined && (
          <CommandGroup>
            <CommandItem onSelect={() => column.setFilterValue(undefined)}>
              Clear filter
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
