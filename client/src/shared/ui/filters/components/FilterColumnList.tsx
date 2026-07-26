import { isFilterActive } from '../filterUtils'
import type { FilterField } from '../types'
import type { FilterValue } from '../types'

type FilterColumnListProps = {
  fields: FilterField[]
  draft: Record<string, FilterValue>
  selectedId: string
  onSelect: (fieldId: string) => void
}

export const FilterColumnList = ({
  fields,
  draft,
  selectedId,
  onSelect,
}: FilterColumnListProps) => (
  <ul className="min-w-[10rem] border-r border-border p-1">
    {fields.map((field) => {
      const active = isFilterActive(field.filter, draft[field.id])
      return (
        <li key={field.id}>
          <button
            type="button"
            className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-chrome ${
              selectedId === field.id ? 'bg-chrome' : ''
            }`}
            onClick={() => onSelect(field.id)}
          >
            <span>{field.header}</span>
            {active ? (
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            ) : null}
          </button>
        </li>
      )
    })}
  </ul>
)
