import { EMPTY_CELL } from '../../styles'
import type { DataTableCellValueByType } from '../../types'

type TextCellProps = {
  value: DataTableCellValueByType['text']
}

export const TextCell = ({ value }: TextCellProps) => {
  if (value == null || value === '') {
    return <span className="text-muted">{EMPTY_CELL}</span>
  }
  return <span>{value}</span>
}
