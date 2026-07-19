import { useMemo } from "react";
import type { Table } from "@tanstack/react-table";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";

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

interface DataTableFilterOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

interface DataTableFilterProps<TData> {
  table: Table<TData>;
  columnId: string;
  title: string;
  options: DataTableFilterOption[];
}

export function DataTableFilter<TData>({
  table,
  columnId,
  title,
  options,
}: DataTableFilterProps<TData>) {
  const column = table.getColumn(columnId);

  const selected = useMemo(() => (column?.getFilterValue() as string[]) ?? [], [column]);

  if (!column) return null;

  const toggle = (value: string) => {
    const exists = selected.includes(value);

    const next = exists ? selected.filter((v) => v !== value) : [...selected, value];

    column.setFilterValue(next.length ? next : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">
          {title}

          {selected.length > 0 && <Badge variant="secondary">{selected.length}</Badge>}

          <ChevronDown className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-0">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const checked = selected.includes(option.value);

                return (
                  <CommandItem key={option.value} onSelect={() => toggle(option.value)}>
                    {option.icon && <option.icon className="mr-2 size-4 text-muted-foreground" />}

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
