/**
 * Database-related types
 *
 * When you add Prisma models, you can extend these types or
 * import directly from '@prisma/client' for generated types
 */

/**
 * Generic database response wrapper
 */
export interface DbResponse<T> {
  data: T | null
  error: Error | null
  success: boolean
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
