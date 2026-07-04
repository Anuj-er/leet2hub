import { LINKS } from "@/data/links.tsx";
import { Settings } from "lucide-react";

interface LinksProps {
  onSettingsClick?: () => void;
}

export default function Links({ onSettingsClick }: LinksProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      {LINKS.map(({ link, icon }) => (
        <a
          href={link}
          key={link}
          target="_blank"
          className="text-zinc-400 hover:text-white transition-all duration-300 ease-out hover:scale-110 drop-shadow-sm"
        >
          {icon}
        </a>
      ))}
      
      {onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className="text-zinc-400 hover:text-white transition-all duration-300 ease-out hover:scale-110 drop-shadow-sm"
          title="Preferences"
        >
          <Settings size={22} />
        </button>
      )}
    </div>
  );
}
