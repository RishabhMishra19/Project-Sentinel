import type { ReactNode } from 'react'
import type { DataTableCellConfig } from '../types'
import { BadgeCell } from './BadgeCell'
import { BooleanCell } from './BooleanCell'
import { DateCell } from './DateCell'
import { DateTimeCell } from './DateTimeCell'
import { NumberCell } from './NumberCell'
import { TextCell } from './TextCell'

export const renderCell = <T extends Record<string, unknown>>(
  cell: DataTableCellConfig<T>,
  row: T,
): ReactNode => {
  switch (cell.type) {
    case 'text':
      return <TextCell value={cell.getValue(row)} />
    case 'number':
      return <NumberCell value={cell.getValue(row)} />
    case 'date':
      return <DateCell value={cell.getValue(row)} />
    case 'datetime':
      return <DateTimeCell value={cell.getValue(row)} />
    case 'boolean':
      return (
        <BooleanCell
          value={cell.getValue(row)}
          trueLabel={cell.trueLabel}
          falseLabel={cell.falseLabel}
        />
      )
    case 'badge':
      return (
        <BadgeCell
          value={cell.getValue(row)}
          labels={cell.labels}
          variants={cell.variants}
        />
      )
    case 'custom':
      return cell.render(row)
  }
}
