import { NextResponse } from 'next/server'
import { getReferralDetails } from '@/lib/actions/referrals'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const referralDetails = await getReferralDetails(id)

    if (!referralDetails) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 })
    }

    return NextResponse.json(referralDetails)
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch referral details' }, { status: 500 })
  }
}
