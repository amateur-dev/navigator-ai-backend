"use client";

import { Loader2 } from "lucide-react";

interface ReferralUploadLoadingProps {
  fileName: string;
}

export const ReferralUploadLoading = ({
  fileName,
}: ReferralUploadLoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 flex-1 border border-border rounded-xl corner-smooth bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Loader2 className="size-12 animate-spin text-default" strokeWidth={1} />
      <div className="text-center">
        <p className="text-base font-medium text-default">
          Uploading {fileName}...
        </p>
        <p className="text-sm text-muted-foreground">
          Please wait while we process your file
        </p>
      </div>
    </div>
  );
};

