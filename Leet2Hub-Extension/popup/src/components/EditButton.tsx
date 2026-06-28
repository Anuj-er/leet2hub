import { Button } from "@/components/ui/button.tsx";
import { UserContext } from "@/context/userContext.tsx";
import { useContext } from "react";
import { LogOut } from "lucide-react";

export default function EditButton() {
  const { setUsername } = useContext(UserContext);

  return (
    <div className="flex justify-center mt-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setUsername("")}
        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full rounded-xl"
      >
        <LogOut size={14} className="mr-2" />
        Disconnect Account
      </Button>
    </div>
  );
}
