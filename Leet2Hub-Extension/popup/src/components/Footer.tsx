import pkg from "../../package.json";
import { SiKofi } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between mt-2 pt-3 border-t border-white/10">
      <div className="flex items-center space-x-3">
        <p className="text-zinc-500 flex items-center text-xs">
          &copy; {new Date().getFullYear()}
          <span className="text-zinc-300 ml-1 font-semibold tracking-wide">
            Leet2Hub
          </span>
        </p>
        <a 
          href="https://ko-fi.com/anujer"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-500 hover:text-[#FF5E5B] transition-colors flex items-center"
          title="Support me on Ko-fi"
        >
          <SiKofi size={16} />
        </a>
      </div>

      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">v{pkg.version}</span>
    </footer>
  );
}
