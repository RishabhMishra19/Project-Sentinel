import { useEffect, useMemo, useState } from 'react'
import { FilterControl } from './filters/FilterControl'
import { formatFilterValue } from './filters/formatFilterValue'
import { isFilterActive } from './filters/isFilterActive'
import { Popover } from './primitives/Popover'
import { buttonClassName, primaryButtonClassName } from './styles'
import type {
  DataTableColumn,
  DataTableFilterValue,
  DataTableFiltersConfig,
} from './types'

type DataTableFiltersProps<T extends Record<string, unknown>> = {
  columns: DataTableColumn<T>[]
  filtersConfig: DataTableFiltersConfig
}

export const DataTableFilters = <T extends Record<string, unknown>>({
  columns,
  filtersConfig,
}: DataTableFiltersProps<T>) => {
  const { filters, onFiltersChange } = filtersConfig
  const filterable = useMemo(
    () => columns.filter((column) => column.filter != null),
    [columns],
  )

  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Record<string, DataTableFilterValue>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    setDraft(filters)
    setSelectedId(filterable[0]?.id ?? null)
  }, [open, filters, filterable])

  if (filterable.length === 0) {
    return null
  }

  const appliedCount = filterable.filter(
    (column) =>
      column.filter != null &&
      isFilterActive(column.filter, filters[column.id]),
  ).length

  const draftActiveCount = filterable.filter(
    (column) =>
      column.filter != null && isFilterActive(column.filter, draft[column.id]),
  ).length

  const selected = filterable.find((column) => column.id === selectedId) ?? null

  const handleApply = () => {
    const next: Record<string, DataTableFilterValue> = {}
    for (const column of filterable) {
      if (
        column.filter != null &&
        isFilterActive(column.filter, draft[column.id])
      ) {
        next[column.id] = draft[column.id]
      }
    }
    onFiltersChange(next)
    setOpen(false)
  }

  const handleReset = () => {
    setDraft({})
  }

  return (
    <Popover
      align="end"
      contentClassName="p-0"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button type="button" className={buttonClassName}>
          Filters
          {appliedCount > 0 ? (
            <span className="rounded bg-accent-soft px-1.5 text-xs text-accent">
              {appliedCount}
            </span>
          ) : null}
        </button>
      }
    >
      <div className="flex flex-col">
        <div className="flex">
          <ul className="min-w-[10rem] border-r border-border p-1">
            {filterable.map((column) => {
              const active =
                column.filter != null &&
                isFilterActive(column.filter, draft[column.id])
              return (
                <li key={column.id}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-chrome ${
                      selectedId === column.id ? 'bg-chrome' : ''
                    }`}
                    onClick={() => setSelectedId(column.id)}
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
          <div className="min-h-[8rem] w-56 p-2">
            {selected?.filter ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted">
                  {selected.header}
                </p>
                <FilterControl
                  filter={selected.filter}
                  value={draft[selected.id]}
                  onChange={(_type, value) =>
                    setDraft((prev) => ({ ...prev, [selected.id]: value }))
                  }
                />
              </div>
            ) : (
              <p className="text-sm text-muted">Select a column to filter</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border p-2">
          <button
            type="button"
            className={buttonClassName}
            onClick={handleReset}
            disabled={draftActiveCount === 0}
          >
            Reset
          </button>
          <button
            type="button"
            className={primaryButtonClassName}
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </Popover>
  )
}

type AppliedFilterChipsProps<T extends Record<string, unknown>> = {
  columns: DataTableColumn<T>[]
  filtersConfig: DataTableFiltersConfig
}

export const AppliedFilterChips = <T extends Record<string, unknown>>({
  columns,
  filtersConfig,
}: AppliedFilterChipsProps<T>) => {
  const { filters, onFiltersChange, onFiltersClear } = filtersConfig
  const chips = columns.flatMap((column) => {
    if (!column.filter) {
      return []
    }
    const label = formatFilterValue(column.filter, filters[column.id])
    if (!label) {
      return []
    }
    return [{ id: column.id, header: column.header, label }]
  })

  if (chips.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1 rounded border border-border bg-chrome/60 px-2 py-0.5 text-xs text-foreground"
        >
          <span className="text-muted">{chip.header}:</span>
          <span>{chip.label}</span>
          <button
            type="button"
            className="ml-0.5 text-muted hover:text-foreground"
            aria-label={`Remove ${chip.header} filter`}
            onClick={() => {
              const next = { ...filters }
              delete next[chip.id]
              onFiltersChange(next)
            }}
          >
            ×
          </button>
        </span>
      ))}
      <button
        type="button"
        className="text-xs text-muted hover:text-foreground"
        onClick={onFiltersClear}
      >
        Clear all
      </button>
    </div>
  )
}
