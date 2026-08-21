import { useState } from "react";
import { DateRangeFilter, DateTimeRangeFilter } from "../../../shared/ui/filters/controls";
import { Popover } from "../../../shared/ui/primitives/Popover";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { FilterSelectWrapper } from "./FilterSelectWrapper";
import { formatDate } from "../../../shared/utils/dateUtils";

export const TimeRangeSelecField = () => {
  const [open, setOpen] = useState(false);
  const { from, to, mergeParams } = useAnalyticsSearchParams();

  return (
    <Popover
      align="end"
      contentClassName="p-0"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <FilterSelectWrapper label="Time Window" width="210px">
          <div
            onClick={(e) => setOpen(true)}
            className="rounded border border-border bg-surface px-2.5 py-1 text-sm text-foreground cursor-pointer w-full flex justify-between"
          >
            <span>{formatDate(from)}</span>
            <span>-</span>
            <span>{formatDate(to)}</span>
          </div>
        </FilterSelectWrapper>
      }
    >
      <DateTimeRangeFilter
        value={{ from, to }}
        onChange={(val) =>
          mergeParams({
            from: val.from ? new Date(val.from).toISOString() : null,
            to: val.to ? new Date(val.to).toISOString() : null,
          })
        }
      />
    </Popover>
  );
};
