import { fetchDailyProblem } from "@/lib/leet2hub.api";
import { DailyProblemI } from "@/types/leet2hub.interface";
import { useQuery } from "@tanstack/react-query";

/**
 * useDailyProblem - Fetch the daily problem from the Leet2Hub API
 **/
export function useDailyProblem() {
  const { data, error, isLoading } = useQuery<DailyProblemI, Error>({
    queryKey: ["dailyProblem"],
    queryFn: fetchDailyProblem,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  return { data, error, isLoading };
}
