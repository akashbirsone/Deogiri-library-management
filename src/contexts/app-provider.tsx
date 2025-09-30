"use client";

import * as React from "react";
import type { Role, User } from "@/types";
import { users } from "@/lib/data";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<Role>("student");
  
  const [user, setUser] = React.useState<User>(users.find(u => u.role === 'student')!);

  const setRole = (newRole: Role) => {
    const newUser = users.find(u => u.role === newRole);
    if(newUser) {
        setRoleState(newRole);
        setUser(newUser);
    }
  };

  React.useEffect(() => {
    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme") || "light";
      document.documentElement.classList.toggle("dark", theme === "dark");
    };

    handleThemeChange();
    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  return (
    <AppContext.Provider value={{ role, setRole, user }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
