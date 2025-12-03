"use client";

import { type ProgressStep, useProgress } from "@/hooks/use-progress";
import { useReferralUpload } from "@/hooks/use-referral-upload";
import React from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  ReferralConfirmation,
  ReferralDropzone,
  ReferralExtractionSuccess,
  ReferralUploadError,
  ReferralUploadLoading,
} from "./components";
import { OrchestrationProgress } from "./orchestration-progress";
import { PDFUploadProgress } from "./pdf-upload-progress";
import type { ExtractionFormData } from "./referral-extraction-form";

interface UploadedFile {
  file: File;
  id: string;
}

const PDF_UPLOAD_STEPS: ProgressStep[] = [
  {
    id: "upload-pdf",
    label: "Uploading the PDF",
    status: "pending",
    delay: 1500,
  },
  {
    id: "validate-pdf",
    label: "Validating the PDF",
    status: "pending",
    delay: 2000,
  },
  {
    id: "return-confirmation",
    label: "Returning for user confirmation",
    status: "pending",
    delay: 1000,
  },
];

const createOrchestrationSteps = (
  specialist?: string,
  assignedDoctor?: string,
  insuranceStatus?: string
): ProgressStep[] => [
  {
    id: "validate-form",
    label: "Validating the form",
    status: "pending",
    delay: 1000,
  },
  {
    id: "identify-requirement",
    label: "Identifying the requirement",
    status: "pending",
    delay: 1500,
    substeps: [
      {
        id: "found-requirement",
        label: "Found requirement",
        status: "pending",
        delay: 1000,
        dynamicValue: specialist || "Analyzing specialization...",
      },
    ],
  },
  {
    id: "looking-doctors",
    label: "Looking for doctors",
    status: "pending",
    delay: 2000,
    substeps: [
      {
        id: "found-doctor",
        label: "Found doctor",
        status: "pending",
        delay: 1500,
        dynamicValue: assignedDoctor || "Searching database...",
      },
    ],
  },
  {
    id: "confirm-availability",
    label: "Confirming doctor availability",
    status: "pending",
    delay: 1500,
    substeps: [
      {
        id: "availability-confirmed",
        label: "Confirmed",
        status: "pending",
        delay: 1000,
      },
    ],
  },
  {
    id: "insurance-provider",
    label: "Checking insurance provider",
    status: "pending",
    delay: 2000,
    substeps: [
      {
        id: "pre-authorization",
        label: "Getting pre authorization",
        status: "pending",
        delay: 1500,
      },
      {
        id: "authorized",
        label: insuranceStatus || "Authorized",
        status: "pending",
        delay: 1000,
        dynamicValue: insuranceStatus
          ? `Status: ${insuranceStatus}`
          : undefined,
      },
    ],
  },
  {
    id: "confirming-appointment",
    label: "Confirming appointment",
    status: "pending",
    delay: 1500,
  },
  {
    id: "confirmed",
    label: "Confirmed",
    status: "pending",
    delay: 1000,
  },
];

