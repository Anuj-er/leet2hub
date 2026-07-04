import { Button } from "@/components/ui/button.tsx";
import { Settings } from "lucide-react";

export default function ConfigureGithubButton() {
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
    <div className="flex justify-center mt-1 w-full pb-2">
      <Button 
        size="default" 
        onClick={handleClick}
        className="w-full bg-[#ffa116] hover:bg-[#e08e0f] text-black font-bold tracking-wide shadow-sm rounded-lg"
      >
        <Settings size={16} className="mr-2" />
        Configure GitHub Integration
      </Button>
    </div>
  );
}
