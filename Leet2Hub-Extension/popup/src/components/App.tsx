import Links from "@/components/Links.tsx";
import Logo from "@/components/Logo.tsx";
import LeetCode from "@/components/LeetCode.tsx";
import Footer from "@/components/Footer.tsx";
import InputForm from "@/components/InputForm.tsx";
import { useContext } from "react";
import { UserContext } from "@/context/userContext.tsx";
import EditButton from "@/components/EditButton.tsx";

export default function App() {
  const { username } = useContext(UserContext);

  return (
    <main className="bg-[#1a1a1a] text-slate-50 min-h-[500px] w-[380px] flex flex-col relative overflow-y-auto overflow-x-hidden scrollbar-hidden font-sans">

      <div className="flex flex-col h-full p-3 z-10 relative">
        {/* Header */}
        <header className="flex items-center justify-between mb-3 px-1">
          <Logo />
          <Links />
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-3">
          {username ? <LeetCode /> : <InputForm />}
        </div>
        
        {/* Footer Area */}
        <div className="mt-auto pt-2 pb-1 flex flex-col gap-1.5">
          {username && <EditButton />}
          <Footer />
        </div>
      </div>
    </main>
  );
}
