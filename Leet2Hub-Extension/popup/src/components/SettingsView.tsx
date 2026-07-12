import { ArrowLeft, Code } from "lucide-react";
import HideIconsToggle from "@/components/HideIconsToggle";
import ResetGithubButton from "@/components/ResetGithubButton";
import EditButton from "@/components/EditButton";
import EditConfigButton from "@/components/EditConfigButton";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SettingsViewProps {
  onBack: () => void;
  onReset: () => void;
}

export default function SettingsView({ onBack, onReset }: SettingsViewProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [configJson, setConfigJson] = useState("");

  const toggleConfig = () => {
    if (!showConfig) {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(null, (result) => {
          setConfigJson(JSON.stringify(result, null, 2));
          setShowConfig(true);
        });
      } else {
        setConfigJson(JSON.stringify({ mock: "config" }, null, 2));
        setShowConfig(true);
      }
    } else {
      setShowConfig(false);
    }
  };

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
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleConfig}
          className="text-zinc-500 hover:text-green-400 hover:bg-green-500/10 transition-colors w-full rounded-xl"
        >
          <Code size={14} className="mr-2" />
          {showConfig ? "Hide Configuration" : "View Configuration (JSON)"}
        </Button>
        
        {showConfig && (
          <div className="mx-2 mt-1 mb-2 p-2 bg-[#1e1e1e] rounded-md border border-[#3e3e3e] max-h-40 overflow-y-auto scrollbar-hidden">
            <pre className="text-[10px] text-zinc-300 whitespace-pre-wrap break-all">
              {configJson}
            </pre>
          </div>
        )}

        <EditButton />
        <ResetGithubButton onReset={onReset} />
      </div>
    </div>
  );
}
