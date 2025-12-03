'use client'

import { CheckCircle2, Circle, Loader2, Upload, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProgressStep, StepStatus } from '@/hooks/use-progress'
import { cn } from '@/utils/cn'

interface PDFUploadProgressProps {
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

const ProgressStepItem = ({ step }: { step: ProgressStep }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="shrink-0">{getStatusIcon(step.status)}</div>
        <div className="flex-1 flex items-center justify-between gap-2">
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
      </div>

      {step.substeps && step.substeps.length > 0 && (
        <div className="ml-7 pl-4 border-l-2 border-muted space-y-2 mt-1">
          {step.substeps.map((substep) => (
            <div key={substep.id} className="flex items-center gap-3">
              <div className="shrink-0">{getStatusIcon(substep.status)}</div>
              <div className="flex-1 flex items-center justify-between gap-2">
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
          ))}
        </div>
      )}
    </div>
  )
}

export const PDFUploadProgress = ({
  steps,
  isRunning,
  onCancel,
  className
}: PDFUploadProgressProps) => {
  return (
    <div
      className={cn(
        'flex flex-col h-full border border-border rounded-xl corner-smooth bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center size-10 rounded-full border border-border">
            <Upload className="size-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Processing PDF</h3>
            <p className="text-sm text-muted-foreground leading-[1]">
              {isRunning ? 'Please wait...' : 'Ready'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {steps.map((step) => (
            <ProgressStepItem key={step.id} step={step} />
          ))}
        </div>
      </div>

      {isRunning && (
        <div className="p-4 border-t bg-muted/50">
          <Button variant="outline" className="w-full" onClick={onCancel} type="button">
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
