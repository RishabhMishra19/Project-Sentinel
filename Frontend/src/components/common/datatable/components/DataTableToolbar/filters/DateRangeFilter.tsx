import type { Column } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";

import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangeFilterProps<TData> {
  column: Column<TData, unknown>;
}

export function DateRangeFilter<TData>({ column }: DateRangeFilterProps<TData>) {
  const value = (column.getFilterValue() as DateRange | undefined) ?? {
    from: undefined,
    to: undefined,
  };

  return (
    <div className="space-y-4 p-4">
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" className="w-full justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />

            {value.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd MMM yyyy")} - {format(value.to, "dd MMM yyyy")}
                </>
              ) : (
                format(value.from, "dd MMM yyyy")
              )
            ) : (
              "Select date range"
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={value}
            onSelect={(range) => column.setFilterValue(range)}
          />
        </PopoverContent>
      </Popover>

      {value.from && (
        <Button variant="ghost" className="w-full" onClick={() => column.setFilterValue(undefined)}>
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
