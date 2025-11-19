'use server'

import { withAuth } from '@workos-inc/authkit-nextjs'
import { WorkOS } from '@workos-inc/node'
import { redirect } from 'next/navigation'
import { UserRole } from '@/types/auth'
import { hasRole } from './role-utils'
import { setUserRole } from './roles'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

/**
 * Server-side middleware to require specific roles for route access
 * Redirects to sign-in page if user is not authenticated or doesn't have required role
 * Fetches fresh user data from WorkOS to get the latest role
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const { user: sessionUser } = await withAuth({ ensureSignedIn: true })

  if (!sessionUser) {
    redirect('/auth/sign-in')
  }

  // Fetch fresh user data from WorkOS to get the latest metadata
  let user = sessionUser

  try {
    const freshUser = await workos.userManagement.getUser(sessionUser.id)
    user = freshUser
  } catch {
    // Continue with session user if fetch fails
  }

  // Check if user has a role, if not assign default "member" role
  const hasRoleInMetadata = user.metadata?.role !== undefined

  if (!hasRoleInMetadata) {
    try {
      await setUserRole(user.id, UserRole.MEMBER)
      user.metadata = { ...user.metadata, role: UserRole.MEMBER }
    } catch {
      // Failed to assign default role
    }
  }

  if (!hasRole(user, allowedRoles)) {
    redirect('/api/auth/login')
  }

  return user
}
