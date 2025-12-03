'use client'

import { CheckCircle2, Plus } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle, Button } from '@/components/ui'
import { ReferralEmailNotification } from '../referral-email-notification'
import { ReferralSmsNotification } from '../referral-sms-notification'

interface AppointmentDetails {
  patient: string
  doctor: string
  specialty: string
  dateTime: string
  location: string
}

interface NotificationDetails {
  sms?: {
    to: string
    message: string
  }
  email?: {
    to: string
    subject: string
    body: string
  }
}

interface ReferralConfirmationProps {
  appointmentDetails?: AppointmentDetails
  notifications?: NotificationDetails
  onNewReferral: () => void
}

export const ReferralConfirmation = ({
  appointmentDetails,
  notifications,
  onNewReferral
}: ReferralConfirmationProps) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full flex-1">
      <Alert className="border-green-500/50 bg-green-50">
        <CheckCircle2 className="size-4 text-green-600!" />
        <div className="flex items-center justify-between gap-3 col-start-2">
          <div className="flex-1">
            <AlertTitle>Appointment Confirmed!</AlertTitle>
            <AlertDescription>Confirmation sent successfully</AlertDescription>
          </div>
          <Button variant="outline" size="sm" className="h-9 px-3" onClick={onNewReferral}>
            <Plus className="size-4" strokeWidth={1.8} />
            New Referral
          </Button>
        </div>
      </Alert>

      <div className="flex flex-col gap-4 w-full h-full">
        {appointmentDetails && (
          <div className="border rounded-xl corner-smooth bg-background p-6">
            <h3 className="text-base font-semibold text-default mb-4">Appointment Details</h3>
            <div className="grid gap-1">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-muted-foreground">Patient</span>
                <span className="text-sm font-medium text-default">
                  {appointmentDetails.patient}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-muted-foreground">Doctor</span>
                <span className="text-sm font-medium text-default">
                  {appointmentDetails.doctor}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-muted-foreground">Specialty</span>
                <span className="text-sm font-medium text-default">
                  {appointmentDetails.specialty}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-muted-foreground">Date & Time</span>
                <span className="text-sm font-medium text-default">
                  {appointmentDetails.dateTime}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm font-medium text-default">
                  {appointmentDetails.location}
                </span>
              </div>
            </div>
          </div>
        )}

        {notifications && (
          <div className="flex flex-col gap-4 lg:flex-row h-full flex-1">
            {notifications.sms && (
              <ReferralSmsNotification
                to={notifications.sms.to}
                message={notifications.sms.message}
              />
            )}

            {notifications.email && (
              <ReferralEmailNotification
                to={notifications.email.to}
                subject={notifications.email.subject}
                body={notifications.email.body}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
