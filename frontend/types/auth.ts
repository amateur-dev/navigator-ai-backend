import type { User } from '@workos-inc/node'

/**
 * WorkOS User type re-export for convenience
 */
export type AuthUser = User

/**
 * Authentication session data
 */
export interface AuthSession {
  user: AuthUser
  isAuthenticated: boolean
}

/**
 * User role types for authorization
 */
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  MEMBER = 'member'
}

/**
 * User with role information
 */
export interface UserWithRole extends User {
  role: UserRole
}

/**
 * Type guard to check if a value is a valid UserRole
 */
export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && Object.values(UserRole).includes(value as UserRole)
}

/**
 * Type guard to check if user has one of the allowed roles
 */
export function hasRequiredRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole)
}

/**
 * Authentication state for client components
 */
export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: Error | null
}
