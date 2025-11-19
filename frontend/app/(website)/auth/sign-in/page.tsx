import { getSignInUrl } from '@workos-inc/authkit-nextjs'
import { RedirectClient } from './redirect-client'

export const dynamic = 'force-dynamic'

export default async function SignInPage() {
  const signInUrl = await getSignInUrl()
  return <RedirectClient url={signInUrl} />
}
