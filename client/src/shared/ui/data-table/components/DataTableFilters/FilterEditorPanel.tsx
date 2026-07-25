import { FilterControl } from './FilterControl'
import type { FilterableColumnOption } from './filterUtils'
import type { DataTableFilterValue } from '../../types'

type FilterEditorPanelProps = {
  selected: FilterableColumnOption
  value: DataTableFilterValue | undefined
  onChange: (filterId: string, value: DataTableFilterValue) => void
}

export const FilterEditorPanel = ({
  selected,
  value,
  onChange,
}: FilterEditorPanelProps) => (
  <div className="min-h-[8rem] w-56 p-2">
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
