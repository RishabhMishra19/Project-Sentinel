import { EMPTY_CELL } from "../../styles";
import type { DataTableCellValueByType } from "../../types";

type DateCellProps = {
  value: DataTableCellValueByType["date"];
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const DateCell = ({ value }: DateCellProps) => {
  if (value == null || value === "") {
    return <span className="text-muted">{EMPTY_CELL}</span>;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return <span className="text-muted">{EMPTY_CELL}</span>;
  }

  return <span>{dateFormatter.format(parsed)}</span>;
};
