import { inputClassName } from '../styles'
import type { DataTableFilterValue } from '../types'

type DateFilterProps = {
  value: DataTableFilterValue<'date'>
  onChange: (value: DataTableFilterValue<'date'>) => void
}

export const DateFilter = ({ value, onChange }: DateFilterProps) => {
  return (
    <input
      type="date"
      className={`${inputClassName} w-full`}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value || null)}
    />
  )
}
