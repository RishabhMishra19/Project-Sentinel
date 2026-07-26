import { useEffect, useState } from 'react'
import { Popover } from '../primitives/Popover'
import { FilterColumnList } from './components/FilterColumnList'
import { FilterEditorPanel } from './components/FilterEditorPanel'
import { FilterPopoverActions } from './components/FilterPopoverActions'
import {
  collectActiveFilters,
  countActiveFilters,
} from './filterUtils'
import { buttonClassName } from './styles'
import type { FilterField, FilterValue, FiltersConfig } from './types'

type FiltersProps = {
  fields: FilterField[]
  filtersConfig: FiltersConfig
}

export const Filters = ({ fields, filtersConfig }: FiltersProps) => {
  const { filters, onFiltersChange } = filtersConfig

  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Record<string, FilterValue>>({})
  const [selectedId, setSelectedId] = useState(() => fields[0]?.id ?? '')

  useEffect(() => {
    if (!open) {
      return
    }
    setDraft(filters)
    setSelectedId((prev) =>
      fields.some((field) => field.id === prev)
        ? prev
        : (fields[0]?.id ?? ''),
    )
  }, [open, filters, fields])

  if (fields.length === 0) {
    return null
  }

  const selected = fields.find((field) => field.id === selectedId) ?? fields[0]
  const appliedCount = countActiveFilters(fields, filters)
  const draftActiveCount = countActiveFilters(fields, draft)

  const handleDraftChange = (filterId: string, value: FilterValue) => {
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
            fields={fields}
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
            onFiltersChange(collectActiveFilters(fields, draft))
            setOpen(false)
          }}
        />
      </div>
    </Popover>
  )
}
