import type { DataTableSearchConfig } from './types'

export type SearchableColumnOption = {
  id: string
  header: string
}

type DataTableSearchProps = {
  columns: SearchableColumnOption[]
  searchConfig: DataTableSearchConfig
}

export const DataTableSearch = ({
  columns,
  searchConfig,
}: DataTableSearchProps) => {
  const { search, onSearchChange } = searchConfig

  if (columns.length === 0) {
    return null
  }

  const columnId = search.columnId || columns[0].id
  const value = search.value
  const hasColumnSelect = columns.length > 1
  const columnHeader =
    columns.find((column) => column.id === columnId)?.header ?? ''

  return (
    <div className="flex min-w-0 flex-1 overflow-hidden rounded border border-border bg-surface focus-within:border-ring sm:max-w-md">
      {hasColumnSelect ? (
        <div className="relative shrink-0 border-r border-border">
          <select
            className="h-full appearance-none bg-transparent py-1.5 pl-2.5 pr-7 text-sm text-foreground outline-none"
            value={columnId}
            onChange={(event) =>
              onSearchChange({ columnId: event.target.value, value })
            }
            aria-label="Search column"
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.header}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted"
          >
            ▾
          </span>
        </div>
      ) : null}
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-sm text-foreground outline-none"
        placeholder={`Search ${columnHeader}…`}
        value={value}
        onChange={(event) =>
          onSearchChange({ columnId, value: event.target.value })
        }
      />
    </div>
  )
}
