import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/actions/users'

export async function GET() {
  try {
    const response = await getUsers()
    return NextResponse.json(response)
  } catch (_error) {
    return NextResponse.json(
      { users: [], total: 0, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
