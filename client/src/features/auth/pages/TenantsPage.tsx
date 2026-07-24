import { useMemo, useState } from 'react'
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterValue,
  type DataTableSearchState,
  type DataTableSort,
  type RowAction,
} from '../../../shared/ui/data-table'
import { primaryButtonClassName } from '../../../shared/ui/data-table/styles'

type TenantRow = {
  id: string
  name: string
  slug: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
}

const DUMMY_TENANTS: TenantRow[] = [
  {
    id: 't-1',
    name: 'Acme Corp',
    slug: 'acme',
    status: 'ACTIVE',
    createdAt: '2025-11-02T10:15:00Z',
  },
  {
    id: 't-2',
    name: 'Globex Industries',
    slug: 'globex',
    status: 'ACTIVE',
    createdAt: '2025-12-18T14:30:00Z',
  },
  {
    id: 't-3',
    name: 'Initech',
    slug: 'initech',
    status: 'INACTIVE',
    createdAt: '2026-01-08T09:00:00Z',
  },
  {
    id: 't-4',
    name: 'Umbrella Health',
    slug: 'umbrella',
    status: 'ACTIVE',
    createdAt: '2026-02-21T16:45:00Z',
  },
  {
    id: 't-5',
    name: 'Stark Dynamics',
    slug: 'stark',
    status: 'INACTIVE',
    createdAt: '2026-03-03T11:20:00Z',
  },
  {
    id: 't-6',
    name: 'Wayne Enterprises',
    slug: 'wayne',
    status: 'ACTIVE',
    createdAt: '2026-04-12T08:10:00Z',
  },
  {
    id: 't-7',
    name: 'Soylent Systems',
    slug: 'soylent',
    status: 'ACTIVE',
    createdAt: '2026-05-01T13:55:00Z',
  },
  {
    id: 't-8',
    name: 'Hooli',
    slug: 'hooli',
    status: 'INACTIVE',
    createdAt: '2026-06-14T19:05:00Z',
  },
  {
    id: 't-9',
    name: 'Pied Piper',
    slug: 'pied-piper',
    status: 'ACTIVE',
    createdAt: '2026-07-01T07:40:00Z',
  },
  {
    id: 't-10',
    name: 'Massive Dynamic',
    slug: 'massive',
    status: 'ACTIVE',
    createdAt: '2026-07-20T12:00:00Z',
  },
  {
    id: 't-11',
    name: 'Cyberdyne',
    slug: 'cyberdyne',
    status: 'INACTIVE',
    createdAt: '2024-09-09T15:25:00Z',
  },
  {
    id: 't-12',
    name: 'Aperture Labs',
    slug: 'aperture',
    status: 'ACTIVE',
    createdAt: '2025-08-28T18:00:00Z',
  },
]

const columns: DataTableColumn<TenantRow>[] = [
  {
    id: 'name',
    header: 'Name',
    searchable: true,
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.name },
  },
  {
    id: 'slug',
    header: 'Slug',
    searchable: true,
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.slug },
  },
  {
    id: 'status',
    header: 'Status',
    sortable: true,
    filter: {
      type: 'select',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
      ],
    },
    cell: {
      type: 'badge',
      getValue: (row) => row.status,
      labels: { ACTIVE: 'Active', INACTIVE: 'Inactive' },
      variants: { ACTIVE: 'success', INACTIVE: 'muted' },
    },
  },
  {
    id: 'createdAt',
    header: 'Created',
    sortable: true,
    filter: { type: 'dateRange' },
    cell: { type: 'datetime', getValue: (row) => row.createdAt },
  },
]

const applySearch = (
  rows: TenantRow[],
  search: DataTableSearchState | undefined,
): TenantRow[] => {
  if (!search?.value.trim()) {
    return rows
  }
  const q = search.value.trim().toLowerCase()
  return rows.filter((row) => {
    const field = search.columnId === 'slug' ? row.slug : row.name
    return field.toLowerCase().includes(q)
  })
}

const applyFilters = (
  rows: TenantRow[],
  filters: Record<string, DataTableFilterValue>,
): TenantRow[] => {
  let next = rows

  const status = filters.status as DataTableFilterValue<'select'> | undefined
  if (status) {
    next = next.filter((row) => row.status === status)
  }

  const createdAt = filters.createdAt as
    | DataTableFilterValue<'dateRange'>
    | undefined
  if (createdAt?.from || createdAt?.to) {
    next = next.filter((row) => {
      const day = row.createdAt.slice(0, 10)
      if (createdAt.from && day < createdAt.from) {
        return false
      }
      if (createdAt.to && day > createdAt.to) {
        return false
      }
      return true
    })
  }

  return next
}

const applySort = (rows: TenantRow[], sorting: DataTableSort): TenantRow[] => {
  if (!sorting) {
    return rows
  }

  const sorted = [...rows]
  const dir = sorting.desc ? -1 : 1

  sorted.sort((a, b) => {
    const left = a[sorting.id as keyof TenantRow]
    const right = b[sorting.id as keyof TenantRow]
    if (left === right) {
      return 0
    }
    return left > right ? dir : -dir
  })

  return sorted
}

export const TenantsPage = () => {
  const [search, setSearch] = useState<DataTableSearchState>({
    columnId: 'name',
    value: '',
  })
  const [filters, setFilters] = useState<Record<string, DataTableFilterValue>>(
    {},
  )
  const [sorting, setSorting] = useState<DataTableSort>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  const processed = useMemo(() => {
    const searched = applySearch(DUMMY_TENANTS, search)
    const filtered = applyFilters(searched, filters)
    return applySort(filtered, sorting)
  }, [search, filters, sorting])

  const pageCount = Math.max(1, Math.ceil(processed.length / pageSize))
  const safePageIndex = Math.min(pageIndex, pageCount - 1)
  const pageRows = processed.slice(
    safePageIndex * pageSize,
    safePageIndex * pageSize + pageSize,
  )

  const rowActions: RowAction<TenantRow>[] = [
    {
      id: 'view',
      label: 'View',
      onClick: (row) => {
        console.info('View tenant', row.id)
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      onClick: (row) => {
        console.info('Edit tenant', row.id)
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      variant: 'danger',
      hidden: (row) => row.status === 'INACTIVE',
      onClick: (row) => {
        console.info('Deactivate tenant', row.id)
      },
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl rounded-xl border border-border bg-surface p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-sm text-muted">
          Manage tenants across the Sentinel platform.
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        getRowId={(row) => row.id}
        search={search}
        onSearchChange={(next) => {
          setSearch(next)
          setPageIndex(0)
        }}
        filters={filters}
        onFiltersChange={(next) => {
          setFilters(next)
          setPageIndex(0)
        }}
        onFiltersClear={() => {
          setFilters({})
          setPageIndex(0)
        }}
        sorting={sorting}
        onSortingChange={(next) => {
          setSorting(next)
          setPageIndex(0)
        }}
        pagination={{
          pageIndex: safePageIndex,
          pageSize,
          pageCount,
          totalElements: processed.length,
          onPageIndexChange: setPageIndex,
          onPageSizeChange: (size) => {
            setPageSize(size)
            setPageIndex(0)
          },
        }}
        rowActions={rowActions}
        toolbarActions={
          <button
            type="button"
            className={primaryButtonClassName}
            onClick={() => console.info('Create tenant')}
          >
            Create tenant
          </button>
        }
        emptyMessage="No tenants match your filters"
      />
    </div>
  )
}
