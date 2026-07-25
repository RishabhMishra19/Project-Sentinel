import type {
  DataTableColumnFilter,
  DataTableFilterValue,
} from '../../types'
import {
  BooleanFilter,
  DateFilter,
  DateRangeFilter,
  MultiSelectFilter,
  SelectFilter,
} from './controls'

type FilterControlProps = {
  filter: DataTableColumnFilter
  value: DataTableFilterValue | undefined
  onChange: (value: DataTableFilterValue) => void
}

export const FilterControl = ({
  filter,
  value,
  onChange,
}: FilterControlProps) => {
  switch (filter.type) {
    case 'select':
      return (
        <SelectFilter
          options={filter.options}
          value={(value as DataTableFilterValue<'select'>) ?? null}
          onChange={onChange}
        />
      )
    case 'multiSelect':
      return (
        <MultiSelectFilter
          options={filter.options}
          value={(value as DataTableFilterValue<'multiSelect'>) ?? []}
          onChange={onChange}
        />
      )
    case 'boolean':
      return (
        <BooleanFilter
          value={(value as DataTableFilterValue<'boolean'>) ?? null}
          onChange={onChange}
        />
      )
    case 'date':
      return (
        <DateFilter
          value={(value as DataTableFilterValue<'date'>) ?? null}
          onChange={onChange}
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
          onChange={onChange}
        />
      )
  }
}
