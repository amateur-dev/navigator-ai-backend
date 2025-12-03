'use client'

import { Activity, Clock, TrendingUp, Users } from 'lucide-react'
import { Card } from '@/components/ui'

interface MetricsOverviewProps {
  data: {
    totalReferrals: number
    activeReferrals: number
    pendingReview: number
    averageProcessingTime: string
    successRate: number
  }
}

export const MetricsOverview = ({ data }: MetricsOverviewProps) => {
  const metrics = [
    {
      title: 'Total Referrals',
      value: data.totalReferrals ?? 0,
      icon: Users,
      description: 'All time'
    },
    {
      title: 'Active Referrals',
      value: data.activeReferrals ?? 0,
      icon: Activity,
      description: 'Currently in progress'
    },
    {
      title: 'Pending Review',
      value: data.pendingReview ?? 0,
      icon: Clock,
      description: 'Awaiting action'
    },
    {
      title: 'Success Rate',
      value: `${data.successRate ?? 0}%`,
      icon: TrendingUp,
      description: 'Completion rate'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
              <Icon className="size-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
