import { useEffect, useRef } from "react";
import { Flame } from "lucide-react";
import { UserStreakI } from "@/types/leet2hub.interface.ts";
import { formatStreak, getDayColor } from "@/lib/utils.ts";

export default function Streak({ data }: { data: UserStreakI }) {
  const endRef = useRef<HTMLDivElement>(null);
  const streakArray = formatStreak(data?.fullSubmissionArray || []).slice(-4);

  useEffect(() => {
    if (endRef.current && streakArray.length > 0) {
      endRef.current.scrollLeft = endRef.current.scrollWidth;
    }
  }, [streakArray]);

  return (
    <div className="p-2.5 bg-[#282828] border border-[#3e3e3e] rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-zinc-300">Activity Calendar</h3>
        <div className="flex items-center gap-1.5 bg-[#3e3e3e] px-1.5 py-0.5 rounded-md border border-[#4a4a4a]">
          <Flame size={10} className="text-[#ffa116]" />
          <span className="text-[9px] font-bold text-zinc-200 uppercase tracking-wide">
            {data?.maxStreak || 0} Streak
          </span>
        </div>
      </div>

      <div
        className="scrollbar-hidden flex gap-1.5 overflow-x-scroll rounded-md bg-[#1a1a1a] p-2 border border-[#3e3e3e]"
        ref={endRef}
      >
        {streakArray.map((entry, i) => (
          <div
            key={i}
            className="flex min-w-[70px] flex-col gap-1.5 shrink-0"
          >
            <div className="grid grid-cols-5 gap-[2px]">
              {entry.days.map((daysEntry, j) => (
                <div
                  key={j}
                  className="h-[10px] w-[10px] rounded-[1px] transition-colors duration-200 hover:ring-1 ring-white/30"
                  style={{ backgroundColor: getDayColor(daysEntry.value) }}
                  title={`${daysEntry.value} submissions`}
                />
              ))}
            </div>
            <p className="text-[9px] text-zinc-500 text-center font-semibold uppercase tracking-wider mt-1">{entry.month}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
