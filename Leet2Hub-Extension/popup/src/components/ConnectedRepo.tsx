import { useEffect, useState } from "react";
import { ExternalLink, Github, Flame, Link2, Share2, GitCommit } from "lucide-react";

interface RecentSubmission {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

export default function ConnectedRepo() {
  const [repo, setRepo] = useState<string>("");
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);

  const [syncStreak, setSyncStreak] = useState<number>(0);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["repo", "recent-submissions", "github-sync-streak"], (result: { [key: string]: any }) => {
        setRepo((result.repo as string) || "");
        setRecentSubmissions((result["recent-submissions"] as RecentSubmission[]) || []);
        setSyncStreak(Number.parseInt((result["github-sync-streak"] as string) || "0"));
      });
    }
  }, []);

  const userName = repo ? repo.replace("https://github.com/", "").split("/")[0] : "";
  const displayRepoName = repo ? repo.replace("https://github.com/", "") : "";

  // Helper to format time
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  return (
    <div className="space-y-4 min-h-[420px] flex flex-col">
      {/* Connection Status - Matched to Welcome.tsx style */}
      <div className="flex items-center justify-between p-2.5 bg-[#282828] border border-[#3e3e3e] rounded-lg shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#3e3e3e] p-1.5 rounded-md border border-[#4a4a4a]">
            <Github size={16} className="text-zinc-300" />
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] text-[#00b8a3] font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b8a3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00b8a3]"></span>
              </span>
              Active & Syncing
            </p>
            <p className="text-sm font-bold text-zinc-100 mt-0.5 truncate max-w-[150px]" title={displayRepoName}>
              {displayRepoName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right flex flex-col items-end">
             <p className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">Quick Links</p>
             <div className="flex items-center gap-2">
               <a href={repo} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" title="View Repo">
                 <Link2 size={14} />
               </a>
               <button onClick={() => navigator.clipboard.writeText(repo)} className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Copy Link">
                 <Share2 size={14} />
               </button>
               {recentSubmissions.length > 0 && (
                 <a href={recentSubmissions[0].url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Latest Commit">
                   <GitCommit size={14} />
                 </a>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Contributions Chart - with Streak badge */}
      <div className="flex flex-col gap-2 p-2.5 bg-[#282828] border border-[#3e3e3e] rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-300">GitHub Contributions</h3>
          <div className="flex items-center gap-1.5 bg-[#3e3e3e] px-1.5 py-0.5 rounded-md border border-[#4a4a4a]">
            <Flame size={10} className={syncStreak > 0 ? "text-[#ffa116]" : "text-zinc-500"} />
            <span className="text-[9px] font-bold text-zinc-200 uppercase tracking-wide">
              {syncStreak} Streak
            </span>
          </div>
        </div>
        <div className="mt-1 bg-[#1e1e1e] rounded p-2 overflow-x-auto scrollbar-hidden border border-[#3e3e3e]">
          {userName ? (
            <div className="min-w-[680px]">
              <img 
                src={`https://ghchart.rshah.org/ffa116/${userName}`} 
                alt={`${userName}'s GitHub Contributions`}
                className="w-full opacity-90 [filter:invert(1)_hue-rotate(180deg)_brightness(1.1)]"
              />
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-4 text-center">Loading chart...</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col gap-2 p-3 bg-[#282828] border border-[#3e3e3e] rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-300">Recent Activity</h3>
          {recentSubmissions.length > 0 && (
            <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">
              Last: {timeAgo(recentSubmissions[0].timestamp)}
            </span>
          )}
        </div>
        <div className="flex flex-col mt-1 max-h-[130px] overflow-y-auto pr-1 scrollbar-hidden">
          {recentSubmissions.length > 0 ? (
            <div className="divide-y divide-[#3e3e3e]">
              {recentSubmissions.map((sub, idx) => (
                <div key={idx} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between group">
                  <div className="flex flex-col min-w-0 pr-4 overflow-hidden">
                    <p className="text-[13px] font-medium text-zinc-200 truncate">
                      {sub.id}. {sub.title}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      {timeAgo(sub.timestamp)}
                    </p>
                  </div>
                  <a 
                    href={sub.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-zinc-500 hover:text-[#ffa116] transition-colors flex-shrink-0"
                    title="View on GitHub"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-3 text-center text-xs text-zinc-500 italic">
              No recent pushes found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
