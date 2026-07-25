import { EMPTY_CELL } from '../../styles'
import type { DataTableCellValueByType } from '../../types'

type BooleanCellProps = {
  value: DataTableCellValueByType['boolean']
  trueLabel?: string
  falseLabel?: string
}

export const BooleanCell = ({
  value,
  trueLabel = 'Yes',
  falseLabel = 'No',
}: BooleanCellProps) => {
  if (value == null) {
    return <span className="text-muted">{EMPTY_CELL}</span>
  }
  return <span>{value ? trueLabel : falseLabel}</span>
}
