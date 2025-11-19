import { AdminPageHeader, AdminSubHeader } from '@/components/admin'
import { columns } from './columns'
import { CreateUserDialog } from './create-user-dialog'
import { UsersTable } from './users-table'

export default async function Page() {
  return (
    <div className="flex flex-col">
      <AdminSubHeader />
      <div className="flex items-center justify-between bg-background px-5 py-3 border-b border-border">
        <AdminPageHeader title="Users" description={`Manage and view all registered users`} />
        <CreateUserDialog />
      </div>

      <main className="space-y-4 p-5">
        <UsersTable columns={columns} />
      </main>
    </div>
  )
}
