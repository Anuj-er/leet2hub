import {
  DailyProblemI,
  UserStatsI,
  UserStreakI,
} from "@/types/leet2hub.interface.ts";

const BASE_URL =
  "https://leet2hub.vercel.app/api/v2";

/**
 * fetchDailyProblem - Fetch the daily problem from the Leet2Hub API
 * @returns The daily problem
 **/
export const fetchDailyProblem = async (): Promise<DailyProblemI> => {
  const response = await fetch(`${BASE_URL}/daily`);
  if (!response.ok) throw new Error("Failed to fetch the daily problem");

  const data = await response.json();
  return data.data;
};

/**
 * fetchUserStats - Fetch user stats from the Leet2Hub API
 * @param username - The username of the user to fetch stats for
 * @returns The user stats
 **/
export const fetchUserStats = async (username: string): Promise<UserStatsI> => {
  const response = await fetch(`${BASE_URL}/${username}`);
  if (response.status === 404) throw new Error("User not found");
  else if (!response.ok) throw new Error("Failed to fetch user stats");

  const data = await response.json();
  return data.data;
};

/**
 * fetchUserStreak - Fetch user streak from the Leet2Hub API
 * @param username - The username of the user to fetch streak for
 **/
export const fetchUserStreak = async (
  username: string,
): Promise<UserStreakI> => {
  const response = await fetch(`${BASE_URL}/userProfileCalendar/${username}`);
  if (!response.ok) throw new Error("Failed to fetch user streak");

  return await response.json();
};
