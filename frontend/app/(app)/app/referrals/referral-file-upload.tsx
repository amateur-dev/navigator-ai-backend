"use client";

import { Alert, AlertDescription, AlertTitle, Button } from "@/components/ui";
import { useReferralUpload } from "@/hooks/use-referral-upload";
import { cn } from "@/utils/cn";
import { CheckCircle2, FileText, Loader2, Plus, X, XCircle } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { ReferralEmailNotification } from "./referral-email-notification";
import {
  type ExtractionFormData,
  ReferralExtractionForm,
} from "./referral-extraction-form";
import { ReferralSmsNotification } from "./referral-sms-notification";

interface UploadedFile {
  file: File;
  id: string;
}

export const ReferralFileUpload = () => {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(
    null
  );
  const [extractedData, setExtractedData] = React.useState<any>(null);

  const {
    uploadMutation,
    orchestrateMutation,
    confirmMutation,
    orchestrationData,
    resetAll,
  } = useReferralUpload();

  const handleFormSubmit = React.useCallback(
    (data: ExtractionFormData) => {
      if (!extractedData) {
        console.error("No extracted data available");
        return;
      }
      orchestrateMutation.mutate({ extractedData, formData: data });
    },
    [orchestrateMutation, extractedData]
  );

  // Set extracted data when upload succeeds
  React.useEffect(() => {
    if (uploadMutation.isSuccess && uploadMutation.data) {
      setExtractedData(uploadMutation.data.data);
    }
  }, [uploadMutation.isSuccess, uploadMutation.data]);

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
    setExtractedData(null);
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
        <div
          {...getRootProps({
            className: cn(
              "dropzone flex justify-center rounded-2xl corner-smooth border px-6 py-10 w-full bg-white bg-[radial-gradient(#f4f4f5_1px,transparent_1px)] bg-size-[12px_12px] items-center transition-all flex-1 hover:border-gray-300",
              {
                "border-primary bg-primary/5": isDragActive,
                "border-border": !isDragActive,
              }
            ),
          })}
        >
          <input {...getInputProps()} />
          <div className="text-center flex flex-col items-center gap-2">
            <FileText className="size-16 text-accent" strokeWidth={1} />
            <div className="mt-4 flex text-sm/6 text-gray-600">
              <span className="relative cursor-pointer bg-transparent font-medium text-default focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default hover:text-default/90 text-base">
                <span>Select a referral document</span>
                <input
                  id="file-upload"
                  type="file"
                  name="file-upload"
                  className="sr-only"
                />
              </span>
              <p className="pl-1 text-base text-default">or Drag and drop</p>
            </div>
            <p className="text-sm text-muted-foreground">PDF up to 10MB</p>
          </div>
        </div>
      )}

      {isUploading && uploadedFile && (
        <div className="flex flex-col items-center justify-center gap-4 py-10 flex-1">
          <Loader2
            className="size-12 animate-spin text-default"
            strokeWidth={1}
          />
          <div className="text-center">
            <p className="text-base font-medium text-default">
              Uploading {uploadedFile.file.name}...
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your file
            </p>
          </div>
        </div>
      )}

      {isExtractionSuccess && uploadedFile && uploadMutation.data && !isComplete && (
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex items-center gap-3 border rounded-xl corner-smooth bg-background p-4">
            <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-default">
                {uploadedFile.file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Extraction complete
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2 gap-1.5"
              onClick={removeFile}
              disabled={isOrchestrating}
            >
              <span>Upload New</span>
              <X className="size-3" strokeWidth={2} />
            </Button>
          </div>

          <ReferralExtractionForm
            extractedData={uploadMutation.data?.data || {}}
            onSubmit={handleFormSubmit}
            isSubmitting={isOrchestrating}
          />
        </div>
      )}

      {isComplete && confirmMutation.data && (
        <div className="flex flex-col gap-4 pb-6 w-full">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="text-green-500" />
            <div className="flex items-start justify-between gap-3 col-start-2">
              <div className="flex-1">
                <AlertTitle className="text-green-900">
                  Appointment Confirmed!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Confirmation sent successfully
                </AlertDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                onClick={removeFile}
              >
                <Plus className="size-4" strokeWidth={1.8} />
                New Referral
              </Button>
            </div>
          </Alert>

          <div className="flex flex-col gap-4 w-full">
            {confirmMutation.data?.appointmentDetails && (
              <div className="border rounded-xl corner-smooth bg-background p-6">
                <h3 className="text-base font-semibold text-default mb-4">
                  Appointment Details
                </h3>
                <div className="grid gap-1">
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">
                      Patient
                    </span>
                    <span className="text-sm font-medium text-default">
                      {confirmMutation.data.appointmentDetails.patient}
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">
                      Doctor
                    </span>
                    <span className="text-sm font-medium text-default">
                      {confirmMutation.data.appointmentDetails.doctor}
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">
                      Specialty
                    </span>
                    <span className="text-sm font-medium text-default">
                      {confirmMutation.data.appointmentDetails.specialty}
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">
                      Date & Time
                    </span>
                    <span className="text-sm font-medium text-default">
                      {confirmMutation.data.appointmentDetails.dateTime}
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">
                      Location
                    </span>
                    <span className="text-sm font-medium text-default">
                      {confirmMutation.data.appointmentDetails.location}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {confirmMutation.data?.notifications && (
              <div className="flex flex-col gap-4 lg:flex-row">
                {confirmMutation.data.notifications.sms && (
                  <ReferralSmsNotification
                    to={confirmMutation.data.notifications.sms.to}
                    message={confirmMutation.data.notifications.sms.message}
                  />
                )}

                {confirmMutation.data.notifications.email && (
                  <ReferralEmailNotification
                    to={confirmMutation.data.notifications.email.to}
                    subject={confirmMutation.data.notifications.email.subject}
                    body={confirmMutation.data.notifications.email.body}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {uploadMutation.isError && uploadedFile && (
        <div className="border rounded-xl corner-smooth bg-background p-4 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <XCircle className="size-5 text-red-500 flex-shrink-0" />
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {uploadedFile.file.name}
              </p>
              <p className="text-xs font-medium text-red-500">
                {uploadMutation.error?.message || "Upload failed"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3"
              onClick={retryUpload}
              disabled={isUploading}
            >
              Retry Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3"
              onClick={removeFile}
              disabled={isUploading}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
