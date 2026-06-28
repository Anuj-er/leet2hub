import { useContext, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/context/userContext.tsx";
import { fetchUserStats } from "@/lib/leet2hub.api.ts";
import { ArrowRight, Github, Code2 } from "lucide-react";

export default function InputForm() {
  const { username, setUsername } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const inputUsername = e.currentTarget.username.value;
    if (!inputUsername) {
      setError("Please enter a username");
      setLoading(false);
      return;
    }

    try {
      await fetchUserStats(inputUsername);
      setUsername(inputUsername);
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not found") {
          setError("User not found");
        } else {
          setError("Failed to fetch user stats");
        }
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-7 py-4 h-full flex-1">
      
      {/* Animated Connection Graphic */}
      <div className="relative mt-2 flex items-center justify-center gap-1">
        {/* LeetCode Side */}
        <div className="bg-[#282828] border border-[#3e3e3e] p-3 rounded-xl shadow-sm z-10">
          <Code2 size={32} className="text-[#ffa116]" strokeWidth={2.5} />
        </div>
        
        {/* Animated Flow Dots */}
        <div className="flex items-center gap-1.5 px-3">
          <div className="w-1.5 h-1.5 bg-[#ffa116] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-[#ffa116] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-[#ffa116] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* GitHub Side */}
        <div className="bg-[#282828] border border-[#3e3e3e] p-3 rounded-xl shadow-sm z-10">
          <Github size={32} className="text-white" strokeWidth={2.5} />
        </div>
      </div>

      <div className="text-center space-y-1.5">
        <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Connect Account</h2>
        <p className="text-xs text-zinc-400 max-w-[220px] leading-relaxed mx-auto">Link your LeetCode profile to track your progress.</p>
      </div>

      <form
        className="flex w-full flex-col gap-3 px-2 mt-2"
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <Input
            type="text"
            name="username"
            defaultValue={username}
            className="w-full bg-[#282828] border-[#3e3e3e] text-zinc-100 placeholder:text-zinc-600 rounded-md px-3 py-5 text-sm focus-visible:ring-1 focus-visible:ring-[#ffa116] focus-visible:border-[#ffa116] transition-colors text-center font-medium"
            placeholder="leetcode_username"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-md py-5 bg-[#ffa116] hover:bg-[#e08e0f] text-black transition-colors font-bold text-sm tracking-wide shadow-sm"
        >
          {loading ? "Connecting..." : "Connect"}
          {!loading && <ArrowRight size={16} className="ml-1.5" />}
        </Button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium px-4 py-2.5 rounded-lg text-center w-[90%] shadow-sm">
          {error}
        </div>
      )}
    </div>
  );
}
