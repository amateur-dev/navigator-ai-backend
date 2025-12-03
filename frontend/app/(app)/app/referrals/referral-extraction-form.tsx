"use client";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const extractionSchema = z.object({
  patientName: z
    .string()
    .min(2, "Patient name must be at least 2 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Patient name must contain only letters, spaces, hyphens, and apostrophes"
    ),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  patientPhoneNumber: z
    .string()
    .min(1, "Patient phone number is required")
    .regex(/^[\d\s\-\+\(\)]+$/, "Phone number must be a valid format"),
  patientEmail: z
    .string()
    .min(1, "Patient email is required")
    .email("Please enter a valid email address"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance provider must be at least 2 characters"),
  referralReason: z
    .string()
    .min(10, "Referral reason must be at least 10 characters"),
});

export type ExtractionFormData = z.infer<typeof extractionSchema>;

interface ReferralExtractionFormProps {
  extractedData: {
    patientName?: string;
    dateOfBirth?: string;
    patientPhoneNumber?: string;
    patientEmail?: string;
    referralReason?: string;
    insuranceProvider?: string;
  };
  onSubmit?: (data: ExtractionFormData) => void;
  isSubmitting?: boolean;
}

export const ReferralExtractionForm = ({
  extractedData,
  onSubmit,
  isSubmitting = false,
}: ReferralExtractionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExtractionFormData>({
    resolver: zodResolver(extractionSchema),
    defaultValues: {
      patientName: extractedData.patientName || "",
      dateOfBirth: extractedData.dateOfBirth || "",
      patientPhoneNumber: extractedData.patientPhoneNumber || "",
      patientEmail: extractedData.patientEmail || "",
      referralReason: extractedData.referralReason || "",
      insuranceProvider: extractedData.insuranceProvider || "",
    },
  });

  const handleFormSubmit = (data: ExtractionFormData) => {
    // Show success toast
    toast.success("Form validated successfully");
    onSubmit?.(data);
  };

  const handleFormError = () => {
    // Show error toast with all validation errors
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const errorMessages = errorFields
        .map((field) => {
          const error = errors[field as keyof typeof errors];
          return error?.message;
        })
        .filter(Boolean);

      toast.error("Validation failed", {
        description: errorMessages.join(", "),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
      className="flex flex-col gap-6 border rounded-xl corner-smooth bg-background p-6 h-full flex-1"
    >
      <div className="flex flex-col">
        <h3 className="text-base font-medium text-default">
          Review Extracted Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Please review and edit the extracted patient information before
          proceeding.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            placeholder="Enter patient name"
            {...register("patientName")}
            aria-invalid={!!errors.patientName}
          />
          {errors.patientName && (
            <p className="text-xs text-red-500">{errors.patientName.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            placeholder="YYYY-MM-DD"
            {...register("dateOfBirth")}
            aria-invalid={!!errors.dateOfBirth}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="patientPhoneNumber">Patient Phone Number</Label>
          <Input
            id="patientPhoneNumber"
            type="tel"
            placeholder="Enter patient phone number"
            {...register("patientPhoneNumber")}
            aria-invalid={!!errors.patientPhoneNumber}
            autoFocus
          />
          {errors.patientPhoneNumber && (
            <p className="text-xs text-red-500">
              {errors.patientPhoneNumber.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="patientEmail">Patient Email</Label>
          <Input
            id="patientEmail"
            type="email"
            placeholder="Enter patient email"
            {...register("patientEmail")}
            aria-invalid={!!errors.patientEmail}
          />
          {errors.patientEmail && (
            <p className="text-xs text-red-500">
              {errors.patientEmail.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
          <Input
            id="insuranceProvider"
            placeholder="Enter insurance provider"
            {...register("insuranceProvider")}
            aria-invalid={!!errors.insuranceProvider}
          />
          {errors.insuranceProvider && (
            <p className="text-xs text-red-500">
              {errors.insuranceProvider.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="referralReason">Referral Reason</Label>
          <Textarea
            id="referralReason"
            placeholder="Enter referral reason"
            rows={3}
            {...register("referralReason")}
            aria-invalid={!!errors.referralReason}
          />
          {errors.referralReason && (
            <p className="text-xs text-red-500">
              {errors.referralReason.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="h-12 px-5 min-w-[240px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue to Orchestration"}
        </Button>
      </div>
    </form>
  );
};
