import { useEffect, useState } from 'react'
import { Popover } from '../../../primitives/Popover'
import { FilterColumnList } from './FilterColumnList'
import { FilterEditorPanel } from './FilterEditorPanel'
import { FilterPopoverActions } from './FilterPopoverActions'
import {
  collectActiveFilters,
  countActiveFilters,
  type FilterableColumnOption,
} from './filterUtils'
import { buttonClassName } from '../../styles'
import type {
  DataTableFilterValue,
  DataTableFiltersConfig,
} from '../../types'

type DataTableFiltersProps = {
  columns: FilterableColumnOption[]
  filtersConfig: DataTableFiltersConfig
}

export const DataTableFilters = ({
  columns,
  filtersConfig,
}: DataTableFiltersProps) => {
  const { filters, onFiltersChange } = filtersConfig

  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Record<string, DataTableFilterValue>>({})
  const [selectedId, setSelectedId] = useState(() => columns[0]?.id ?? '')

  useEffect(() => {
    if (!open) {
      return
    }
    setDraft(filters)
    setSelectedId((prev) =>
      columns.some((column) => column.id === prev)
        ? prev
        : (columns[0]?.id ?? ''),
    )
  }, [open, filters, columns])

  if (columns.length === 0) {
    return null
  }

  const selected =
    columns.find((column) => column.id === selectedId) ?? columns[0]
  const appliedCount = countActiveFilters(columns, filters)
  const draftActiveCount = countActiveFilters(columns, draft)

  const handleDraftChange = (
    filterId: string,
    value: DataTableFilterValue,
  ) => {
    setDraft((prev) => ({ ...prev, [filterId]: value }))
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
          <FilterColumnList
            columns={columns}
            draft={draft}
            selectedId={selected.id}
            onSelect={setSelectedId}
          />
          <FilterEditorPanel
            selected={selected}
            value={draft[selected.id]}
            onChange={handleDraftChange}
          />
        </div>
        <FilterPopoverActions
          canReset={draftActiveCount > 0}
          onReset={() => setDraft({})}
          onApply={() => {
            onFiltersChange(collectActiveFilters(columns, draft))
            setOpen(false)
          }}
        />
      </div>
    </Popover>
  )
}
