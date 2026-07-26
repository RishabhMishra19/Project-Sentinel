import { buildFilterChips } from './filterUtils'
import type { FilterField, FiltersConfig } from './types'

type AppliedFilterChipsProps = {
  fields: FilterField[]
  filtersConfig: FiltersConfig
}

export const AppliedFilterChips = ({
  fields,
  filtersConfig,
}: AppliedFilterChipsProps) => {
  const { filters, onFiltersChange } = filtersConfig
  const chips = buildFilterChips(fields, filters)

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
              const { [chip.id]: _removed, ...next } = filters
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
        onClick={() => onFiltersChange({})}
      >
        Clear all
      </button>
    </div>
  )
}
