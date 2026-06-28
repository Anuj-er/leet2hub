import { LINKS } from "@/data/links.tsx";

export default function Links() {
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
    </div>
  );
}
