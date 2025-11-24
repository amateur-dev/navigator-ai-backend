"use client";

import { Avatar, AvatarFallback, Badge, Separator } from "@/components/ui";
import type { ReferralDetails as ReferralDetailsType } from "@/types/api";
import {
  formatDate,
  getInitials,
  getStatusColor,
  getStepIcon,
  getUrgencyColor,
} from "@/utils";
import * as React from "react";
import { ReferralLogs } from "./referral-logs";

interface ReferralDetailsProps {
  data: ReferralDetailsType;
}

export const ReferralDetails = ({ data }: ReferralDetailsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-5 w-full flex-1 overflow-hidden px-4">
      <div className="border overflow-y-auto p-8 rounded-2xl corner-smooth flex flex-col gap-6 bg-background">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border">
            <AvatarFallback className="bg-background">
              {getInitials(`${data.patientFirstName} ${data.patientLastName}`)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <div className="font-medium text-base">
                {data.patientFirstName} {data.patientLastName}
              </div>

              <Badge variant="outline">{data.age} years old</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {data.patientEmail}
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 w-full text-sm">
            <div className="flex justify-between">
              <span className="text-secondary-foreground">Referral ID</span>
              <span className="font-medium">{data.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-foreground">Specialty</span>
              <Badge variant="outline">{data.specialty}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-foreground">Urgency</span>
              <Badge
                variant={getUrgencyColor(data.urgency)}
                className="text-xs pt-1 font-medium"
              >
                {data.urgency.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-foreground">Status</span>
              <Badge variant={getStatusColor(data.status)}>{data.status}</Badge>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1 w-full text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary-foreground">Provider</span>
              <span className="font-medium">{data.providerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-foreground">Facility</span>
              <span className="font-medium text-right max-w-[60%]">
                {data.facilityName}
              </span>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1 w-full text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary-foreground">Payer</span>
              <span className="font-medium">{data.payer}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-foreground">Plan</span>
              <span className="font-medium">{data.plan}</span>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1 w-full text-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-secondary-foreground">Created</span>
              <span className="font-medium">
                {formatDate(data.referralDate)}
              </span>
            </div>
            {data.appointmentDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-foreground">Appointment</span>
                <span className="font-medium">
                  {formatDate(data.appointmentDate)}
                </span>
              </div>
            )}
          </div>
          <Separator />
          {data.reason && (
            <div className="flex flex-col gap-1 w-full text-sm">
              <span className="text-secondary-foreground">Reason</span>
              <span className="font-medium">{data.reason}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full border overflow-y-auto p-8 rounded-2xl corner-smooth flex flex-col bg-background">
        <div className="flex items-start gap-0 relative pt-2 pb-9">
          {data.steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1 relative"
            >
              <div className="relative z-10 mb-3">
                {getStepIcon(step.status)}
              </div>
              {index < data.steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-4 h-0.5 w-full ${
                    step.status === "completed" ? "bg-default" : "bg-gray-200"
                  }`}
                />
              )}
              <div className="text-center">
                <div className="font-medium text-sm">{step.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </div>
                {step.completedAt && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(step.completedAt)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <React.Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                Loading activity logs...
              </div>
            </div>
          }
        >
          <ReferralLogs referralId={data.id} />
        </React.Suspense>
      </div>
    </div>
  );
};
