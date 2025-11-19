import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function Page() {
  const { user } = await withAuth({ ensureSignedIn: true })

  return (
    <div className="flex flex-col w-full flex-1">
      <div className="flex flex-col border-b border-border px-8 py-5 flex-shrink-0 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Welcome back, {user?.firstName}! Here's a quick overview of your activity.
            </p>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      <div className="flex bg-background p-8 items-center justify-center text-center flex-1">
        <span className="text-5xl font-medium opacity-10">Dashboard Metrics</span>
      </div>
    </div>
  )
}
