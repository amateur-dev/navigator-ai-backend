'use client'

import { AdminNavigation, AdminUser } from '@/components/admin'
import {
  Logo,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui'
import navigation from '@/data/admin/navigation.json'

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 w-full relative">
          <div className="flex items-center pl-2 gap-1 w-full">
            <Logo className="shrink-0 h-5 w-auto" />
          </div>
          <SidebarTrigger className="hide-on-sidebar-collapsed hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavigation items={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <AdminUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

AdminSidebar.displayName = 'AdminSidebar'
