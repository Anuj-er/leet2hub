import { fetchUserStreak } from "@/lib/leet2hub.api";
import { UserStreakI } from "@/types/leet2hub.interface";
import { useQuery } from "@tanstack/react-query";

/**
 * useUserStreak - Fetch user streak from the Leet2Hub API
 * @param username - The username of the user to fetch streak for
 **/
export function useUserStreak(username: string) {
  const { data, error, isLoading } = useQuery<UserStreakI, Error>({
    queryKey: ["userStreak", username],
    queryFn: () => fetchUserStreak(username),
  });

  return { data, error, isLoading };
}
