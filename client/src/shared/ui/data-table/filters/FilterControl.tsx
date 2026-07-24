import type {
  DataTableColumnFilter,
  DataTableFilterType,
  DataTableFilterValue,
} from '../types'
import { BooleanFilter } from './BooleanFilter'
import { DateFilter } from './DateFilter'
import { DateRangeFilter } from './DateRangeFilter'
import { MultiSelectFilter } from './MultiSelectFilter'
import { SelectFilter } from './SelectFilter'

type FilterControlProps = {
  filter: DataTableColumnFilter
  value: DataTableFilterValue | undefined
  onChange: <F extends DataTableFilterType>(
    type: F,
    value: DataTableFilterValue<F>,
  ) => void
}

export const FilterControl = ({ filter, value, onChange }: FilterControlProps) => {
  switch (filter.type) {
    case 'select':
      return (
        <SelectFilter
          options={filter.options}
          value={(value as DataTableFilterValue<'select'>) ?? null}
          onChange={(next) => onChange('select', next)}
        />
      )
    case 'multiSelect':
      return (
        <MultiSelectFilter
          options={filter.options}
          value={(value as DataTableFilterValue<'multiSelect'>) ?? []}
          onChange={(next) => onChange('multiSelect', next)}
        />
      )
    case 'boolean':
      return (
        <BooleanFilter
          value={(value as DataTableFilterValue<'boolean'>) ?? null}
          onChange={(next) => onChange('boolean', next)}
        />
      )
    case 'date':
      return (
        <DateFilter
          value={(value as DataTableFilterValue<'date'>) ?? null}
          onChange={(next) => onChange('date', next)}
        />
      )
    case 'dateRange':
      return (
        <DateRangeFilter
          value={
            (value as DataTableFilterValue<'dateRange'>) ?? {
              from: null,
              to: null,
            }
          }
          onChange={(next) => onChange('dateRange', next)}
        />
      )
  }
}
