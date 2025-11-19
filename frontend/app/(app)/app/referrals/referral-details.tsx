'use client'

import { Check } from 'lucide-react'
import * as React from 'react'
import { Avatar, AvatarFallback, Badge, Button, ScrollArea, Separator } from '@/components/ui'
import type {
  ActionLogEntry,
  ReferralDetails as ReferralDetailsType,
  StepStatus
} from '@/types/api'
import { getInitials } from '@/utils/get-initials'

interface ReferralDetailsProps {
  data: ReferralDetailsType
  logFilter: string
  expandedLogId: string | null
  onLogFilterChange: (filter: string) => void
  onExpandedLogIdChange: (id: string | null) => void
}

export const ReferralDetails = ({
  data,
  logFilter,
  expandedLogId,
  onLogFilterChange,
  onExpandedLogIdChange
}: ReferralDetailsProps) => {
  const filteredActionLog = React.useMemo(() => {
    if (!data?.actionLog) return []
    if (logFilter === 'all') return data.actionLog
    return data.actionLog.filter((log) => log.type === logFilter)
  }, [data?.actionLog, logFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'default'
      case 'Pending':
        return 'secondary'
      case 'Completed':
        return 'success'
      case 'Cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'stat':
        return 'destructive'
      case 'urgent':
        return 'default'
      case 'routine':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStepIcon = (status: StepStatus) => {
    if (status === 'completed') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-default border-2 border-default">
          <Check className="h-4 w-4 text-default-foreground" />
        </div>
      )
    }
    if (status === 'current') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-default-foreground border-2 border-default">
          <div className="h-3 w-3 rounded-full bg-default animate-pulse" />
        </div>
      )
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
        <div className="h-2 w-2 rounded-full bg-gray-300" />
      </div>
    )
  }

  const getEventIcon = (type: ActionLogEntry['type']) => {
    const iconClass = 'h-4 w-4'
    switch (type) {
      case 'eligibility':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'pa':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )
      case 'scheduling':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )
      case 'message':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )
      case 'user':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )
      default:
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date)
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return formatDate(dateString)
  }

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
            <div className="text-sm text-muted-foreground">{data.patientEmail}</div>
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
              <Badge variant={getUrgencyColor(data.urgency)} className="text-xs pt-1 font-medium">
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
              <span className="font-medium text-right max-w-[60%]">{data.facilityName}</span>
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
              <span className="font-medium">{formatDate(data.referralDate)}</span>
            </div>
            {data.appointmentDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-foreground">Appointment</span>
                <span className="font-medium">{formatDate(data.appointmentDate)}</span>
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
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              <div className="relative z-10 mb-3">{getStepIcon(step.status)}</div>
              {index < data.steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-4 h-0.5 w-full ${
                    step.status === 'completed' ? 'bg-default' : 'bg-gray-200'
                  }`}
                />
              )}
              <div className="text-center">
                <div className="font-medium text-sm">{step.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{step.description}</div>
                {step.completedAt && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(step.completedAt)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 w-full overflow-hidden">
          <div className="flex gap-1 py-5 px-5 border-y flex-wrap bg-secondary">
            <Button
              variant={logFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLogFilterChange('all')}
              className="h-8 border"
            >
              All
            </Button>
            <Button
              variant={logFilter === 'eligibility' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLogFilterChange('eligibility')}
              className="h-8 border"
            >
              Eligibility
            </Button>
            <Button
              variant={logFilter === 'pa' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLogFilterChange('pa')}
              className="h-8 border"
            >
              PA
            </Button>
            <Button
              variant={logFilter === 'scheduling' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLogFilterChange('scheduling')}
              className="h-8 border"
            >
              Scheduling
            </Button>
            <Button
              variant={logFilter === 'message' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLogFilterChange('message')}
              className="h-8 border"
            >
              Messages
            </Button>
          </div>

          {/* Right Column - Action Log & Messages */}
          <div className="space-y-4 overflow-y-auto">
            <ScrollArea className="flex-1">
              <div className="space-y-1.5">
                {filteredActionLog.map((log) => (
                  <button
                    key={log.id}
                    type="button"
                    className="w-full text-left border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => onExpandedLogIdChange(expandedLogId === log.id ? null : log.id)}
                  >
                    <div className="flex gap-2">
                      <div className="text-muted-foreground mt-0.5">{getEventIcon(log.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-medium text-sm">{log.event}</div>
                          <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(log.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{log.description}</div>
                        {log.user && (
                          <div className="text-xs text-muted-foreground mt-1">
                            By <span className="font-medium text-foreground">{log.user}</span>
                          </div>
                        )}
                        {expandedLogId === log.id && log.details && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs space-y-1">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
