import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'techTrackerThemeMode';

export function ThemeProviderCustom({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      // ignore
    }
  }, [mode]);

  // Apply CSS variables globally for non-MUI styles so the whole app follows theme
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.style.setProperty('--bg', '#121212');
      root.style.setProperty('--paper', '#1e1e1e');
      root.style.setProperty('--text', '#e6edf3');
      root.style.setProperty('--muted', '#9ca3af');
      root.style.setProperty('--primary', '#90caf9');
      root.style.setProperty('--primary-variant', '#64b5f6');
      root.style.setProperty('--danger', '#f87171');
      root.style.setProperty('--success', '#66bb6a');
      root.style.setProperty('--warning', '#ffb74d');
      root.style.setProperty('--btn-primary', '#90caf9');
      root.style.setProperty('--btn-primary-hover', '#64b5f6');
      root.style.setProperty('--paper-contrast', '#111111');
    } else {
      root.style.setProperty('--bg', '#f5f5f5');
      root.style.setProperty('--paper', '#ffffff');
      root.style.setProperty('--text', '#333333');
      root.style.setProperty('--muted', '#666666');
      root.style.setProperty('--primary', '#667eea');
      root.style.setProperty('--primary-variant', '#5a6fd8');
      root.style.setProperty('--danger', '#c53030');
      root.style.setProperty('--success', '#2f855a');
      root.style.setProperty('--warning', '#f57c00');
      root.style.setProperty('--btn-primary', '#667eea');
      root.style.setProperty('--btn-primary-hover', '#5a6fd8');
      root.style.setProperty('--paper-contrast', '#ffffff');
    }
  }, [mode]);

  const toggleMode = useCallback(() => setMode(m => (m === 'light' ? 'dark' : 'light')), []);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProviderCustom');
  return ctx;
}

export default ThemeProviderCustom;
