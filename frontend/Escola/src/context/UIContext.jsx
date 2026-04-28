import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export function UIProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleDark = () => setDark(!dark);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <UIContext.Provider
      value={{ dark, toggleDark, sidebarCollapsed, toggleSidebar }}
    >
      {children}
    </UIContext.Provider>
  );
}

//b p