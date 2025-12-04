import {
  confirm,
  orchestrate,
  uploadReferralFile,
} from "@/lib/actions/referrals";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

interface ExtractionFormData {
  patientName: string;
  dateOfBirth: string;
  referralReason: string;
  insuranceProvider: string;
}

interface ExtractionResponse {
  success: boolean;
  data?: {
    patientName?: string;
    dateOfBirth?: string;
    referralReason?: string;
    insuranceProvider?: string;
  };
  metadata?: {
    filename?: string;
    fileSize?: number;
    textLength?: number;
    extractedAt?: string;
  };
  message?: string;
}

interface OrchestrationResponse {
  success: boolean;
  data?: {
    specialist?: string;
    assignedDoctor?: string;
    availableSlots?: string[];
    referralId?: string;
    insuranceStatus?: string;
  };
  message?: string;
}

interface ConfirmationResponse {
  success: boolean;
  confirmationSent?: boolean;
  referralId?: string;
  notifications?: {
    sms?: {
      to: string;
      message: string;
      length: number;
    };
    email?: {
      to: string;
      subject: string;
      body: string;
    };
  };
  appointmentDetails?: {
    patient: string;
    doctor: string;
    specialty: string;
    dateTime: string;
    location: string;
  };
  message?: string;
}

export const useReferralUpload = () => {
  const [orchestrationData, setOrchestrationData] =
    React.useState<OrchestrationResponse | null>(null);

  const uploadMutation = useMutation<ExtractionResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadReferralFile(formData);

      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }

      return result as ExtractionResponse;
    },
    onSuccess: (data, file) => {
      toast.success(`${file.name} uploaded and extracted successfully`);
    },
    onError: (error: Error, file) => {
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    },
  });

  const confirmMutation = useMutation<
    ConfirmationResponse,
    Error,
    {
      orchestrationData: OrchestrationResponse;
      patientData: ExtractionFormData;
    }
  >({
    mutationFn: async ({ orchestrationData, patientData }) => {
      const doctorMatch = orchestrationData.data;
      if (!doctorMatch) {
        throw new Error("No orchestration data available");
      }

      // Pick the first available slot or use a future date
      let appointmentDate: string;
      let appointmentTime: string;

      if (
        doctorMatch.availableSlots &&
        doctorMatch.availableSlots.length > 0
      ) {
        const dateObj = new Date(doctorMatch.availableSlots[0]);
        appointmentDate = dateObj.toISOString().split("T")[0];
        appointmentTime = dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        appointmentDate = tomorrow.toISOString().split("T")[0];
        appointmentTime = "10:00 AM";
      }

      // Generate patient email and phone
      const patientEmail = `${patientData.patientName
        .toLowerCase()
        .replace(/\s+/g, ".")}@example.com`;
      const patientPhone = "+1-555-0100";

      const confirmPayload = {
        referralId: doctorMatch.referralId || "",
        patientName: patientData.patientName,
        patientEmail,
        patientPhone,
        doctorName: doctorMatch.assignedDoctor || "",
        specialty: doctorMatch.specialist || "",
        appointmentDate,
        appointmentTime,
      };

      const result = await confirm(confirmPayload);

      if (!result.success) {
        throw new Error(result.message || "Confirmation failed");
      }

      return result.data as ConfirmationResponse;
    },
    onSuccess: () => {
      toast.success("Appointment confirmed successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Confirmation failed: ${error.message}`);
    },
  });

  const orchestrateMutation = useMutation<
    OrchestrationResponse,
    Error,
    {
      extractedData: any;
      formData: ExtractionFormData;
    }
  >({
    mutationFn: async ({ extractedData, formData }) => {
      // Use extracted data for orchestration, but merge with any form overrides
      const orchestrationData = {
        patientFirstName: extractedData.patientFirstName || formData.patientName.split(' ')[0],
        patientLastName: extractedData.patientLastName || formData.patientName.split(' ').slice(1).join(' '),
        patientEmail: extractedData.patientEmail,
        patientPhoneNumber: extractedData.patientPhoneNumber,
        reason: formData.referralReason,
        payer: formData.insuranceProvider,
        specialty: extractedData.specialty,
        documentId: extractedData.documentId,
      };

      const result = await orchestrate(orchestrationData);

      if (!result.success) {
        throw new Error(result.message || "Orchestration failed");
      }

      return result as OrchestrationResponse;
    },
    onSuccess: (data, patientData) => {
      toast.success(
        `Referral successfully created and confirmed with ${data.data?.assignedDoctor || "specialist"}`
      );
      setOrchestrationData(data);
      // Orchestration already handles confirmation - no need for separate confirm step
    },
    onError: (error: Error) => {
      toast.error(`Orchestration failed: ${error.message}`);
    },
  });

  const resetAll = React.useCallback(() => {
    setOrchestrationData(null);
    uploadMutation.reset();
    orchestrateMutation.reset();
  }, [uploadMutation, orchestrateMutation]);

  return {
    uploadMutation,
    orchestrateMutation,
    orchestrationData,
    resetAll,
  };
};

