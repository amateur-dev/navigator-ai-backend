"use client";

import { useReferralUpload } from "@/hooks/use-referral-upload";
import React from "react";
import { useDropzone } from "react-dropzone";
import {
  ReferralConfirmation,
  ReferralDropzone,
  ReferralExtractionSuccess,
  ReferralUploadError,
  ReferralUploadLoading,
} from "./components";
import type { ExtractionFormData } from "./referral-extraction-form";

interface UploadedFile {
  file: File;
  id: string;
}

export const ReferralFileUpload = () => {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(
    null
  );

  const {
    uploadMutation,
    orchestrateMutation,
    confirmMutation,
    orchestrationData,
    resetAll,
  } = useReferralUpload();

  const handleFormSubmit = React.useCallback(
    (data: ExtractionFormData) => {
      orchestrateMutation.mutate(data);
    },
    [orchestrateMutation]
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const newFile: UploadedFile = {
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
      };

      setUploadedFile(newFile);
      uploadMutation.mutate(file);
    },
    [uploadMutation]
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
    resetAll();
  }, [resetAll]);

  const retryUpload = React.useCallback(() => {
    if (!uploadedFile) return;
    uploadMutation.mutate(uploadedFile.file);
  }, [uploadedFile, uploadMutation]);

  const isUploading = uploadMutation.isPending;
  const isExtractionSuccess = uploadMutation.isSuccess;
  const isOrchestrating =
    orchestrateMutation.isPending || confirmMutation.isPending;
  const isComplete = confirmMutation.isSuccess;
  const showDropzone = !uploadedFile || uploadMutation.isError;

  return (
    <div className="flex px-4 py-2 flex-1 flex-col gap-4 overflow-auto select-auto!">
      {showDropzone && (
        <ReferralDropzone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />
      )}

      {isUploading && uploadedFile && (
        <ReferralUploadLoading fileName={uploadedFile.file.name} />
      )}

      {isExtractionSuccess &&
        uploadedFile &&
        uploadMutation.data &&
        !isComplete && (
          <ReferralExtractionSuccess
            fileName={uploadedFile.file.name}
            extractedData={uploadMutation.data?.data || {}}
            onSubmit={handleFormSubmit}
            onRemove={removeFile}
            isSubmitting={isOrchestrating}
          />
        )}

      {isComplete && confirmMutation.data && (
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
  );
};
