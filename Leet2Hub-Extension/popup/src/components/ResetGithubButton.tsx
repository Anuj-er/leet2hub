import { Button } from "@/components/ui/button.tsx";
import { RotateCcw } from "lucide-react";

export default function ResetGithubButton({ onReset }: { onReset: () => void }) {
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your GitHub configuration? This will clear your token and repository settings.")) {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.remove([
          "repo",
          "token",
          "separate-folder",
          "ai-generate",
          "custom-dir",
          "api-key",
          "ai-provider",
          "ai-prompt"
        ], () => {
          onReset();
        });
      }
    }
  };

  return (
    <div className="flex justify-center mt-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleReset}
        className="text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 transition-colors w-full rounded-xl"
      >
        <RotateCcw size={14} className="mr-2" />
        Reset GitHub Configuration
      </Button>
    </div>
  );
}
