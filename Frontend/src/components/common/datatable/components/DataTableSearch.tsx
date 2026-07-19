import { useEffect, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { useDebounce } from "../hooks/useDebounce";

interface DataTableSearchProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function DataTableSearch<TData>({
  table,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: DataTableSearchProps<TData>) {
  const [search, setSearch] = useState(() => (table.getState().globalFilter as string) ?? "");

  const debouncedSearch = useDebounce(search, debounceMs);

  useEffect(() => {
    table.setGlobalFilter(debouncedSearch);
  }, [debouncedSearch, table]);

  return (
    <div className={cn("relative w-72", className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />

      {search && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
          onClick={() => setSearch("")}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
