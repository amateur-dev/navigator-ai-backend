import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function Page() {
  const { user } = await withAuth({ ensureSignedIn: true })

  return (
    <div className="flex flex-1 flex-col gap-4 bg-muted-background p-5">
      <pre className="text-sm font-mono whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
