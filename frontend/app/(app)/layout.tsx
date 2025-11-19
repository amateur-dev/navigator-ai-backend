import { AppHeader } from '@/components/app'
import { requireRole } from '@/lib/auth/middleware'
import { AppProvider } from '@/providers/app-provider'
import { UserRole } from '@/types/auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole([UserRole.MEMBER, UserRole.ADMIN, UserRole.EDITOR])

  return (
    <AppProvider>
      <main className="bg-secondary h-screen w-screen flex flex-col overflow-hidden p-4">
        <AppHeader />
        <div className="flex-1 overflow-hidden rounded-t-2xl corner-smooth border rounded-b-lg flex flex-col min-h-0 shadow-[0px_-50px_35px_-7px_rgba(0,_0,_0,_0.02)]">
          {children}
        </div>
      </main>
    </AppProvider>
  )
}
