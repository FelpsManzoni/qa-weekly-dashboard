import { useMemo } from 'react';
import { Header } from './components/Header/Header';
import { WeekSelector } from './components/WeekSelector/WeekSelector';
import { ProjectNav } from './components/ProjectNav/ProjectNav';
import { IssueHistoryChart } from './components/IssueHistoryChart/IssueHistoryChart';
import { TestCaseDistributionChart } from './components/TestCaseDistributionChart/TestCaseDistributionChart';
import { ReleaseTable } from './components/ReleaseTable/ReleaseTable';
import { NotesSection } from './components/NotesSection/NotesSection';
import { IssueMetricForm, NoteForm, ProjectForm, ReleaseForm, TestCaseDistributionForm, WeekForm } from './components/forms';
import { maintenanceTitles, bilingualText } from './utils/copy';
import { useWeeks } from './hooks/useWeeks';
import { useProjects } from './hooks/useProjects';
import { useDashboard } from './hooks/useDashboard';
import { useIssueHistory } from './hooks/useIssueHistory';
import { useTestCaseDistribution } from './hooks/useTestCaseDistribution';
import { useReleases } from './hooks/useReleases';
import { useNotes } from './hooks/useNotes';
import './styles/globals.css';
import './App.css';

function PanelTabs({ active, onChange }: { active: keyof typeof maintenanceTitles; onChange: (value: keyof typeof maintenanceTitles) => void }) {
  return (
    <div className="panel-tabs">
      {Object.entries(maintenanceTitles).map(([key, label]) => (
        <button
          key={key}
          className={`panel-tabs__button ${active === key ? 'panel-tabs__button--active' : ''}`}
          onClick={() => onChange(key as keyof typeof maintenanceTitles)}
          type="button"
        >
          {bilingualText(label)}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const weeks = useWeeks();
  const projects = useProjects();
  const dashboard = useDashboard(weeks.activeWeeks, projects.activeProjects);
  const issues = useIssueHistory(dashboard.selectedProjectId);
  const distributions = useTestCaseDistribution(dashboard.selectedWeekId, dashboard.selectedProjectId);
  const releases = useReleases(dashboard.selectedWeekId, dashboard.selectedProjectId);
  const notes = useNotes(dashboard.selectedWeekId, dashboard.selectedProjectId);

  const selectedIssueMetric = useMemo(
    () => issues.data.find((item) => item.week_id === dashboard.selectedWeekId) ?? null,
    [dashboard.selectedWeekId, issues.data]
  );
  const selectedDistribution = distributions.data[0] ?? null;
  const selectedRelease = releases.data[0] ?? null;
  const selectedNote = notes.data[0] ?? null;

  const refreshAll = async () => {
    await Promise.all([
      weeks.refresh(),
      projects.refresh(),
      issues.refresh(),
      distributions.refresh(),
      releases.refresh(),
      notes.refresh()
    ]);
  };

  return (
    <div className="app-shell">
      <Header onRefresh={() => void refreshAll()} />
      <WeekSelector weeks={weeks.activeWeeks} selectedWeekId={dashboard.selectedWeekId} onSelect={dashboard.setSelectedWeekId} />
      <div className="dashboard-grid">
        <ProjectNav
          projects={projects.activeProjects}
          selectedProjectId={dashboard.selectedProjectId}
          onSelect={dashboard.setSelectedProjectId}
        />
        <main className="dashboard-main">
          <IssueHistoryChart metrics={issues.data} weeks={weeks.data} />
          <TestCaseDistributionChart distributions={distributions.data} />
        </main>
        <aside className="dashboard-side">
          <ReleaseTable releases={releases.data} />
          <NotesSection notes={notes.data} />
        </aside>
      </div>
      <section className="maintenance-panel">
        <div className="section-heading">Maintenance / Manutencao</div>
        <PanelTabs active={dashboard.activePanel} onChange={dashboard.setActivePanel} />
        <div className="maintenance-panel__content">
          {dashboard.activePanel === 'weeks' ? <WeekForm selected={dashboard.selectedWeek} onSaved={() => void refreshAll()} /> : null}
          {dashboard.activePanel === 'projects' ? <ProjectForm selected={dashboard.selectedProject} onSaved={() => void refreshAll()} /> : null}
          {dashboard.activePanel === 'issues' ? (
            <IssueMetricForm
              weekId={dashboard.selectedWeekId}
              projectId={dashboard.selectedProjectId}
              selected={selectedIssueMetric}
              onSaved={() => void refreshAll()}
            />
          ) : null}
          {dashboard.activePanel === 'test-cases' ? (
            <TestCaseDistributionForm
              weekId={dashboard.selectedWeekId}
              projectId={dashboard.selectedProjectId}
              selected={selectedDistribution}
              onSaved={() => void refreshAll()}
            />
          ) : null}
          {dashboard.activePanel === 'releases' ? (
            <ReleaseForm
              weekId={dashboard.selectedWeekId}
              projectId={dashboard.selectedProjectId}
              selected={selectedRelease}
              onSaved={() => void refreshAll()}
            />
          ) : null}
          {dashboard.activePanel === 'notes' ? (
            <NoteForm
              weekId={dashboard.selectedWeekId}
              projectId={dashboard.selectedProjectId}
              selected={selectedNote}
              onSaved={() => void refreshAll()}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
