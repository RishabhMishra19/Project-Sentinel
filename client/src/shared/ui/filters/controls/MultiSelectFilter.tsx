import type { FilterOption, FilterValue } from '../types'

type MultiSelectFilterProps = {
  value: FilterValue<'multiSelect'>
  options: FilterOption[]
  onChange: (value: FilterValue<'multiSelect'>) => void
}

export const MultiSelectFilter = ({
  value,
  options,
  onChange,
}: MultiSelectFilterProps) => {
  const selected = new Set(value)

  return (
    <ul className="flex max-h-48 flex-col gap-1 overflow-auto">
      {options.map((option) => {
        const checked = selected.has(option.value)
        return (
          <li key={option.value}>
            <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-chrome">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const next = new Set(selected)
                  if (checked) {
                    next.delete(option.value)
                  } else {
                    next.add(option.value)
                  }
                  onChange([...next])
                }}
              />
              <span>{option.label}</span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}
