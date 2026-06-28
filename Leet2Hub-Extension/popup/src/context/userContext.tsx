import { ReactNode, useState, createContext, useEffect } from "react";

interface UserContextI {
  username: string;
  setUsername: (username: string) => void;
}

const UserContext = createContext<UserContextI>({
  username: "",
  setUsername: () => {},
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ popupUsername: newUsername });
    } else {
      localStorage.setItem("username", newUsername);
    }
  };

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["popupUsername"], (result) => {
        if (result.popupUsername) {
          setUsernameState(result.popupUsername as string);
        }
        setIsLoaded(true);
      });
    } else {
      const stored = localStorage.getItem("username");
      if (stored) setUsernameState(stored);
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) return null; // Prevent UI flicker while loading storage

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
