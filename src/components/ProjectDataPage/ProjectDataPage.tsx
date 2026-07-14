import { useEffect, useMemo, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useWeeks } from '../../hooks/useWeeks';
import { useProjectDataEditor, type NoteDraft, type ReleaseDraft } from '../../hooks/useProjectDataEditor';
import { usePreferences } from '../../hooks/usePreferences';
import { copy } from '../../utils/copy';
import { formatWeekRange, isoWeekLabel, recentProjectDataWeeks } from '../../utils/dates';
import { EmptyState } from '../EmptyState/EmptyState';
import { RELEASE_STATUSES, type Week } from '../../types';
import './ProjectDataPage.css';

function previousWeekStart(startDate: string): string {
  const date = new Date(`${startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 7);
  return date.toISOString().slice(0, 10);
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function statusClass(status: ReleaseDraft['status']): string {
  return status.toLowerCase().replace(/\s+/g, '-');
}

function localizedCopyMessage(message: string | null, t: (text: typeof copy.projectData) => string): string | null {
  if (message === copy.noPreviousWeekData.en) {
    return t(copy.noPreviousWeekData);
  }
  if (message === copy.copiedPreviousWeek.en) {
    return t(copy.copiedPreviousWeek);
  }
  if (message === copy.pendingAggregateInvalid.en) {
    return t(copy.pendingAggregateInvalid);
  }
  return message;
}

const PRIORITY_OPTIONS = [
  { value: 0, label: 'priority0' },
  { value: 1, label: 'priority1' },
  { value: 2, label: 'priority2' },
  { value: 3, label: 'priority3' }
] as const;

function RequiredMark() {
  const { t } = usePreferences();

  return <span className="project-data-page__required" aria-label={t(copy.requiredField)}>*</span>;
}

export function ProjectDataPage() {
  const { t } = usePreferences();
  const projects = useProjects();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedWeekStart, setSelectedWeekStart] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId && projects.activeProjects.length) {
      setProjectId(projects.activeProjects[0].id);
    }
  }, [projects.activeProjects, projectId]);

  const weeks = useWeeks();
  const weekOptions = useMemo(() => recentProjectDataWeeks(weeks.data), [weeks.data]);

  useEffect(() => {
    if (weeks.isLoading) {
      return;
    }

    setSelectedWeekStart((current) => {
      if (!weekOptions.length) {
        return null;
      }
      if (current && weekOptions.some((week) => week.start_date === current)) {
        return current;
      }
      return weekOptions[0].start_date;
    });
  }, [weekOptions, weeks.isLoading]);

  const selectedWeek = useMemo(
    () => weekOptions.find((week) => week.start_date === selectedWeekStart) ?? null,
    [selectedWeekStart, weekOptions]
  );
  const handleWeekResolved = (week: Week) => {
    setSelectedWeekStart(week.start_date);
    void weeks.refresh();
  };
  const editor = useProjectDataEditor(selectedWeek, projectId, handleWeekResolved);
  const issueNetChange = editor.reported - editor.fixed;
  const testTotal = editor.testCaseAggregate.automated + editor.testCaseAggregate.pending + editor.testCaseAggregate.notAuto;
  const automationCoverage = testTotal > 0 ? Math.round((editor.testCaseAggregate.automated / testTotal) * 100) : 0;
  const showStickyFooter = Boolean(editor.isDirty || editor.saving || editor.copyMessage || editor.saveError);
  const copyMessage = localizedCopyMessage(editor.copyMessage, t);
  const saveError = localizedCopyMessage(editor.saveError, t);

  if (!projectId || !selectedWeek) {
    return (
      <section className="project-data-page">
        <h2 className="section-heading">{t(copy.projectData)}</h2>
        <EmptyState title={t(copy.projectData)} body={t(copy.noActiveWeeks)} />
      </section>
    );
  }

  return (
    <section className={`project-data-page ${showStickyFooter ? 'project-data-page--with-footer' : ''}`}>
      <div className="project-data-page__header">
        <div>
          <h2 className="project-data-page__title">{t(copy.projectDataPageTitle)}</h2>
          <p className="project-data-page__subtitle">{t(copy.projectDataCapture)}</p>
        </div>
        {editor.isDirty ? (
          <div className="project-data-page__change-pill">
            <span className="project-data-page__change-dot" aria-hidden="true" />
            {t(copy.unsavedChanges)}
          </div>
        ) : null}
      </div>

      <section className="project-data-page__context" aria-label="Reporting context">
        <label className="project-data-page__field project-data-page__field--project">
          <span>{t(copy.selectProject)} <RequiredMark /></span>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            {projects.activeProjects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </label>
        <label className="project-data-page__field project-data-page__field--week">
          <span>{t(copy.selectWeek)} <RequiredMark /></span>
          <select value={selectedWeek.start_date} onChange={(e) => setSelectedWeekStart(e.target.value)}>
            {weekOptions.map((week) => (
              <option key={week.start_date} value={week.start_date}>
                {`${isoWeekLabel(week)} (${formatWeekRange(week)})`}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="project-data-page__button project-data-page__button--secondary"
          disabled={editor.copying || editor.loading}
          onClick={() => void editor.copyFromPreviousWeek(previousWeekStart(selectedWeek.start_date))}
        >
          {editor.copying ? t(copy.loading) : t(copy.copyPreviousWeek)}
        </button>
      </section>

      {editor.loading ? <p className="project-data-page__hint">{t(copy.loading)}</p> : null}
      {editor.error ? <div className="maintenance-form__error">{editor.error}</div> : null}
      {copyMessage ? <div className="project-data-page__notice">{copyMessage}</div> : null}

      <div className="project-data-page__sections">
        <div className="project-data-page__metrics">
          <section className="project-data-page__card">
            <div className="project-data-page__card-head">
              <div>
                <h3>{t(copy.issueHistory)}</h3>
                <p>{t(copy.issueHistorySubtitle)}</p>
              </div>
            </div>
            <div className="project-data-page__metric-grid">
              <label className="project-data-page__metric">
                <span>{t(copy.reported)}</span>
                <input min="0" type="number" value={editor.reported} onChange={(e) => editor.setReported(Number(e.target.value))} />
              </label>
              <label className="project-data-page__metric">
                <span>{t(copy.fixed)}</span>
                <input min="0" type="number" value={editor.fixed} onChange={(e) => editor.setFixed(Number(e.target.value))} />
              </label>
              <div className="project-data-page__metric project-data-page__metric--derived">
                <span>{t(copy.netChange)} <span className="project-data-page__info" tabIndex={0} title={t(copy.netChangeHelp)}>i</span></span>
                <strong>{formatSigned(issueNetChange)}</strong>
              </div>
            </div>
          </section>

          <section className="project-data-page__card">
            <div className="project-data-page__card-head">
              <div>
                <h3>{t(copy.testCaseDistribution)}</h3>
                <p>{t(copy.testCaseDistributionSubtitle)}</p>
              </div>
              <span className="project-data-page__badge">{automationCoverage}% {t(copy.automatedSuffix)}</span>
            </div>
            <div className="project-data-page__metric-grid">
              <label className="project-data-page__metric">
                <span>{t(copy.formAutomated)}</span>
                <input min="0" type="number" value={editor.automated} onChange={(e) => editor.setAutomated(Number(e.target.value))} />
                <small>{t(copy.aggregatedTotal)}: {editor.testCaseAggregate.automated}</small>
              </label>
              <label className="project-data-page__metric">
                <span>{t(copy.formPending)}</span>
                <input min="0" type="number" value={editor.pending} onChange={(e) => editor.setPending(Number(e.target.value))} />
                <small>{t(copy.aggregatedTotal)}: {editor.testCaseAggregate.pending}</small>
              </label>
              <label className="project-data-page__metric">
                <span>{t(copy.formNotAutomated)}</span>
                <input min="0" type="number" value={editor.notAuto} onChange={(e) => editor.setNotAuto(Number(e.target.value))} />
                <small>{t(copy.aggregatedTotal)}: {editor.testCaseAggregate.notAuto}</small>
              </label>
            </div>
            {editor.hasInvalidPendingAggregate ? (
              <div className="project-data-page__validation">{t(copy.pendingAggregateInvalid)}</div>
            ) : null}
            <div className="project-data-page__coverage">
              <div>
                <span>{t(copy.automationCoverage)}</span>
                <strong>{editor.testCaseAggregate.automated} / {testTotal}</strong>
              </div>
              <div className="project-data-page__coverage-bar" aria-hidden="true">
                <span style={{ width: `${automationCoverage}%` }} />
              </div>
            </div>
          </section>
        </div>

        <section className="project-data-page__card project-data-page__section">
          <div className="project-data-page__section-head">
            <div>
              <h3>{t(copy.releases)}</h3>
              <p>{t(copy.releaseSummarySubtitle)}</p>
            </div>
            <button type="button" className="project-data-page__button project-data-page__button--primary" onClick={editor.addRelease}>
              + {t(copy.addRelease)}
            </button>
          </div>
          <div className="project-data-page__release-list">
            {editor.releases.map((release, index) => (
              <ReleaseEditor
                key={release.id ?? `new-${index}`}
                release={release}
                index={index}
                onChange={editor.updateRelease}
                onRemove={editor.removeRelease}
              />
            ))}
          </div>
        </section>

        <section className="project-data-page__card project-data-page__section">
          <div className="project-data-page__section-head">
            <div>
              <h3>{t(copy.notes)}</h3>
              <p>{t(copy.priorityNotesSubtitle)}</p>
            </div>
            <button type="button" className="project-data-page__button project-data-page__button--secondary" onClick={editor.addNote}>
              + {t(copy.addNote)}
            </button>
          </div>
          <div className="project-data-page__note-list">
            {editor.notes.map((note, index) => (
              <NoteEditor
                key={note.id ?? `new-${index}`}
                note={note}
                index={index}
                onChange={editor.updateNote}
                onRemove={editor.removeNote}
              />
            ))}
          </div>
        </section>
      </div>

      {showStickyFooter ? (
        <footer className="project-data-page__sticky" aria-live="polite">
          <div className="project-data-page__sticky-state">
            <span className="project-data-page__dirty-dot" aria-hidden="true" />
            <div>
              <strong>{editor.isDirty ? t(copy.unsavedChanges) : editor.saving ? t(copy.loading) : t(copy.projectData)}</strong>
              {saveError ? <span>{saveError}</span> : null}
              {!saveError && copyMessage ? <span>{copyMessage}</span> : null}
            </div>
          </div>
          <div className="project-data-page__sticky-actions">
            <button
              type="button"
              className="project-data-page__button project-data-page__button--ghost"
              disabled={editor.saving || !editor.isDirty}
              onClick={editor.discardChanges}
            >
              {t(copy.discardChanges)}
            </button>
            <button
              type="button"
              className="project-data-page__button project-data-page__button--primary"
              disabled={editor.saving || !editor.isDirty || editor.hasInvalidPendingAggregate}
              onClick={() => void editor.save()}
            >
              {editor.saving ? t(copy.loading) : t(copy.saveProjectData)}
            </button>
          </div>
        </footer>
      ) : null}
    </section>
  );
}

function ReleaseEditor({
  release,
  index,
  onChange,
  onRemove
}: {
  release: ReleaseDraft;
  index: number;
  onChange: (index: number, patch: Partial<ReleaseDraft>) => void;
  onRemove: (index: number) => void;
}) {
  const { t } = usePreferences();
  return (
    <article className="project-data-page__release">
      <div className="project-data-page__release-head">
        <div>
          <strong>{release.version || `${t(copy.releases)} ${index + 1}`}</strong>
          <span className={`project-data-page__status project-data-page__status--${statusClass(release.status)}`}>{release.status}</span>
        </div>
        <button
          type="button"
          className="project-data-page__button project-data-page__button--icon project-data-page__button--danger"
          aria-label={t(copy.deleteRelease)}
          onClick={() => onRemove(index)}
        >
          🗑
        </button>
      </div>
      <div className="project-data-page__release-main">
        <label className="project-data-page__field"><span>{t(copy.version)} <RequiredMark /></span><input value={release.version} onChange={(e) => onChange(index, { version: e.target.value })} /></label>
        <label className="project-data-page__field"><span>{t(copy.releasedDate)} <RequiredMark /></span><input type="date" value={release.released_date} onChange={(e) => onChange(index, { released_date: e.target.value })} /></label>
        <label className="project-data-page__field">{t(copy.verifiedDate)}<input type="date" value={release.verified_date} onChange={(e) => onChange(index, { verified_date: e.target.value })} /></label>
        <label className="project-data-page__field"><span>{t(copy.status)} <RequiredMark /></span><select value={release.status} onChange={(e) => onChange(index, { status: e.target.value as ReleaseDraft['status'] })}>
          {RELEASE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select></label>
      </div>
      <div className="project-data-page__release-stats">
        <label className="project-data-page__field">{t(copy.testsPass)}<input min="0" type="number" value={release.tests_pass} onChange={(e) => onChange(index, { tests_pass: Number(e.target.value) })} /></label>
        <label className="project-data-page__field">{t(copy.testsFail)}<input min="0" type="number" value={release.tests_fail} onChange={(e) => onChange(index, { tests_fail: Number(e.target.value) })} /></label>
        <label className="project-data-page__field">{t(copy.testsNotTested)}<input min="0" type="number" value={release.tests_not_tested} onChange={(e) => onChange(index, { tests_not_tested: Number(e.target.value) })} /></label>
        <label className="project-data-page__field">{t(copy.issueCountA)}<input min="0" type="number" value={release.issue_count_a} onChange={(e) => onChange(index, { issue_count_a: Number(e.target.value) })} /></label>
        <label className="project-data-page__field">{t(copy.issueCountB)}<input min="0" type="number" value={release.issue_count_b} onChange={(e) => onChange(index, { issue_count_b: Number(e.target.value) })} /></label>
        <label className="project-data-page__field">{t(copy.issueCountC)}<input min="0" type="number" value={release.issue_count_c} onChange={(e) => onChange(index, { issue_count_c: Number(e.target.value) })} /></label>
      </div>
      <label className="project-data-page__field">{t(copy.releaseNotes)}<textarea value={release.release_notes} onChange={(e) => onChange(index, { release_notes: e.target.value })} /></label>
    </article>
  );
}

function NoteEditor({
  note,
  index,
  onChange,
  onRemove
}: {
  note: NoteDraft;
  index: number;
  onChange: (index: number, patch: Partial<NoteDraft>) => void;
  onRemove: (index: number) => void;
}) {
  const { t } = usePreferences();
  return (
    <div className="project-data-page__note-row">
      <label className="project-data-page__field project-data-page__field--priority"><span>{t(copy.priority)} <RequiredMark /></span><select value={note.priority} onChange={(e) => onChange(index, { priority: Number(e.target.value) as NoteDraft['priority'] })}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{t(copy[option.label])}</option>
          ))}
        </select></label>
      <label className="project-data-page__field"><span>{t(copy.note)} <RequiredMark /></span><input value={note.note_text} onChange={(e) => onChange(index, { note_text: e.target.value })} /></label>
      <button
        type="button"
        className="project-data-page__button project-data-page__button--icon project-data-page__button--danger"
        aria-label={t(copy.deleteNote)}
        onClick={() => onRemove(index)}
      >
        🗑
      </button>
    </div>
  );
}
