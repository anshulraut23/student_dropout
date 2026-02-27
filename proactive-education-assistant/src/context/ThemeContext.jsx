import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const DEFAULT_THEME = 'light';

export function ThemeProvider({ children }) {
  const [theme] = useState(DEFAULT_THEME);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark', 'dark-mode');

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark', 'dark-mode');
    } else {
      root.classList.add('light');
      body.classList.add('light');
    }

  }, [theme]);

  const toggleTheme = () => {};

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
