import { FilterControl } from './FilterControl'
import type { FilterField, FilterValue } from '../types'

type FilterEditorPanelProps = {
  selected: FilterField
  value: FilterValue | undefined
  onChange: (filterId: string, value: FilterValue) => void
}

export const FilterEditorPanel = ({
  selected,
  value,
  onChange,
}: FilterEditorPanelProps) => (
  <div className="min-h-[8rem] w-[17.25rem] p-2">
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted">{selected.header}</p>
      <FilterControl
        filter={selected.filter}
        value={value}
        onChange={(next) => onChange(selected.id, next)}
      />
    </div>
  </div>
)
