import { useQuery } from '@tanstack/react-query'
import { getReferrals } from '@/lib/actions/referrals'

export function useReferrals() {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: getReferrals,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}
