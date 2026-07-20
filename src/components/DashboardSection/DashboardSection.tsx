import { useEffect, useMemo, useState } from 'react';
import { WeekSelector } from '../WeekSelector/WeekSelector';
import { ProjectNav } from '../ProjectNav/ProjectNav';
import { IssueHistoryChart } from '../IssueHistoryChart/IssueHistoryChart';
import { TestCaseDistributionChart } from '../TestCaseDistributionChart/TestCaseDistributionChart';
import { ReleaseTable } from '../ReleaseTable/ReleaseTable';
import { NotesSection } from '../NotesSection/NotesSection';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import { useProjects } from '../../hooks/useProjects';
import { useWeeks } from '../../hooks/useWeeks';
import { useIssueHistory } from '../../hooks/useIssueHistory';
import { useTestCaseDistribution } from '../../hooks/useTestCaseDistribution';
import { useReleases } from '../../hooks/useReleases';
import { useNotes } from '../../hooks/useNotes';
import { EmptyState } from '../EmptyState/EmptyState';
import type { Week } from '../../types';
import '../../App.css';

export function DashboardSection() {
  const { t } = usePreferences();
  const projects = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [issueHistoryRange, setIssueHistoryRange] = useState<5 | 10>(5);

  // Default to the first active project.
  useEffect(() => {
    if (!selectedProjectId && projects.activeProjects.length) {
      setSelectedProjectId(projects.activeProjects[0].id);
    }
  }, [projects.activeProjects, selectedProjectId]);

  // Weeks are scoped to the selected project and already ordered newest-first by the API.
  const weeks = useWeeks(selectedProjectId);

  // Default to the latest week that actually contains data for the project.
  useEffect(() => {
    if (weeks.data.length && !weeks.data.some((week) => week.id === selectedWeekId)) {
      setSelectedWeekId(weeks.data[0].id);
    }
    if (!weeks.data.length) {
      setSelectedWeekId(null);
    }
  }, [weeks.data, selectedWeekId]);

  const selectedWeek: Week | null = useMemo(
    () => weeks.data.find((week) => week.id === selectedWeekId) ?? null,
    [weeks.data, selectedWeekId]
  );
  const selectedProject = useMemo(
    () => projects.activeProjects.find((project) => project.id === selectedProjectId) ?? null,
    [projects.activeProjects, selectedProjectId]
  );

  const issues = useIssueHistory(selectedProjectId, selectedWeekId, issueHistoryRange);
  const distributions = useTestCaseDistribution(selectedWeekId, selectedProjectId);
  const releases = useReleases(selectedWeek, selectedProjectId);
  const notes = useNotes(selectedWeekId, selectedProjectId);

  const hasProject = Boolean(selectedProjectId);

  return (
    <>
      <div className="dashboard-page__header">
        <h2 className="dashboard-page__title">{t(copy.title)}</h2>
        <p className="dashboard-page__subtitle">{t(copy.subtitle)}</p>
      </div>
      <div className="dashboard-filters">
        <WeekSelector weeks={weeks.activeWeeks} selectedWeekId={selectedWeekId} onSelect={setSelectedWeekId} />
        <ProjectNav
          projects={projects.activeProjects}
          selectedProjectId={selectedProjectId}
          onSelect={setSelectedProjectId}
        />
        {selectedProject ? (
          <section className="dashboard-project-summary" aria-label="Selected project">
            <h2 className="dashboard-project-summary__title">{selectedProject.name}</h2>
            <p className="dashboard-project-summary__meta">
              {t(copy.leadQa)}: {selectedProject.lead_qa_name ?? t(copy.notAssigned)}
            </p>
          </section>
        ) : null}
      </div>
      <div className="dashboard-grid">
        <main className="dashboard-main">
          {hasProject ? (
            <IssueHistoryChart
              metrics={issues.data}
              weeks={weeks.data}
              selectedWeekId={selectedWeekId}
              rangeWeeks={issueHistoryRange}
              onRangeChange={setIssueHistoryRange}
            />
          ) : (
            <EmptyState title={t(copy.issueHistory)} body={t(copy.emptyGeneric)} />
          )}
          <TestCaseDistributionChart distributions={distributions.data} />
        </main>
        <aside className="dashboard-side">
          {selectedWeek ? <ReleaseTable releases={releases.data} /> : null}
          <NotesSection notes={notes.data} />
        </aside>
      </div>
    </>
  );
}
