import { useEffect, useMemo, useState } from 'react';
import type { MaintenanceMode, Project, Week } from '../types';

export function useDashboard(weeks: Week[], projects: Project[]) {
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<MaintenanceMode>('weeks');

  useEffect(() => {
    if (!weeks.length) {
      setSelectedWeekId(null);
      return;
    }

    const active = weeks.find((week) => week.is_active) ?? weeks[0];
    const stillExists = weeks.some((week) => week.id === selectedWeekId && week.is_active);

    if (!stillExists) {
      setSelectedWeekId(active.id);
    }
  }, [selectedWeekId, weeks]);

  useEffect(() => {
    if (!projects.length) {
      setSelectedProjectId(null);
      return;
    }

    const active = projects.find((project) => project.is_active) ?? projects[0];
    const stillExists = projects.some((project) => project.id === selectedProjectId && project.is_active);

    if (!stillExists) {
      setSelectedProjectId(active.id);
    }
  }, [projects, selectedProjectId]);

  const selectedWeek = useMemo(() => weeks.find((week) => week.id === selectedWeekId) ?? null, [selectedWeekId, weeks]);
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  return {
    selectedWeekId,
    selectedProjectId,
    selectedWeek,
    selectedProject,
    activePanel,
    setSelectedWeekId,
    setSelectedProjectId,
    setActivePanel
  };
}
