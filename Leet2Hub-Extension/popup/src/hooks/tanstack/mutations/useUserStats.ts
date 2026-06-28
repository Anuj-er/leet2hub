import { fetchUserStats } from "@/lib/leet2hub.api";
import { UserStatsI } from "@/types/leet2hub.interface";
import { useQuery } from "@tanstack/react-query";

/**
 * useUserStats - Fetch user stats from the Leet2Hub API
 * @param username - The username of the user to fetch stats for
 **/
export function useUserStats(username: string) {
  const { data, error, isLoading } = useQuery<UserStatsI, Error>({
    queryKey: ["userStats", username],
    queryFn: () => fetchUserStats(username),
  });

  return { data, error, isLoading };
}
