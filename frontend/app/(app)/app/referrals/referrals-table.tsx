'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState
} from '@tanstack/react-table'
import { parseAsArrayOf, parseAsString, useQueryState, useQueryStates } from 'nuqs'
import * as React from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'
import { useReferrals } from '@/hooks/use-referrals'
import type { Referral } from '@/types/api'
import { ReferralDetailsDrawer } from './referral-details-drawer'

interface ReferralsTableProps<TValue> {
  columns: ColumnDef<Referral, TValue>[]
}

export function ReferralsTable<TValue>({ columns }: ReferralsTableProps<TValue>) {
  const [searchValue] = useQueryState('q', parseAsString.withDefault(''))
  const [filters] = useQueryStates({
    specialty: parseAsArrayOf(parseAsString).withDefault([]),
    payer: parseAsArrayOf(parseAsString).withDefault([]),
    status: parseAsArrayOf(parseAsString).withDefault([]),
    dateRange: parseAsString.withDefault('allTime')
  })

  const [_action, setAction] = useQueryStates({
    action: parseAsString.withDefault(''),
    referralId: parseAsString.withDefault('none')
  })

  const { data, error, isPending } = useReferrals()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  // Sync searchValue with globalFilter state
  React.useEffect(() => {
    setGlobalFilter(searchValue ?? '')
  }, [searchValue])

  // Sync filters with columnFilters state
  React.useEffect(() => {
    const newFilters: ColumnFiltersState = []

    if (filters.specialty.length > 0) {
      newFilters.push({ id: 'specialty', value: filters.specialty })
    }

    if (filters.payer.length > 0) {
      newFilters.push({ id: 'payer', value: filters.payer })
    }

    if (filters.status.length > 0) {
      newFilters.push({ id: 'status', value: filters.status })
    }

    if (filters.dateRange !== 'allTime') {
      newFilters.push({ id: 'appointmentDate', value: filters.dateRange })
    }

    setColumnFilters(newFilters)
  }, [filters])

  const table = useReactTable({
    data: data?.referrals ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageSize: 20
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    }
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto relative">
        <Table className="relative table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b-0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="sticky top-0 z-20 bg-secondary/70 backdrop-blur-xl after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-background">
            {isPending ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="text-muted-foreground">Loading referrals...</div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="text-destructive">Error loading referrals: {error.message}</div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group"
                  onClick={() =>
                    setAction({
                      action: 'view-referral',
                      referralId: row.original.id
                    })
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: `${cell.column.getSize()}px` }}
                      className="last:pr-8 group-last-of-type:border-b"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No referrals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex-shrink-0 flex items-center bg-secondary justify-end py-3 px-8 border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            className="h-10"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <ReferralDetailsDrawer />
    </div>
  )
}