export const ReferralFlowWithProgress = () => {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(
    null
  );
  const [showUploadProgress, setShowUploadProgress] = React.useState(false);
  const [showOrchestrationProgress, setShowOrchestrationProgress] =
    React.useState(false);
  const [uploadProgressComplete, setUploadProgressComplete] =
    React.useState(false);
  const [orchestrationProgressComplete, setOrchestrationProgressComplete] =
    React.useState(false);
  const toastShownRef = React.useRef(false);

  const {
    uploadMutation,
    orchestrateMutation,
    confirmMutation,
    orchestrationData,
    resetAll,
  } = useReferralUpload();

  // PDF Upload Progress
  const uploadProgress = useProgress({
    initialSteps: PDF_UPLOAD_STEPS,
    onComplete: () => {
      // Mark upload progress as complete
      setUploadProgressComplete(true);
      // Hide upload progress after a short delay
      // setTimeout(() => {
      //   setShowUploadProgress(false);
      // }, 500);
    },
    onCancel: () => {
      setShowUploadProgress(false);
      setUploadProgressComplete(false);
      removeFile();
    },
  });

  // Orchestration Progress - initialized with empty steps
  const [orchestrationSteps, setOrchestrationSteps] = React.useState<
    ProgressStep[]
  >(createOrchestrationSteps());

  const orchestrationProgress = useProgress({
    initialSteps: orchestrationSteps,
    onComplete: () => {
      // Mark orchestration progress as complete
      setOrchestrationProgressComplete(true);
      // Hide orchestration progress after a short delay
      // setTimeout(() => {
      //   setShowOrchestrationProgress(false);
      // }, 500);
    },
    onCancel: () => {
      setShowOrchestrationProgress(false);
      setOrchestrationProgressComplete(false);
    },
  });

  // Track toasts to prevent duplicates
  const doctorMatchedToastShownRef = React.useRef(false);

  // Show "Matched with doctor" toast when the "found-doctor" step completes
  React.useEffect(() => {
    // Use steps from the progress hook, not the state variable
    const foundDoctorStep = orchestrationProgress.steps
      .find((step) => step.id === "looking-doctors")
      ?.substeps?.find((substep) => substep.id === "found-doctor");

    if (
      foundDoctorStep?.status === "completed" &&
      !doctorMatchedToastShownRef.current
    ) {
      // Use dynamicValue from step or fallback to orchestrationData
      const doctorName =
        foundDoctorStep.dynamicValue ||
        orchestrationData?.data?.assignedDoctor ||
        "specialist";

      // Only show if we have a valid doctor name (not placeholder)
      if (doctorName && !doctorName.includes("Searching")) {
        toast.success(`Matched with ${doctorName}`);
        doctorMatchedToastShownRef.current = true;
      }
    }
  }, [orchestrationProgress.steps, orchestrationData]);

  // Show appointment confirmed toast only after orchestration progress completes
  React.useEffect(() => {
    if (
      orchestrationProgressComplete &&
      confirmMutation.isSuccess &&
      confirmMutation.data &&
      !toastShownRef.current
    ) {
      toast.success("Appointment confirmed successfully!");
      toastShownRef.current = true;
    }
  }, [orchestrationProgressComplete, confirmMutation.isSuccess, confirmMutation.data]);

  // Handle file upload
  const handleFileUpload = React.useCallback(
    async (file: File) => {
      const newFile: UploadedFile = {
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
      };

      setUploadedFile(newFile);
      setShowUploadProgress(true);
      uploadProgress.reset();

      // Start the progress animation
      uploadProgress.start();

      // Trigger the actual upload
      try {
        await uploadMutation.mutateAsync(file);
      } catch (error) {
        setShowUploadProgress(false);
        uploadProgress.reset();
        toast.error(error instanceof Error ? error.message : "Upload failed");
      }
    },
    [uploadMutation, uploadProgress]
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      handleFileUpload(acceptedFiles[0]);
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const removeFile = React.useCallback(() => {
    setUploadedFile(null);
    setShowUploadProgress(false);
    setShowOrchestrationProgress(false);
    setUploadProgressComplete(false);
    setOrchestrationProgressComplete(false);
    setOrchestrationSteps(createOrchestrationSteps());
    toastShownRef.current = false;
    doctorMatchedToastShownRef.current = false;
    uploadProgress.reset();
    orchestrationProgress.reset();
    resetAll();
  }, [resetAll, uploadProgress, orchestrationProgress]);

  const retryUpload = React.useCallback(() => {
    if (!uploadedFile) return;
    handleFileUpload(uploadedFile.file);
  }, [uploadedFile, handleFileUpload]);

  const handleFormSubmit = React.useCallback(
    async (data: ExtractionFormData) => {
      setShowOrchestrationProgress(true);

      // Trigger the actual orchestration to get real data FIRST
      try {
        const result = await orchestrateMutation.mutateAsync(data);

        // Create steps with real data from API
        const stepsWithRealData = createOrchestrationSteps(
          result.data?.specialist,
          result.data?.assignedDoctor,
          result.data?.insuranceStatus
        );
        setOrchestrationSteps(stepsWithRealData);

        // Start the progress animation with real data
        setTimeout(() => {
          orchestrationProgress.start();
        }, 100);
      } catch (error) {
        setShowOrchestrationProgress(false);
        orchestrationProgress.reset();
        toast.error(
          error instanceof Error ? error.message : "Orchestration failed"
        );
      }
    },
    [orchestrateMutation, orchestrationProgress]
  );

  const isUploading = uploadMutation.isPending;
  const isExtractionSuccess = uploadMutation.isSuccess;
  const isOrchestrating =
    orchestrateMutation.isPending || confirmMutation.isPending;
  const isComplete = confirmMutation.isSuccess;
  const showDropzone = !uploadedFile || uploadMutation.isError;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto px-4">
        {showDropzone && (
          <ReferralDropzone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
          />
        )}

        {showUploadProgress &&
          !uploadProgressComplete &&
          uploadedFile &&
          showUploadProgress && (
            <ReferralUploadLoading fileName={uploadedFile.file.name} />
          )}

        {/* Show loading during orchestration instead of form */}
        {showOrchestrationProgress &&
          !orchestrationProgressComplete &&
          uploadedFile && (
            <ReferralUploadLoading
              message="Orchestrating referral..."
              subMessage="Finding doctors, checking availability, and processing insurance"
            />
          )}

        {/* Show form only after upload progress completes and orchestration hasn't started */}
        {isExtractionSuccess &&
          uploadedFile &&
          uploadMutation.data &&
          !isComplete &&
          uploadProgressComplete &&
          !showOrchestrationProgress && (
            <ReferralExtractionSuccess
              fileName={uploadedFile.file.name}
              extractedData={uploadMutation.data?.data || {}}
              onSubmit={handleFormSubmit}
              onRemove={removeFile}
              isSubmitting={isOrchestrating}
            />
          )}

        {isComplete &&
          confirmMutation.data &&
          orchestrationProgressComplete && (
            <ReferralConfirmation
              appointmentDetails={confirmMutation.data?.appointmentDetails}
              notifications={confirmMutation.data?.notifications}
              onNewReferral={removeFile}
            />
          )}

        {uploadMutation.isError && uploadedFile && (
          <ReferralUploadError
            fileName={uploadedFile.file.name}
            errorMessage={uploadMutation.error?.message || "Upload failed"}
            onRetry={retryUpload}
            onRemove={removeFile}
            isUploading={isUploading}
          />
        )}
      </div>

      {/* Progress Sidebars */}
      {showUploadProgress && !showOrchestrationProgress && (
        <div className="w-[440px] h-full overflow-hidden">
          <PDFUploadProgress
            steps={uploadProgress.steps}
            isRunning={uploadProgress.isRunning}
            onCancel={uploadProgress.cancel}
          />
        </div>
      )}

      {showOrchestrationProgress && (
        <div className="w-[440px] h-full overflow-hidden">
          <OrchestrationProgress
            steps={orchestrationProgress.steps}
            isRunning={orchestrationProgress.isRunning}
            onCancel={orchestrationProgress.cancel}
          />
        </div>
      )}
    </div>
  );
};
