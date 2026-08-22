import { useState } from "react";
import { DateTimeRangeFilter } from "../../../../shared/ui/filters/controls";
import { Popover } from "../../../../shared/ui/primitives/Popover";
import { FilterSelectWrapper } from "./FilterSelectWrapper";
import { formatDate } from "../../../../shared/utils/dateUtils";

type TimeRangeSelecFieldProps = {
  val: { from: string; to: string };
  onChange: (newVal: TimeRangeSelecFieldProps["val"]) => void;
};

export const TimeRangeSelecField = ({ val, onChange }: TimeRangeSelecFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      align="end"
      contentClassName="p-0"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <FilterSelectWrapper label="" width="180px">
          <div
            onClick={(e) => setOpen(true)}
            className="rounded border border-border bg-surface px-2.5 py-1 text-xs h-6 text-foreground cursor-pointer w-full flex justify-between"
          >
            <span>{formatDate(val.from)}</span>
            <span>-</span>
            <span>{formatDate(val.to)}</span>
          </div>
        </FilterSelectWrapper>
      }
    >
      <DateTimeRangeFilter
        value={val}
        onChange={(newVal) =>
          onChange({
            from: new Date(newVal.from ?? val.from).toISOString(),
            to: new Date(newVal.to ?? val.to).toISOString(),
          })
        }
      />
    </Popover>
  );
};
