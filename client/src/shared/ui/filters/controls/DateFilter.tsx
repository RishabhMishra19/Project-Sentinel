import { inputClassName } from '../styles'
import type { FilterValue } from '../types'

type DateFilterProps = {
  value: FilterValue<'date'>
  onChange: (value: FilterValue<'date'>) => void
}

export const DateFilter = ({ value, onChange }: DateFilterProps) => (
  <input
    type="date"
    className={`${inputClassName} w-full`}
    value={value ?? ''}
    onChange={(event) => onChange(event.target.value || null)}
  />
)
