import { createContext, useContext } from "react";

// Create the context
export const SidebarContext = createContext(undefined);

// Create the custom hook to use the context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};