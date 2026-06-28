import { UserStatsI } from "@/types/leet2hub.interface.ts";

export default function Stats({ data }: { data: UserStatsI }) {
  const { allQuestionsCount, acSubmissionNum } = data;

  const allQuestions = {
    all: allQuestionsCount?.[0]?.count || 1,
    easy: allQuestionsCount?.[1]?.count || 1,
    medium: allQuestionsCount?.[2]?.count || 1,
    hard: allQuestionsCount?.[3]?.count || 1,
  };

  const acSubmissions = {
    all: acSubmissionNum?.[0]?.count || 0,
    easy: acSubmissionNum?.[1]?.count || 0,
    medium: acSubmissionNum?.[2]?.count || 0,
    hard: acSubmissionNum?.[3]?.count || 0,
  };

  const easyPercentage = (acSubmissions.easy / allQuestions.easy) * 100;
  const mediumPercentage = (acSubmissions.medium / allQuestions.medium) * 100;
  const hardPercentage = (acSubmissions.hard / allQuestions.hard) * 100;

  return (
    <div className="flex flex-col gap-2 p-2.5 bg-[#282828] border border-[#3e3e3e] rounded-lg shadow-sm">
      <h3 className="text-xs font-semibold text-zinc-300 mb-0.5">Difficulty Breakdown</h3>
      
      <div className="space-y-2.5">
        {/* Easy */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-[#00b8a3] font-medium text-[11px]">Easy</span>
            <span className="text-[9px] text-zinc-400 font-medium">
              <span className="text-zinc-200 text-[11px] mr-0.5">{acSubmissions.easy}</span><span className="opacity-50">/ {allQuestions.easy}</span>
            </span>
          </div>
          <div className="h-1 w-full bg-[#3e3e3e] rounded-full overflow-hidden">
            <div className="h-full bg-[#00b8a3] rounded-full transition-all duration-1000 ease-out" style={{ width: `${easyPercentage}%` }} />
          </div>
        </div>

        {/* Medium */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-[#ffc01e] font-medium text-[11px]">Medium</span>
            <span className="text-[9px] text-zinc-400 font-medium">
              <span className="text-zinc-200 text-[11px] mr-0.5">{acSubmissions.medium}</span><span className="opacity-50">/ {allQuestions.medium}</span>
            </span>
          </div>
          <div className="h-1 w-full bg-[#3e3e3e] rounded-full overflow-hidden">
            <div className="h-full bg-[#ffc01e] rounded-full transition-all duration-1000 ease-out" style={{ width: `${mediumPercentage}%` }} />
          </div>
        </div>

        {/* Hard */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-[#ff375f] font-medium text-[11px]">Hard</span>
            <span className="text-[9px] text-zinc-400 font-medium">
              <span className="text-zinc-200 text-[11px] mr-0.5">{acSubmissions.hard}</span><span className="opacity-50">/ {allQuestions.hard}</span>
            </span>
          </div>
          <div className="h-1 w-full bg-[#3e3e3e] rounded-full overflow-hidden">
            <div className="h-full bg-[#ff375f] rounded-full transition-all duration-1000 ease-out" style={{ width: `${hardPercentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
