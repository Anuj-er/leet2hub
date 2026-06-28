import { Badge } from "@/components/ui/badge";
import { getDifficultyColor } from "@/lib/utils.ts";
import { DailyProblemI } from "@/types/leet2hub.interface.ts";
import { ExternalLink } from "lucide-react";

export default function Daily({ data }: { data: DailyProblemI }) {
  return (
    <div className="p-2.5 bg-[#282828] border border-[#3e3e3e] rounded-lg shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[9px] text-[#ffa116] font-bold uppercase tracking-widest bg-[#ffa116]/10 border border-[#ffa116]/20 px-1.5 py-0.5 rounded-sm">Daily Challenge</p>
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${getDifficultyColor(data.question.difficulty as "Easy" | "Medium" | "Hard")}`}
        >
          {data.question.difficulty}
        </span>
      </div>

      <div>
        <a
          target="_blank"
          href={`https://leetcode.com${data.link}`}
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm font-bold text-zinc-100 transition-colors duration-200 hover:text-[#00b8a3] line-clamp-1"
          aria-label={`Read more about the daily problem: ${data.question.title}`}
        >
          {data.question.title}
          <ExternalLink size={12} className="opacity-50 shrink-0" />
        </a>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-1">
        {data.question.topicTags.map((tag) => (
          <Badge
            key={tag.name}
            className="bg-[#3e3e3e] text-zinc-300 border-none hover:bg-[#4a4a4a] hover:text-white rounded-[4px] text-[9px] py-0 px-1.5 font-medium transition-colors"
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
