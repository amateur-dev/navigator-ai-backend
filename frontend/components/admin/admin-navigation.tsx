'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui'
import { getIcon } from '@/utils/get-icon'

interface Item {
  title: string
  url: string
  icon?: string
  isActive?: boolean
  items?: Item[]
}

interface Items {
  items: Item[]
}

export function AdminNavigation({ items }: Items) {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = getIcon(item.icon ?? '')

          if (!item.items?.length || item.items.length === 0) {
            return (
              <SidebarMenuButton tooltip={item.title} key={item.title} asChild>
                <Link
                  href={item.url ?? '#'}
                  key={item.title}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <Icon className="shrink-0" strokeWidth={1.8} key={item.title} />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            )
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && Icon && <Icon className="shrink-0" strokeWidth={1.8} />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const SubIcon = getIcon(subItem.icon ?? '')
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url} onClick={isMobile ? toggleSidebar : undefined}>
                              <SubIcon className="shrink-0 !size-3.5" strokeWidth={2} />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

AdminNavigation.displayName = 'AdminNavigation'
