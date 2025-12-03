import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { confirm, orchestrate, uploadReferralFile } from '@/lib/actions/referrals'

interface ExtractionFormData {
  patientName: string
  dateOfBirth: string
  patientPhoneNumber: string
  patientEmail: string
  referralReason: string
  insuranceProvider: string
}

interface ExtractionResponse {
  success: boolean
  data?: {
    patientName?: string
    dateOfBirth?: string
    patientPhoneNumber?: string
    patientEmail?: string
    referralReason?: string
    insuranceProvider?: string
  }
  metadata?: {
    filename?: string
    fileSize?: number
    textLength?: number
    extractedAt?: string
  }
  message?: string
}

interface OrchestrationResponse {
  success: boolean
  data?: {
    specialist?: string
    assignedDoctor?: string
    availableSlots?: string[]
    referralId?: string
    insuranceStatus?: string
    patientEmail?: string
    patientPhoneNumber?: string
  }
  message?: string
}

interface ConfirmationResponse {
  success: boolean
  confirmationSent?: boolean
  referralId?: string
  notifications?: {
    sms?: {
      to: string
      message: string
      length: number
    }
    email?: {
      to: string
      subject: string
      body: string
    }
  }
  appointmentDetails?: {
    patient: string
    doctor: string
    specialty: string
    dateTime: string
    location: string
  }
  message?: string
}

export const useReferralUpload = () => {
  const queryClient = useQueryClient()
  const [orchestrationData, setOrchestrationData] = React.useState<OrchestrationResponse | null>(
    null
  )

  const uploadMutation = useMutation<ExtractionResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadReferralFile(formData)

      if (!result.success) {
        throw new Error(result.message || 'Upload failed')
      }

      return result as ExtractionResponse
    },
    onSuccess: (_data, file) => {
      toast.success(`${file.name} uploaded and extracted successfully`)
    },
    onError: (error: Error, file) => {
      toast.error(`Failed to upload ${file.name}: ${error.message}`)
    }
  })

  const confirmMutation = useMutation<
    ConfirmationResponse,
    Error,
    {
      orchestrationData: OrchestrationResponse
      patientData: ExtractionFormData
    }
  >({
    mutationFn: async ({ orchestrationData, patientData }) => {
      const doctorMatch = orchestrationData.data
      if (!doctorMatch) {
        throw new Error('No orchestration data available')
      }

      // Pick the first available slot or use a future date
      let appointmentDate: string
      let appointmentTime: string

      if (doctorMatch.availableSlots && doctorMatch.availableSlots.length > 0) {
        const dateObj = new Date(doctorMatch.availableSlots[0])
        appointmentDate = dateObj.toISOString().split('T')[0]
        appointmentTime = dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      } else {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        appointmentDate = tomorrow.toISOString().split('T')[0]
        appointmentTime = '10:00 AM'
      }

      const confirmPayload = {
        referralId: doctorMatch.referralId || '',
        patientName: patientData.patientName,
        patientEmail: patientData.patientEmail,
        patientPhone: patientData.patientPhoneNumber,
        doctorName: doctorMatch.assignedDoctor || '',
        specialty: doctorMatch.specialist || '',
        appointmentDate,
        appointmentTime
      }

      const result = await confirm(confirmPayload)

      if (!result.success) {
        throw new Error(result.message || 'Confirmation failed')
      }

      return result.data as ConfirmationResponse
    },
    onSuccess: () => {
      // Toast will be shown after orchestration progress completes
      // Refetch referrals table data
      queryClient.invalidateQueries({ queryKey: ['referrals'] })
    },
    onError: (error: Error) => {
      toast.error(`Confirmation failed: ${error.message}`)
    }
  })

  const orchestrateMutation = useMutation<OrchestrationResponse, Error, ExtractionFormData>({
    mutationFn: async (patientData: ExtractionFormData) => {
      const result = await orchestrate({
        patientName: patientData.patientName,
        referralReason: patientData.referralReason,
        insuranceProvider: patientData.insuranceProvider,
        patientEmail: patientData.patientEmail,
        patientPhoneNumber: patientData.patientPhoneNumber
      })

      if (!result.success) {
        throw new Error(result.message || 'Orchestration failed')
      }

      return result as OrchestrationResponse
    },
    onSuccess: (data, patientData) => {
      // Toast will be shown when progress step completes
      setOrchestrationData(data)

      // Automatically trigger confirmation
      confirmMutation.mutate({
        orchestrationData: data,
        patientData
      })
    },
    onError: (error: Error) => {
      toast.error(`Orchestration failed: ${error.message}`)
    }
  })

  const resetAll = React.useCallback(() => {
    setOrchestrationData(null)
    uploadMutation.reset()
    orchestrateMutation.reset()
    confirmMutation.reset()
  }, [uploadMutation, orchestrateMutation, confirmMutation])

  return {
    uploadMutation,
    orchestrateMutation,
    confirmMutation,
    orchestrationData,
    resetAll
  }
}
