"use client";

import { Card, Progress, Separator } from "@/components/ui";
import { Building2, Users } from "lucide-react";

interface ProviderStatsProps {
  data: {
    totalSpecialists: number;
    availableSpecialists: number;
    utilizationRate: number;
  };
}

export const ProviderStats = ({ data }: ProviderStatsProps) => {
  return (
    <Card className="p-6 gap-5">
      <div className="grid">
        <h3 className="text-base font-semibold">Provider Network</h3>
        <p className="text-sm text-muted-foreground">Specialist availability</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-3">
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Specialists</span>
            </div>
            <span className="text-sm font-medium">{data.totalSpecialists}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Available</span>
            </div>
            <span className="text-sm font-medium">
              {data.availableSpecialists}
            </span>
          </div>
          <Separator />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Utilization Rate</span>
            <span className="text-sm font-medium">{data.utilizationRate}%</span>
          </div>
          <Progress value={data.utilizationRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {data.utilizationRate >= 80
              ? "High utilization - Consider expanding network"
              : data.utilizationRate >= 60
              ? "Good utilization"
              : "Low utilization"}
          </p>
        </div>
      </div>
    </Card>
  );
};
