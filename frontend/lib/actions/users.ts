'use server'

import { WorkOS } from '@workos-inc/node'
import type { UserRole } from '@/types/auth'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

export interface UserData {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  role: string
}

export interface UsersResponse {
  users: UserData[]
  total: number
}

export interface CreateUserInput {
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface CreateUserResult {
  success: boolean
  error?: string
  user?: UserData
}

export interface UpdateUserRoleResult {
  success: boolean
  error?: string
}

export async function getUsers(): Promise<UsersResponse> {
  try {
    // Fetch users from WorkOS
    const { data: users } = await workos.userManagement.listUsers({
      limit: 100, // Adjust as needed
      order: 'desc'
    })

    const userData: UserData[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: (user.metadata?.role as string) || 'member'
    }))

    return {
      users: userData,
      total: userData.length
    }
  } catch {
    return {
      users: [],
      total: 0
    }
  }
}

export async function createUser(input: CreateUserInput): Promise<CreateUserResult> {
  try {
    const user = await workos.userManagement.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      password: input.password,
      emailVerified: false,
      metadata: {
        role: 'member'
      }
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: 'member'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    }
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<UpdateUserRoleResult> {
  try {
    await workos.userManagement.updateUser({
      userId,
      metadata: {
        role
      }
    })

    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user role'
    }
  }
}
