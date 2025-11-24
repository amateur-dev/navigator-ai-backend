"use client";

import { Badge, Button, ScrollArea } from "@/components/ui";
import { getReferralLogs } from "@/lib/actions/referrals";
import { formatRelativeTime } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { getEventIcon } from "./referral-icons";

interface ReferralLogsProps {
  referralId: string;
}

export const ReferralLogs = ({ referralId }: ReferralLogsProps) => {
  const [logFilter, setLogFilter] = React.useState<string>("all");

  const { data: logsData, isPending } = useQuery({
    queryKey: ["referral-logs", referralId],
    queryFn: async () => {
      const data = await getReferralLogs(referralId);
      return data;
    },
  });

  const filteredActionLog = React.useMemo(() => {
    if (!logsData?.logs) return [];
    if (logFilter === "all") return logsData.logs;
    return logsData.logs.filter((log) => log.type === logFilter);
  }, [logsData?.logs, logFilter]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading activity logs...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 w-full overflow-hidden">
      <div className="flex gap-1 p-3 border rounded-xl corner-smooth flex-wrap bg-secondary">
        <Button
          variant={logFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setLogFilter("all")}
          className="h-8 border"
        >
          All
        </Button>
        <Button
          variant={logFilter === "eligibility" ? "default" : "outline"}
          size="sm"
          onClick={() => setLogFilter("eligibility")}
          className="h-8 border"
        >
          Eligibility
        </Button>
        <Button
          variant={logFilter === "pa" ? "default" : "outline"}
          size="sm"
          onClick={() => setLogFilter("pa")}
          className="h-8 border"
        >
          PA
        </Button>
        <Button
          variant={logFilter === "scheduling" ? "default" : "outline"}
          size="sm"
          onClick={() => setLogFilter("scheduling")}
          className="h-8 border"
        >
          Scheduling
        </Button>
        <Button
          variant={logFilter === "message" ? "default" : "outline"}
          size="sm"
          onClick={() => setLogFilter("message")}
          className="h-8 border"
        >
          Messages
        </Button>
      </div>

      {/* Action Log */}
      <div className="space-y-4 overflow-y-auto">
        <ScrollArea className="flex-1">
          <div className="space-y-1.5">
            {filteredActionLog.map((log) => (
              <div
                key={log.id}
                className="w-full text-left border rounded-xl corner-smooth p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex gap-2">
                  <div className="text-muted-foreground mt-0.5">
                    {getEventIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <div className="font-medium text-sm">{log.event}</div>
                        {log.user && (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground bg-background"
                          >
                            By{" "}
                            <span className="font-medium text-foreground">
                              {log.user}
                            </span>
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(log.timestamp)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {log.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
