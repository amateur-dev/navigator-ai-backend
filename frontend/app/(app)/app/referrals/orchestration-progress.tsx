'use client'

import {
  Calendar,
  CheckCircle2,
  Circle,
  FileCheck,
  Loader2,
  Search,
  Shield,
  Stethoscope,
  XCircle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ProgressStep, StepStatus } from '@/hooks/use-progress'
import { cn } from '@/utils/cn'

interface OrchestrationProgressProps {
  steps: ProgressStep[]
  isRunning: boolean
  onCancel: () => void
  className?: string
}

const getStatusIcon = (status: StepStatus) => {
  switch (status) {
    case 'running':
      return <Loader2 className="size-4 animate-spin" />
    case 'completed':
      return <CheckCircle2 className="size-4" />
    case 'failed':
      return <XCircle className="size-4 text-red-600" />
    default:
      return <Circle className="size-4 text-muted-foreground" />
  }
}

const getStatusBadge = (status: StepStatus) => {
  switch (status) {
    case 'running':
      return (
        <Badge variant="default" className="text-xs">
          <Loader2 className="size-3 animate-spin" />
          Processing
        </Badge>
      )
    case 'completed':
      return (
        <Badge variant="outline" className="text-xs">
          <CheckCircle2 className="size-3" />
          Success
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="destructive" className="text-xs">
          <XCircle className="size-3" />
          Failed
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="text-xs">
          <Circle className="size-3" />
          Pending
        </Badge>
      )
  }
}

const getStepIcon = (stepId: string) => {
  if (stepId.includes('validate')) return FileCheck
  if (stepId.includes('identify')) return Search
  if (stepId.includes('doctor')) return Stethoscope
  if (stepId.includes('insurance')) return Shield
  if (stepId.includes('appointment')) return Calendar
  return FileCheck
}

const ProgressStepItem = ({ step }: { step: ProgressStep }) => {
  const Icon = getStepIcon(step.id)

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <div className="shrink-0 mt-0.5">
          <div
            className={cn(
              'flex items-center justify-center size-7 rounded-full border border-border'
            )}
          >
            <Icon className={cn('size-3')} strokeWidth={2} />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                'text-sm',
                step.status === 'completed'
                  ? 'text-foreground'
                  : step.status === 'running'
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
            {getStatusBadge(step.status)}
          </div>

          {step.dynamicValue && (step.status === 'completed' || step.status === 'running') && (
            <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border">
              {step.dynamicValue}
            </div>
          )}
        </div>
      </div>

      {step.substeps && step.substeps.length > 0 && (
        <div className="ml-11 space-y-3 mt-1">
          {step.substeps.map((substep) => (
            <div key={substep.id} className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">{getStatusIcon(substep.status)}</div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'text-sm',
                      substep.status === 'completed'
                        ? 'text-foreground'
                        : substep.status === 'running'
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                    )}
                  >
                    {substep.label}
                  </span>
                  {getStatusBadge(substep.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const OrchestrationProgress = ({
  steps,
  isRunning,
  className
}: OrchestrationProgressProps) => {
  const completedSteps = steps.filter((s) => s.status === 'completed').length
  const runningSteps = steps.filter((s) => s.status === 'running').length
  const totalSteps = steps.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  // Check if any step is actually running (including substeps)
  const hasRunningSteps =
    isRunning ||
    runningSteps > 0 ||
    steps.some((step) => step.substeps?.some((substep) => substep.status === 'running'))

  return (
    <div
      className={cn(
        'flex flex-col h-full border border-border rounded-xl corner-smooth bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex items-center justify-center size-10 rounded-full border border-border">
            <Stethoscope className="size-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground">Orchestrating Referral</h3>
            <p className="text-sm text-muted-foreground leading-[1]">
              {hasRunningSteps
                ? `Processing step ${completedSteps + 1} of ${totalSteps}`
                : completedSteps === totalSteps
                  ? 'Complete'
                  : 'Ready'}
            </p>

            {hasRunningSteps && (
              <div className="mt-3">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-950 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          {steps.map((step) => (
            <ProgressStepItem key={step.id} step={step} />
          ))}
        </div>
      </div>
    </div>
  )
}
