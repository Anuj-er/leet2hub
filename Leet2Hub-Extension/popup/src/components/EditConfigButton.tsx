import { Button } from "@/components/ui/button.tsx";
import { SlidersHorizontal } from "lucide-react";

export default function EditConfigButton() {
  const handleClick = () => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.url?.includes("leetcode.com")) {
          // If already on LeetCode, send message to open modal
          chrome.tabs.sendMessage(activeTab.id!, { action: "show_config_modal" });
          window.close();
        } else {
          // Open LeetCode with the setup URL parameter
          chrome.tabs.create({ url: "https://leetcode.com/problemset/all/?leet2hub_setup=true" });
        }
      });
    }
  };

  return (
    <div className="flex justify-center mt-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleClick}
        className="text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors w-full rounded-xl"
      >
        <SlidersHorizontal size={14} className="mr-2" />
        Edit Configuration
      </Button>
    </div>
  );
}
