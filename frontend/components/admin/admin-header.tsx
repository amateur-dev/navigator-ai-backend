import { BellDot, Send, Settings } from 'lucide-react'
import { AdminSearch } from '@/components/admin'
import { Button, Logo, SidebarTrigger } from '@/components/ui'

export const AdminHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 border-b border-border justify-between w-full">
      <div className="flex items-center gap-3 px-3 w-full">
        <Logo className="shrink-0 block md:hidden" />
        <AdminSearch />
      </div>

      <div className="flex items-center px-3 gap-1">
        <Button variant="outline" size="sm">
          <Send className="size-4!" strokeWidth={1.8} />
          <span>Support Requests</span>
        </Button>
        <Button variant="outline" className="size-8">
          <BellDot className="size-4!" strokeWidth={1.8} />
        </Button>
        <Button variant="outline" className="size-8">
          <Settings className="size-4!" strokeWidth={1.8} />
        </Button>
      </div>

      <div className="flex items-center gap-2 px-3 md:hidden">
        <SidebarTrigger />
      </div>
    </header>
  )
}

AdminHeader.displayName = 'AdminHeader'
