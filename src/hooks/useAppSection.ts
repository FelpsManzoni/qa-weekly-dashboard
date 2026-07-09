import { useCallback, useState } from 'react';
import type { AppSection } from '../types';

const SECTION_KEY = 'qa.section';

export function useAppSection() {
  const [section, setSectionState] = useState<AppSection>(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(SECTION_KEY) : null;
    if (stored === 'dashboard' || stored === 'projects' || stored === 'project-data') {
      return stored;
    }
    return 'dashboard';
  });

  const setSection = useCallback((next: AppSection) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SECTION_KEY, next);
    }
    setSectionState(next);
  }, []);

  return { section, setSection };
}
