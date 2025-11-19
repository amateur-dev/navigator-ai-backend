'use client'

import { Search } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { Input } from '@/components/ui'

export function ReferralsSearch() {
  const [searchValue, setSearchValue] = useQueryState('q', parseAsString.withDefault(''))

  return (
    <div className="relative w-70">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        strokeWidth={2}
      />
      <Input
        type="text"
        placeholder="Filter referrals"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-9 h-9"
      />
    </div>
  )
}
