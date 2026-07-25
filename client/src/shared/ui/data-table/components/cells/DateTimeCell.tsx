import { EMPTY_CELL } from '../../styles'
import type { DataTableCellValueByType } from '../../types'

type DateTimeCellProps = {
  value: DataTableCellValueByType['datetime']
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export const DateTimeCell = ({ value }: DateTimeCellProps) => {
  if (value == null || value === '') {
    return <span className="text-muted">{EMPTY_CELL}</span>
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return <span className="text-muted">{EMPTY_CELL}</span>
  }

  return <span>{dateTimeFormatter.format(parsed)}</span>
}
