import { AdminBreadcrumbs } from '@/components/admin'

export const AdminSubHeader = () => (
  <div className="flex px-3 py-2 border-b border-border bg-background">
    <AdminBreadcrumbs />
  </div>
)

AdminSubHeader.displayName = 'AdminSubHeader'
