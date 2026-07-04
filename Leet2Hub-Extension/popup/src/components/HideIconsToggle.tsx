import { useEffect, useState } from "react";
import { EyeOff } from "lucide-react";

export default function HideIconsToggle() {
  const [hideIcons, setHideIcons] = useState(false);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["hide-premium-icons"], (result) => {
        setHideIcons(!!result["hide-premium-icons"]);
      });
    }
  }, []);

  const handleToggle = () => {
    const newValue = !hideIcons;
    setHideIcons(newValue);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ "hide-premium-icons": newValue });
    }
  };

  return (
    <div className="flex items-center justify-between p-3 mt-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={handleToggle}>
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
          <EyeOff size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-200">Hide Premium Icons</span>
          <span className="text-xs text-zinc-500">Remove debugger & lock icons</span>
        </div>
      </div>
      
      <div className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out ${hideIcons ? 'bg-orange-500' : 'bg-zinc-700'}`}>
        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${hideIcons ? 'translate-x-2' : '-translate-x-2'}`} />
      </div>
    </div>
  );
}
