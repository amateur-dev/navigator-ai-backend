import { getReferrals } from '@/lib/actions/referrals'
import { useQuery } from '@tanstack/react-query'

export function useReferrals() {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: getReferrals,
    staleTime: 0
  })
}
