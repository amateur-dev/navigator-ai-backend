'use client'

import { signOut } from '@workos-inc/authkit-nextjs'
import { useAuth } from '@workos-inc/authkit-nextjs/components'
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Skeleton,
  useSidebar
} from '@/components/ui'
import { getInitials } from '@/utils/get-initials'

export function AdminUser() {
  const { isMobile } = useSidebar()
  const { user, loading } = useAuth()
  const initials = getInitials(user?.firstName || user?.email || '')

  const handleSignOut = async () => {
    await signOut()
  }

  // Now do conditional rendering without early returns
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {loading ? (
          <Skeleton className="size-8 rounded-md" />
        ) : !user ? null : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pl-0"
              >
                <Avatar className="size-8 rounded-md">
                  <AvatarImage
                    src={user.profilePictureUrl || ''}
                    alt={user.firstName || user.email}
                  />
                  <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.firstName || user.email}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-md">
                    <AvatarImage
                      src={user.profilePictureUrl || ''}
                      alt={user.firstName || user.email}
                    />
                    <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.firstName || user.email}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

AdminUser.displayName = 'AdminUser'
