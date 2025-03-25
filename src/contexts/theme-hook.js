import { createContext, useContext } from 'react';

// Create the context
export const ThemeContext = createContext(undefined);

// Custom hook to use the ThemeContext
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}