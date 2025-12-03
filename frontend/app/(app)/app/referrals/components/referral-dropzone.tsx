"use client";

import { cn } from "@/utils/cn";
import { FileText } from "lucide-react";
import type { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";

interface ReferralDropzoneProps {
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  isDragActive: boolean;
}

export const ReferralDropzone = ({
  getRootProps,
  getInputProps,
  isDragActive,
}: ReferralDropzoneProps) => {
  return (
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
  );
};

