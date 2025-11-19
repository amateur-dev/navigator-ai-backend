'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '@workos-inc/node'
import { ArrowUpDown, Edit, MoreHorizontal } from 'lucide-react'
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
import type { UserData } from '@/lib/actions'
import { getInitials } from '@/utils/get-initials'
import { EditRoleDialog } from './edit-role-dialog'

// Extend TanStack Table's meta type to include currentUser
declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: <"User" is used in the table meta>
  interface TableMeta<TData> {
    currentUser?: User | null
  }
}

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-muted/50"
        >
          User
          <ArrowUpDown className="size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const email = row.getValue('email') as string
      const firstName = row.original.firstName
      const lastName = row.original.lastName
      const fullName = [firstName, lastName].filter(Boolean).join(' ')

      return (
        <div className="flex items-center gap-3 px-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(fullName || email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium">{fullName || 'N/A'}</div>
            <div className="text-muted-foreground text-sm">{email}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'emailVerified',
    header: 'Status',
    cell: ({ row }) => {
      const verified = row.getValue('emailVerified') as boolean
      return (
        <Badge variant={verified ? 'outline' : 'secondary'}>
          {verified ? 'Verified' : 'Unverified'}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row, table }) => {
      const role = row.getValue('role') as string

      const currentUserData = table
        .getRowModel()
        .rows.find((r) => r.original.email === table.options.meta?.currentUser?.email)

      const currentUserRole = currentUserData?.original.role

      const isCurrentUserRow =
        currentUserRole === 'admin' &&
        role === 'admin' &&
        currentUserData?.original.email === row.original.email

      if (isCurrentUserRow) {
        return (
          <Badge variant="outline" className="capitalize pl-0.5">
            <span className="text-[8px] font-bold bg-secondary text-secondary-foreground px-1 py-0.5 rounded-sm uppercase border border-border">
              You
            </span>
            <span>{role}</span>
          </Badge>
        )
      }

      return (
        <div className="flex items-center">
          <EditRoleDialog
            userId={row.original.id}
            currentRole={row.original.role}
            userName={`${row.original.firstName} ${row.original.lastName}`}
          >
            <Badge variant="outline" className="capitalize cursor-pointer">
              <span className="mr-1">{role}</span>
              <Edit className="!size-3" strokeWidth={2} />
            </Badge>
          </EditRoleDialog>
        </div>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-muted/50"
        >
          Joined
          <ArrowUpDown className="size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return (
        <div className="text-sm px-3">
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
]
