import { NextResponse } from 'next/server'
import { getReferrals } from '@/lib/actions/referrals'

export async function GET() {
  try {
    const response = await getReferrals()
    return NextResponse.json(response)
  } catch (_error) {
    return NextResponse.json(
      { referrals: [], total: 0, error: 'Failed to fetch referrals' },
      { status: 500 }
    )
  }
}
