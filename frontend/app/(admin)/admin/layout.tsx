import type * as React from 'react'
import { AdminHeader, AdminSidebar } from '@/components/admin'
import { SidebarInset, SidebarProvider } from '@/components/ui'
import { requireRole } from '@/lib/auth/middleware'
import { AppProvider } from '@/providers/app-provider'
import { UserRole } from '@/types/auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole([UserRole.ADMIN, UserRole.EDITOR])
  return (
    <AppProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <div className="flex flex-1 flex-col gap-4 bg-muted-background">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
