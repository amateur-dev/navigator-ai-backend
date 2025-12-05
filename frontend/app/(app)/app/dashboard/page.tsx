'use client'

import { Skeleton } from '@/components/ui'
import { useMetrics } from '@/hooks/use-metrics'
import { MetricsOverview } from './metrics-overview'
import { ProviderStats } from './provider-stats'

function DashboardContent() {
  const { data: metrics, isLoading, error } = useMetrics()

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-destructive">Failed to load metrics</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  if (isLoading || !metrics?.data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i.toString()} className="h-[120px]" />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[250px]" />
          <Skeleton className="h-[250px]" />
        </div>
      </div>
    )
  }

  const { overview, providers } = metrics.data

  return (
    <div className="space-y-6">
      <MetricsOverview data={overview} />
      <ProviderStats data={providers} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden min-h-0">
      <div className="flex flex-col border-b border-border px-8 py-5 flex-shrink-0 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Overview of your referral management system
            </p>
          </div>
        </div>
      </div>

      <main className="flex flex-1 w-full flex-col overflow-y-auto min-h-0 bg-background p-8">
        <DashboardContent />
      </main>
    </div>
  )
}
