"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';

const STORAGE_KEY = 'mira-theme';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedDark: boolean; // true when UI should be dark (either theme is 'dark' or theme is 'system' and OS prefers dark)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function shouldBeDark(theme: Theme): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return getSystemPrefersDark();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use 'system' for initial state so server and client first render match (no localStorage on server)
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedDark, setResolvedDark] = useState(false);

  // After mount, restore stored theme from localStorage (client-only)
  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    setResolvedDark(shouldBeDark(stored));
  }, []);

  const setTheme = useMemo(
    () => (value: Theme) => {
      setThemeState(value);
      localStorage.setItem(STORAGE_KEY, value);
    },
    [],
  );

  // Apply dark class to document and sync resolved dark state
  useEffect(() => {
    const dark = shouldBeDark(theme);
    setResolvedDark(dark);
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system preference changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const dark = getSystemPrefersDark();
      setResolvedDark(dark);
      if (dark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, resolvedDark }),
    [theme, setTheme, resolvedDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
