import { User } from 'lucide-react';

interface WelcomeProps {
  username: string;
  totalProblems: number | undefined;
}

export default function Welcome({ username, totalProblems }: WelcomeProps) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-[#282828] border border-[#3e3e3e] rounded-lg shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="bg-[#3e3e3e] p-1.5 rounded-md border border-[#4a4a4a]">
          <User size={16} className="text-zinc-300" />
        </div>
        <div>
          <p className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">Welcome back</p>
          <p className="text-sm font-bold text-zinc-100">
            {username}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">Total Solved</p>
        <p className="text-lg font-black text-[#ffa116] leading-none">{totalProblems || 0}</p>
      </div>
    </div>
  );
}
