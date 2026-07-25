import { buttonClassName } from '../../../styles'
import type { DataTableFilterValue } from '../../../types'

type BooleanFilterProps = {
  value: DataTableFilterValue<'boolean'>
  onChange: (value: DataTableFilterValue<'boolean'>) => void
}

const options: { label: string; value: DataTableFilterValue<'boolean'> }[] = [
  { label: 'Any', value: null },
  { label: 'Yes', value: true },
  { label: 'No', value: false },
]

export const BooleanFilter = ({ value, onChange }: BooleanFilterProps) => {
  return (
    <div className="flex gap-1">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={String(option.value)}
            type="button"
            className={`${buttonClassName} ${
              active ? 'border-accent bg-accent-soft text-accent' : ''
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
