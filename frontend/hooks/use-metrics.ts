import { getMetrics } from "@/lib/actions/metrics";
import { useQuery } from "@tanstack/react-query";

export const useMetrics = () => {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const data = await getMetrics();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

