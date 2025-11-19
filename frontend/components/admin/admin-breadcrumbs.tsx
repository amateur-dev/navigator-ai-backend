'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export const AdminBreadcrumbs = () => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const isLast = index === segments.length - 1
    return { href, title: segment, isLast }
  })

  // Add ellipsis for long chains
  const items =
    breadcrumbs.length > 4
      ? [
          breadcrumbs[0],
          { href: '', title: '...', isLast: false, isEllipsis: true },
          ...breadcrumbs.slice(-2)
        ]
      : breadcrumbs

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={item.href || `ellipsis-${index}`} className="contents">
            <BreadcrumbItem>
              {'isEllipsis' in item ? (
                <BreadcrumbEllipsis />
              ) : item.isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
