import type { Column } from "@tanstack/react-table";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateFilterProps<TData> {
  column: Column<TData, unknown>;
}

export function DateFilter<TData>({ column }: DateFilterProps<TData>) {
  const value = column.getFilterValue() as Date | undefined;

  return (
    <div className="p-4">
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" className="w-full justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />

            {value ? format(value, "dd MMM yyyy") : "Select date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => column.setFilterValue(date)}
          />
        </PopoverContent>
      </Popover>

      {value && (
        <Button
          variant="ghost"
          className="mt-3 w-full"
          onClick={() => column.setFilterValue(undefined)}
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
