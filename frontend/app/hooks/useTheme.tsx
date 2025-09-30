// app/hooks/useTheme.ts
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const ThemeContextProvider = ThemeContext.Provider;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const value: ThemeContextType = {
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContextProvider value={value}>
      {children}
    </ThemeContextProvider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
