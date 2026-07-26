import { EMPTY_CELL } from "../../styles";
import type { DataTableCellValueByType } from "../../types";

type NumberCellProps = {
  value: DataTableCellValueByType["number"];
};

export const NumberCell = ({ value }: NumberCellProps) => {
  if (value == null || Number.isNaN(value)) {
    return <span className="text-muted">{EMPTY_CELL}</span>;
  }
  return <span className="tabular-nums">{value.toLocaleString()}</span>;
};
