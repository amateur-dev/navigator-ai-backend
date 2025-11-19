'use server'

import { WorkOS } from '@workos-inc/node'
import type { UserRole } from '@/types/auth'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

/**
 * Updates a user's role in WorkOS user metadata (Server Action)
 */
export async function setUserRole(userId: string, role: UserRole): Promise<void> {
  await workos.userManagement.updateUser({
    userId,
    metadata: {
      role
    }
  })
}
