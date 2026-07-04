import { ArrowLeft } from "lucide-react";
import HideIconsToggle from "@/components/HideIconsToggle";
import ResetGithubButton from "@/components/ResetGithubButton";
import EditButton from "@/components/EditButton";
import EditConfigButton from "@/components/EditConfigButton";

interface SettingsViewProps {
  onBack: () => void;
  onReset: () => void;
}

export default function SettingsView({ onBack, onReset }: SettingsViewProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-[#3e3e3e]">
        <button 
          onClick={onBack}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-[#3e3e3e] rounded-md transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-sm font-bold text-zinc-100">Preferences</h2>
      </div>
      
      <div className="space-y-2">
        <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider pl-1">Display</p>
        <HideIconsToggle />
      </div>

      <div className="space-y-1 pt-4">
        <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider pl-1 mb-2">Account</p>
        <EditConfigButton />
        <EditButton />
        <ResetGithubButton onReset={onReset} />
      </div>
    </div>
  );
}
