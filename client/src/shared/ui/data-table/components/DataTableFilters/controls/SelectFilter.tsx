import { inputClassName } from '../../../styles'
import type { DataTableFilterOption, DataTableFilterValue } from '../../../types'

type SelectFilterProps = {
  value: DataTableFilterValue<'select'>
  options: DataTableFilterOption[]
  onChange: (value: DataTableFilterValue<'select'>) => void
}

export const SelectFilter = ({ value, options, onChange }: SelectFilterProps) => {
  return (
    <select
      className={`${inputClassName} w-full`}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value || null)}
    >
      <option value="">Any</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
