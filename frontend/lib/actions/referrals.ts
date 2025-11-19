'use server'

import referralDetailsData from '@/data/app/referral-details.json'
import referralsData from '@/data/app/referrals.json'
import type { Referral, ReferralDetails, ReferralsResponse } from '@/types/api'

export type ReferralData = Referral

export async function getReferrals(): Promise<ReferralsResponse> {
  try {
    // In a real application, this would fetch from a database
    // For now, we're using the static JSON data
    const referrals = referralsData as Referral[]

    return {
      referrals,
      total: referrals.length
    }
  } catch {
    return {
      referrals: [],
      total: 0
    }
  }
}

export async function getReferralDetails(id: string): Promise<ReferralDetails | null> {
  try {
    // In a real application, this would fetch from a database
    // For now, we're using the static JSON data
    const details = referralDetailsData as ReferralDetails[]
    const referral = details.find((r) => r.id === id)

    return referral || null
  } catch {
    return null
  }
}
