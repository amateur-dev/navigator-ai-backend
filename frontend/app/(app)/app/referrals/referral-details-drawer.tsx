'use client'

import { useQuery } from '@tanstack/react-query'
import { parseAsString, useQueryStates } from 'nuqs'
import * as React from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui'
import { getReferralDetails } from '@/lib/actions/referrals'
import { ReferralDetails } from './referral-details'

export const ReferralDetailsDrawer = ({ referralId }: { referralId?: string }) => {
  const [action, setAction] = useQueryStates({
    action: parseAsString.withDefault(''),
    referralId: parseAsString.withDefault(referralId ?? '')
  })

  const [logFilter, setLogFilter] = React.useState<string>('all')
  const [expandedLogId, setExpandedLogId] = React.useState<string | null>(null)

  const {
    data: referralData,
    isPending,
    error
  } = useQuery({
    queryKey: ['referral', action.referralId],
    queryFn: async () => {
      if (!action.referralId) {
        return null
      }
      const data = await getReferralDetails(action.referralId)
      if (!data) {
        throw new Error('Referral not found')
      }
      return data
    },
    enabled: action.action === 'view-referral' && !!action.referralId
  })

  return (
    <Drawer
      open={action.action === 'view-referral'}
      onOpenChange={(open) =>
        setAction({ action: open ? 'view-referral' : null, referralId: null })
      }
    >
      <DrawerContent className="h-screen px-10 pb-6">
        <DrawerHeader className="items-start gap-0!">
          <DrawerTitle>Referral Details {referralData ? `#${referralData.id}` : ''}</DrawerTitle>
          <DrawerDescription>
            View comprehensive referral information and activity
          </DrawerDescription>
        </DrawerHeader>

        {isPending && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading referral details...</div>
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-destructive">
              Error: {error instanceof Error ? error.message : 'Failed to load referral'}
            </div>
          </div>
        )}

        {referralData && (
          <ReferralDetails
            data={referralData}
            logFilter={logFilter}
            expandedLogId={expandedLogId}
            onLogFilterChange={setLogFilter}
            onExpandedLogIdChange={setExpandedLogId}
          />
        )}
      </DrawerContent>
    </Drawer>
  )
}
