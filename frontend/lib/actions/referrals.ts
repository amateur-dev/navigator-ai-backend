"use server";

import referralDetailsData from "@/data/app/referral-details.json";
import type { Referral, ReferralDetails, ReferralLogsResponse, ReferralsResponse } from "@/types/api";

export type ReferralData = Referral;

export async function getReferrals(): Promise<ReferralsResponse> {
  try {
    const response = await fetch(`${process.env.BACKEND_BASE}/referrals`);
    const data = await response.json();
    return data?.data as ReferralsResponse;
  } catch {
    return {
      referrals: [],
      total: 0,
    };
  }
}

export async function getReferralDetails(
  id: string
): Promise<ReferralDetails | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_BASE}/referral/${id}`);
    const data = await response.json();

    console.log(data);

    return data?.data as ReferralDetails | null;
  } catch {
    return null;
  }
}

export async function getReferralLogs(id: string): Promise<ReferralLogsResponse | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_BASE}/referral/${id}/logs`);
    const data = await response.json();
    return data?.data as ReferralLogsResponse | null;
  } catch {
    return null;
  }
}
