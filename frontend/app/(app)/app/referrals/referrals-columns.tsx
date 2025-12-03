'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit, Eye, MoreHorizontal, XCircle } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui'
import type { Referral } from '@/types/api'
import { getInitials } from '@/utils/get-initials'

// Helper function to get status badge variant
function getStatusVariant(
  status: Referral['status']
): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'Scheduled':
      return 'secondary'
    case 'Pending':
      return 'outline'
    case 'Cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

export const referralsColumns: ColumnDef<Referral>[] = [
  {
    accessorKey: 'patientFirstName',
    id: 'patient',
    size: 240,
    minSize: 200,
    maxSize: 300,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-muted/50"
        >
          Patient
          <ArrowUpDown className="size-3" strokeWidth={2} />
        </Button>
      )
    },
    cell: ({ row }) => {
      const firstName = row.original.patientFirstName
      const lastName = row.original.patientLastName
      const email = row.original.patientEmail
      const fullName = `${firstName} ${lastName}`

      return (
        <div className="flex items-center gap-3 px-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-default/10 text-default text-xs">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium">{fullName}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </div>
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const nameA = `${rowA.original.patientFirstName} ${rowA.original.patientLastName}`
      const nameB = `${rowB.original.patientFirstName} ${rowB.original.patientLastName}`
      return nameA.localeCompare(nameB)
    }
  },
  {
    accessorKey: 'specialty',
    header: 'Specialty',
    size: 180,
    minSize: 150,
    maxSize: 220,
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue('specialty')}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: 'payer',
    header: 'Payer',
    size: 200,
    minSize: 180,
    maxSize: 250,
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue('payer')}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: 'appointmentDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-muted/50"
        >
          Appointment
          <ArrowUpDown className="size-3" strokeWidth={2} />
        </Button>
      )
    },
    size: 180,
    minSize: 160,
    maxSize: 200,
    cell: ({ row }) => {
      const appointmentDateValue = row.getValue('appointmentDate')
      if (appointmentDateValue === null || appointmentDateValue === undefined || appointmentDateValue === '') {
        return <div className="text-sm px-3 text-muted-foreground">Not scheduled</div>
      }
      const date = new Date(appointmentDateValue as string)
      if (isNaN(date.getTime())) {
        return <div className="text-sm px-3 text-muted-foreground">Not scheduled</div>
      }
      return (
        <div className="text-sm px-3">
          <div className="font-medium">
            {date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-muted-foreground text-xs">
            {date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const appointmentDateValue = row.getValue(id)
      if (appointmentDateValue === null || appointmentDateValue === undefined || appointmentDateValue === '') {
        return false
      }
      const appointmentDate = new Date(appointmentDateValue as string)
      if (isNaN(appointmentDate.getTime())) {
        return false
      }
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      switch (value) {
        case 'today': {
          const dateToCheck = new Date(appointmentDate)
          dateToCheck.setHours(0, 0, 0, 0)
          return dateToCheck.getTime() === today.getTime()
        }
        case 'thisWeek': {
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          weekEnd.setHours(23, 59, 59, 999)
          return appointmentDate >= weekStart && appointmentDate <= weekEnd
        }
        case 'thisMonth': {
          return (
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
          )
        }
        case 'last30Days': {
          const thirtyDaysAgo = new Date(today)
          thirtyDaysAgo.setDate(today.getDate() - 30)
          return appointmentDate >= thirtyDaysAgo
        }
        default:
          return true
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 140,
    minSize: 120,
    maxSize: 160,
    cell: ({ row }) => {
      const status = row.getValue('status') as Referral['status']
      return <Badge variant={getStatusVariant(status)}>{status}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    id: 'actions',
    size: 80,
    minSize: 80,
    maxSize: 80,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              Copy referral ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="size-4 mr-2" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="size-4 mr-2" />
              Edit referral
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <XCircle className="size-4 mr-2" />
              Cancel referral
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
]
