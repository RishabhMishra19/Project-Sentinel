import { isFilterActive } from './filterUtils'
import type { FilterableColumnOption } from './filterUtils'
import type { DataTableFilterValue } from '../../types'

type FilterColumnListProps = {
  columns: FilterableColumnOption[]
  draft: Record<string, DataTableFilterValue>
  selectedId: string
  onSelect: (columnId: string) => void
}

export const FilterColumnList = ({
  columns,
  draft,
  selectedId,
  onSelect,
}: FilterColumnListProps) => (
  <ul className="min-w-[10rem] border-r border-border p-1">
    {columns.map((column) => {
      const active = isFilterActive(column.filter, draft[column.id])
      return (
        <li key={column.id}>
          <button
            type="button"
            className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-chrome ${
              selectedId === column.id ? 'bg-chrome' : ''
            }`}
            onClick={() => onSelect(column.id)}
          >
            <span>{column.header}</span>
            {active ? (
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            ) : null}
          </button>
        </li>
      )
    })}
  </ul>
)
