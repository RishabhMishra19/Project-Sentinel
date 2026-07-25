import { EMPTY_CELL } from '../../styles'
import type {
  DataTableBadgeVariant,
  DataTableCellValueByType,
} from '../../types'

type BadgeCellProps = {
  value: DataTableCellValueByType['badge']
  labels?: Record<string, string>
  variants?: Record<string, DataTableBadgeVariant>
}

const variantClassName: Record<DataTableBadgeVariant, string> = {
  default: 'bg-accent-soft text-accent',
  success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  muted: 'bg-chrome text-muted',
}

export const BadgeCell = ({ value, labels, variants }: BadgeCellProps) => {
  if (value == null || value === '') {
    return <span className="text-muted">{EMPTY_CELL}</span>
  }

  const label = labels?.[value] ?? value
  const variant = variants?.[value] ?? 'default'

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${variantClassName[variant]}`}
    >
      {label}
    </span>
  )
}
