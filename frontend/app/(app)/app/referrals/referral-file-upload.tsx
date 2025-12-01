"use client";

import { Button, Skeleton } from "@/components/ui";
import { uploadReferralFile } from "@/lib/actions/referrals";
import { cn } from "@/utils/cn";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, FileText, Loader2, X, XCircle } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  type ExtractionFormData,
  ReferralExtractionForm,
} from "./referral-extraction-form";

interface UploadedFile {
  file: File;
  id: string;
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

export const ReferralFileUpload = () => {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(
    null
  );

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

  const handleFormSubmit = React.useCallback((data: ExtractionFormData) => {
    console.log("Form submitted:", data);
    toast.info("Orchestration will be implemented next");
    // TODO: Implement orchestration submission
  }, []);

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
    uploadMutation.reset();
  }, [uploadMutation]);

  const retryUpload = React.useCallback(() => {
    if (!uploadedFile) return;
    uploadMutation.mutate(uploadedFile.file);
  }, [uploadedFile, uploadMutation]);

  const isUploading = uploadMutation.isPending;
  const isSuccess = uploadMutation.isSuccess;
  const showDropzone = !uploadedFile || uploadMutation.isError;

  return (
    <div className="flex px-4 py-2 flex-1 flex-col gap-4">
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

      {isSuccess && uploadedFile && uploadMutation.data && (
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
            >
              <span>Upload New</span>
              <X className="size-3" strokeWidth={2} />
            </Button>
          </div>

          <ReferralExtractionForm
            extractedData={uploadMutation.data?.data || {}}
            onSubmit={handleFormSubmit}
            isSubmitting={false}
          />
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
