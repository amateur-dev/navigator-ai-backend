"use client";

import { Button } from "@/components/ui";
import { CheckCircle2, X } from "lucide-react";
import {
  type ExtractionFormData,
  ReferralExtractionForm,
} from "../referral-extraction-form";

interface ReferralExtractionSuccessProps {
  fileName: string;
  extractedData: Record<string, unknown>;
  onSubmit: (data: ExtractionFormData) => void;
  onRemove: () => void;
  isSubmitting: boolean;
}

export const ReferralExtractionSuccess = ({
  fileName,
  extractedData,
  onSubmit,
  onRemove,
  isSubmitting,
}: ReferralExtractionSuccessProps) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full flex-1">
      <div className="flex items-center gap-3 border rounded-xl corner-smooth bg-background p-4">
        <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-default">{fileName}</p>
          <p className="text-xs text-muted-foreground">Extraction complete</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-2 gap-1.5"
          onClick={onRemove}
          disabled={isSubmitting}
        >
          <span>Upload New</span>
          <X className="size-3" strokeWidth={2} />
        </Button>
      </div>

      <ReferralExtractionForm
        extractedData={extractedData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

