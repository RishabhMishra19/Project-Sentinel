import { inputClassName } from '../../../styles'
import type { DataTableFilterValue } from '../../../types'

type DateRangeFilterProps = {
  value: DataTableFilterValue<'dateRange'>
  onChange: (value: DataTableFilterValue<'dateRange'>) => void
}

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const range = value ?? { from: null, to: null }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1 text-xs text-muted">
        From
        <input
          type="date"
          className={inputClassName}
          value={range.from ?? ''}
          onChange={(event) =>
            onChange({
              from: event.target.value || null,
              to: range.to,
            })
          }
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        To
        <input
          type="date"
          className={inputClassName}
          value={range.to ?? ''}
          onChange={(event) =>
            onChange({
              from: range.from,
              to: event.target.value || null,
            })
          }
        />
      </label>
    </div>
  )
}
