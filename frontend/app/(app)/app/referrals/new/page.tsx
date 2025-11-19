// import { ReferralFilters } from './referral-filters'
// import { referralsColumns } from './referrals-columns'
// import { ReferralsSearch } from './referrals-search'
// import { ReferralsTable } from './referrals-table'

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden min-h-0">
      <div className="flex flex-col border-b border-border px-8 py-6 flex-shrink-0 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">Referrals</h1>
            <p className="text-muted-foreground text-sm">Manage and track patient referrals</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <ReferralsSearch /> */}
            {/* <ReferralFilters /> */}
          </div>
        </div>
      </div>

      <main className="flex flex-1 w-full flex-col overflow-hidden min-h-0 bg-background">
        {/* <ReferralsTable columns={referralsColumns} /> */}
      </main>
    </div>
  )
}
