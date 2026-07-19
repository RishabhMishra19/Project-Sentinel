import { useEffect, useMemo, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import type { SelectRootChangeEventDetails } from "@base-ui/react";
import { useDebounce } from "../../hooks/useDebounce";

interface DataTableSearchProps<TData> {
  table: Table<TData>;
  debounceMs?: number;
  className?: string;
}

export function DataTableSearch<TData>({
  table,
  debounceMs = 300,
  className,
}: DataTableSearchProps<TData>) {
  const searchableColumns = useMemo(
    () => table.getAllLeafColumns().filter((column) => column.columnDef.meta?.search?.enabled),
    [table],
  );

  const [selectedColumn, setSelectedColumn] = useState(searchableColumns[0]?.id ?? "");

  const column = table.getColumn(selectedColumn);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, debounceMs);

  useEffect(() => {
    column?.setFilterValue(debouncedSearch);
  }, [column, debouncedSearch]);

  const handleColumnChange = (columnId: string | null, e: SelectRootChangeEventDetails) => {
    if (columnId === null) return;
    table.getColumn(selectedColumn)?.setFilterValue(undefined);

    setSelectedColumn(columnId);
    setSearch("");
  };

  const placeholder = column?.columnDef.meta?.search?.placeholder ?? "Search...";

  return (
    <div className={cn("flex items-center", className)}>
      <Select value={selectedColumn} onValueChange={handleColumnChange}>
        <SelectTrigger className="w-30">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {searchableColumns.map((column) => (
            <SelectItem key={column.id} value={column.id}>
              {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative w-72">
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
    </div>
  );
}
