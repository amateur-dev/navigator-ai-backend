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
    // First upload to backend to get document ID
    const uploadResponse = await fetch(`${process.env.BACKEND_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      return {
        success: false,
        message: `Upload failed: ${uploadResponse.statusText}`,
      };
    }

    const uploadResult = await uploadResponse.json();
    if (!uploadResult.success) {
      return {
        success: false,
        message: uploadResult.error?.message || "Upload failed",
      };
    }

    const documentId = uploadResult.data.id;

    // Then extract data using backend endpoint
    const extractResponse = await fetch(`${process.env.BACKEND_BASE}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: documentId }),
    });

    if (!extractResponse.ok) {
      return {
        success: false,
        message: `Extraction failed: ${extractResponse.statusText}`,
      };
    }

    const extractResult = await extractResponse.json();
    if (!extractResult.success) {
      return {
        success: false,
        message: extractResult.error?.message || "Extraction failed",
      };
    }

    // Return combined result with documentId
    return {
      success: true,
      data: {
        ...extractResult.data,
        documentId,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export const orchestrate = async (extractedData: {
  patientFirstName: string;
  patientLastName: string;
  patientEmail?: string | null;
  patientPhoneNumber?: string | null;
  reason: string;
  payer: string;
  specialty?: string;
  documentId?: string;
}) => {
  try {
    const response = await fetch(`${process.env.BACKEND_BASE}/orchestrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referralData: extractedData,
        autoSchedule: true,
        sendNotifications: true
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Orchestration failed: ${response.statusText}`,
      };
    }

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

export const confirm = async (confirmData: {
  referralId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
}) => {
  try {
    const response = await fetch(`${process.env.BACKEND_BASE}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confirmData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Confirmation failed: ${response.statusText}`,
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Confirmation failed",
    };
  }
};
