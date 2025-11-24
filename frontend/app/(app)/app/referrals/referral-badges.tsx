import type { StepStatus } from '@/types/api'

/**
 * Get badge variant for referral status
 */
export function getStatusColor(
  status: string
): 'default' | 'secondary' | 'success' | 'destructive' {
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

/**
 * Get badge variant for referral urgency
 */
export function getUrgencyColor(urgency: string): 'default' | 'secondary' | 'destructive' {
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

/**
 * Get step icon component based on status
 */
export function getStepIcon(status: StepStatus): React.ReactElement {
  if (status === 'completed') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-default border-2 border-default">
        <svg
          className="h-4 w-4 text-default-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
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
