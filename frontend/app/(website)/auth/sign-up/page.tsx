import { getSignUpUrl } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'

export default async function SignUpPage() {
  // Redirect to WorkOS hosted sign-up page
  const signUpUrl = await getSignUpUrl()
  redirect(signUpUrl)
}
