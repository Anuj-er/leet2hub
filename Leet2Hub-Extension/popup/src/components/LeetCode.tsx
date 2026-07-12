import Welcome from "@/components/Welcome.tsx";
import { Code2, Github } from "lucide-react";
import Daily from "@/components/Daily.tsx";
import Spinner from "@/components/ui/Spinner.tsx";
import Stats from "@/components/Stats.tsx";
import Streak from "@/components/Streak.tsx";
import ConfigureGithubButton from "@/components/ConfigureGithubButton.tsx";
import SettingsView from "@/components/SettingsView.tsx";
import ConnectedRepo from "@/components/ConnectedRepo.tsx";
import {
  DailyProblemI,
  UserStatsI,
  UserStreakI,
} from "@/types/leet2hub.interface.ts";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext.tsx";
import { useDailyProblem } from "@/hooks/tanstack/queries/useDailyProblem";
import { useUserStats } from "@/hooks/tanstack/mutations/useUserStats";
import { useUserStreak } from "@/hooks/tanstack/mutations/useUserStreak";

interface LeetCodeProps {
  view: 'dashboard' | 'settings';
  setView: (view: 'dashboard' | 'settings') => void;
}

export default function LeetCode({ view, setView }: LeetCodeProps) {
  const { username } = useContext(UserContext);
  const [isGithubConfigured, setIsGithubConfigured] = useState(true); // Default true to avoid flash
  const [activeTab, setActiveTab] = useState<"leetcode" | "github">("leetcode");

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["token", "repo"], (result) => {
        if (!result.token || !result.repo) {
          setIsGithubConfigured(false);
        }
      });
    }
  }, []);

  const {
    data: dailyProblemData,
    error: dailyProblemError,
    isLoading: isDailyProblemLoading,
  } = useDailyProblem();

  const {
    data: userStatsData,
    error: userStatsError,
    isLoading: isUserStatsLoading,
  } = useUserStats(username);

  const {
    data: userStreakData,
    error: userStreakError,
    isLoading: isUserStreakLoadin,
  } = useUserStreak(username);

  const isLoading =
    isDailyProblemLoading || isUserStatsLoading || isUserStreakLoadin;
  const error = dailyProblemError || userStatsError || userStreakError;
  const totalProblems = userStatsData?.acSubmissionNum[0]?.count;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className="flex justify-center font-semibold text-red-700">
          <p>Error: {error.message}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {!isGithubConfigured && <ConfigureGithubButton />}
          
          {view === 'settings' ? (
            <SettingsView 
              onBack={() => setView('dashboard')}
              onReset={() => {
                setIsGithubConfigured(false);
                setView('dashboard');
              }} 
            />
          ) : (
            <>
              {isGithubConfigured && (
                <div className="flex bg-[#282828] p-1 rounded-lg shadow-sm border border-[#3e3e3e]">
                  <button
                    onClick={() => setActiveTab("leetcode")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                      activeTab === "leetcode"
                        ? "bg-[#3e3e3e] text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Code2 size={14} className={activeTab === "leetcode" ? "text-[#ffa116]" : ""} /> LeetCode
                  </button>
                  <button
                    onClick={() => setActiveTab("github")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                      activeTab === "github"
                        ? "bg-[#3e3e3e] text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Github size={14} /> GitHub
                  </button>
                </div>
              )}
              
              {activeTab === "leetcode" || !isGithubConfigured ? (
                <>
                  <Welcome 
                    username={username} 
                    totalProblems={totalProblems} 
                  />
                  <Stats data={userStatsData ?? ({} as UserStatsI)} />
                  <Streak data={userStreakData ?? ({} as UserStreakI)} />
                  <Daily data={dailyProblemData ?? ({} as DailyProblemI)} />
                </>
              ) : (
                <ConnectedRepo />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
