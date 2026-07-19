import type { Column, Table } from "@tanstack/react-table";
import { Check, ChevronDown } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DataTableFilterProps<TData> {
  table: Table<TData>;
  column: Column<TData>;
}

export function DataTableFilter<TData>({ column }: DataTableFilterProps<TData>) {
  const filter = column.columnDef.meta?.filter;

  if (!filter || filter.type !== "select") {
    return null;
  }

  const selected = (column.getFilterValue() as string[]) ?? [];

  const toggle = (value: string) => {
    const exists = selected.includes(value);

    const next = exists ? selected.filter((v) => v !== value) : [...selected, value];

    column.setFilterValue(next.length ? next : undefined);
  };

  const title = typeof column.columnDef.header === "string" ? column.columnDef.header : column.id;

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">
          {title}

          {selected.length > 0 && <Badge variant="secondary">{selected.length}</Badge>}

          <ChevronDown className="ml-2 size-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-0">
        <Command>
          <CommandInput placeholder={filter.placeholder ?? `Search ${title}...`} />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {filter.options?.map((option) => {
                const checked = selected.includes(option.value);

                return (
                  <CommandItem key={option.value} onSelect={() => toggle(option.value)}>
                    <span className="flex-1">{option.label}</span>

                    {checked && <Check className="size-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {selected.length > 0 && (
              <CommandGroup>
                <CommandItem onSelect={() => column.setFilterValue(undefined)}>
                  Clear filters
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
