import { createContext, useContext, useEffect, useState, type ReactElement, type ReactNode } from 'react';
import type { BilingualText } from '../types';

export type Language = 'pt' | 'en';
export type Theme = 'light' | 'dark';

type PreferencesContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (text: BilingualText) => string;
};

const LANG_KEY = 'qa.lang';
const THEME_KEY = 'qa.theme';

function initialLanguage(): Language {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(LANG_KEY) : null;
  if (stored === 'pt' || stored === 'en') {
    return stored;
  }
  return (window.navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function initialTheme(): Theme {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const defaultContext: PreferencesContextValue = {
  language: 'en',
  setLanguage: () => {},
  theme: 'light',
  toggleTheme: () => {},
  t: (text: BilingualText) => text.en
};

const PreferencesContext = createContext<PreferencesContextValue>(defaultContext);

export function PreferencesProvider({ children }: { children: ReactNode }): ReactElement {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language === 'pt' ? 'pt-BR' : 'en');
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setLanguage = (next: Language) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANG_KEY, next);
    }
    setLanguageState(next);
  };

  const toggleTheme = () => {
    setThemeState((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_KEY, next);
      }
      return next;
    });
  };

  const t = (text: BilingualText) => text[language];

  return (
    <PreferencesContext.Provider value={{ language, setLanguage, theme, toggleTheme, t }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  return useContext(PreferencesContext);
}
