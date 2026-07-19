import { useMemo, useState } from "react";
import type { Column, Table } from "@tanstack/react-table";
import { Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterMenu } from "./FilterMenu";
import { FilterPopup } from "./FilterPopup";

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
}

export function DataTableFilters<TData>({ table }: DataTableFiltersProps<TData>) {
  const filterableColumns = useMemo(
    () => table.getAllLeafColumns().filter((column) => column.columnDef.meta?.filter),
    [table],
  );

  const [activeColumn, setActiveColumn] = useState<Column<TData, unknown> | undefined>(
    filterableColumns[0],
  );

  const activeFilterCount = table.getState().columnFilters.length;

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2" variant="secondary">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[450px] p-0 overflow-hidden">
        <div className="flex h-[350px]">
          <FilterMenu
            columns={filterableColumns}
            activeColumn={activeColumn}
            onHover={setActiveColumn}
          />

          <FilterPopup column={activeColumn} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
