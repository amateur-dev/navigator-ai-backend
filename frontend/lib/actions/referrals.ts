"use server";

import type {
  Referral,
  ReferralDetails,
  ReferralLogsResponse,
  ReferralsResponse,
} from "@/types/api";

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
    return data?.data as ReferralDetails | null;
  } catch {
    return null;
  }
}

export async function getReferralLogs(
  id: string
): Promise<ReferralLogsResponse | null> {
  try {
    const response = await fetch(
      `${process.env.BACKEND_BASE}/referral/${id}/logs`
    );
    const data = await response.json();
    return data?.data as ReferralLogsResponse | null;
  } catch {
    return null;
  }
}

export async function uploadReferralFile(
  formData: FormData
): Promise<{ success: boolean; message?: string; data?: unknown }> {
  try {
    const response = await fetch("http://139.180.220.93:3001/extract", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Upload failed: ${response.statusText}`,
      };
    }

    const result = await response.json();

    console.log(result);
    

    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export const orchestrate = async (patientData: {
  patientName: string;
  referralReason: string;
  insuranceProvider: string;
}) => {
  try {
    const response = await fetch(`${process.env.BACKEND_BASE}/orchestrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });
    const result = await response.json();
    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Orchestration failed",
    };
  }
};
