import { renderCell } from './cells/renderCell'
import { DataTableRowActions } from './DataTableRowActions'
import { tableCellInnerClassName } from './styles'
import type {
  DataTableColumn,
  DataTableSort,
  RowAction,
} from './types'

type DataTableTableProps<T extends Record<string, unknown>> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  sorting?: DataTableSort
  onSortingChange?: (next: DataTableSort) => void
  rowActions?: RowAction<T>[]
  isLoading?: boolean
  emptyMessage?: string
  /** Used for skeleton rows when loading with no data yet */
  skeletonRowCount?: number
}

const SortIndicator = ({
  active,
  desc,
}: {
  active: boolean
  desc: boolean
}) => {
  if (!active) {
    return <span className="text-muted opacity-40">↕</span>
  }
  return <span aria-hidden="true">{desc ? '↓' : '↑'}</span>
}

const nextSort = (
  current: DataTableSort,
  columnId: string,
): DataTableSort => {
  if (!current || current.id !== columnId) {
    return { id: columnId, desc: false }
  }
  if (!current.desc) {
    return { id: columnId, desc: true }
  }
  return null
}

const SkeletonCell = ({ className }: { className?: string }) => (
  <td className="px-3 py-2 align-middle">
    <div className={tableCellInnerClassName}>
      <div
        className={`h-4 animate-pulse rounded bg-chrome ${className ?? 'w-full'}`}
      />
    </div>
  </td>
)

export const DataTableTable = <T extends Record<string, unknown>>({
  columns,
  rows,
  getRowId,
  sorting,
  onSortingChange,
  rowActions,
  isLoading,
  emptyMessage = 'No results',
  skeletonRowCount = 10,
}: DataTableTableProps<T>) => {
  const showActions = Boolean(rowActions && rowActions.length > 0)
  const colSpan = columns.length + (showActions ? 1 : 0)
  const showSkeletons = Boolean(isLoading)

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-chrome/60 text-muted">
          <tr>
            {columns.map((column) => {
              const isSorted = sorting?.id === column.id
              const sortable = Boolean(column.sortable && onSortingChange)
              return (
                <th
                  key={column.id}
                  scope="col"
                  className="border-b border-border px-3 py-2 font-medium"
                >
                  {sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-foreground"
                      onClick={() =>
                        onSortingChange?.(nextSort(sorting ?? null, column.id))
                      }
                    >
                      {column.header}
                      <SortIndicator
                        active={Boolean(isSorted)}
                        desc={Boolean(sorting?.desc)}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
            {showActions ? (
              <th
                scope="col"
                className="border-b border-border px-3 py-2 font-medium"
              >
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {showSkeletons
            ? Array.from(
                { length: skeletonRowCount },
                (_, index) => (
                  <tr
                    key={`skeleton-${index}`}
                    className="border-b border-border last:border-b-0"
                  >
                    {columns.map((column) => (
                      <SkeletonCell key={column.id} />
                    ))}
                    {showActions ? <SkeletonCell className="w-20" /> : null}
                  </tr>
                ),
              )
            : null}

          {!showSkeletons && rows.length === 0 ? (
            <tr>
              <td
                colSpan={colSpan}
                className="px-3 py-8 text-center text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : null}

          {!showSkeletons &&
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                className="border-b border-border last:border-b-0 hover:bg-chrome/40"
              >
                {columns.map((column) => (
                  <td key={column.id} className="px-3 py-2 align-middle">
                    <div className={tableCellInnerClassName}>
                      {renderCell(column.cell, row)}
                    </div>
                  </td>
                ))}
                {showActions && rowActions ? (
                  <td className="px-3 py-2 align-middle">
                    <div className={tableCellInnerClassName}>
                      <DataTableRowActions row={row} actions={rowActions} />
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
