import type { User } from '@workos-inc/node'
import { isUserRole, UserRole } from '@/types/auth'

/**
 * Extracts the user role from WorkOS user metadata
 * Returns 'member' as default if no role is found
 */
export function getUserRole(user: User): UserRole {
  const role = user.metadata?.role

  if (isUserRole(role)) {
    return role
  }

  // Default to member if no valid role found
  return UserRole.MEMBER
}

/**
 * Checks if a user has one of the allowed roles
 */
export function hasRole(user: User, allowedRoles: UserRole[]): boolean {
  const userRole = getUserRole(user)
  return allowedRoles.includes(userRole)
}
