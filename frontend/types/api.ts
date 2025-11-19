/**
 * API-related types for request/response handling
 */

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

/**
 * API error structure
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  statusCode?: number
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: HeadersInit
  body?: unknown
  cache?: RequestCache
  revalidate?: number | false
}

/**
 * Referral data structure
 */
export interface Referral {
  id: string
  patientFirstName: string
  patientLastName: string
  patientEmail: string
  specialty: string
  payer: string
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled'
  appointmentDate: string
  referralDate: string
  noShowRisk: number
}

/**
 * Referrals API response
 */
export interface ReferralsResponse {
  referrals: Referral[]
  total: number
}

/**
 * Step status for referral workflow
 */
export type StepStatus = 'completed' | 'current' | 'upcoming'

/**
 * Workflow step structure
 */
export interface WorkflowStep {
  id: string
  label: string
  status: StepStatus
  completedAt?: string
  description?: string
}

/**
 * Action log entry
 */
export interface ActionLogEntry {
  id: string
  event: string
  type: 'eligibility' | 'pa' | 'scheduling' | 'message' | 'system' | 'user'
  timestamp: string
  user?: string
  description: string
  details?: Record<string, unknown>
}

/**
 * Message structure
 */
export interface Message {
  id: string
  channel: 'SMS' | 'Email'
  content: string
  timestamp: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  direction: 'inbound' | 'outbound'
  recipient?: string
}

/**
 * Detailed referral data structure
 */
export interface ReferralDetails extends Referral {
  age: number
  urgency: 'routine' | 'urgent' | 'stat'
  plan: string
  steps: WorkflowStep[]
  actionLog: ActionLogEntry[]
  messages: Message[]
  providerName?: string
  facilityName?: string
  reason?: string
}

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    CALLBACK: '/callback'
  },
  REFERRALS: '/api/referrals'
} as const
