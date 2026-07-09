import { useEffect, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useWeeks } from '../../hooks/useWeeks';
import { useProjectDataEditor, type NoteDraft, type ReleaseDraft } from '../../hooks/useProjectDataEditor';
import { usePreferences } from '../../hooks/usePreferences';
import { copy } from '../../utils/copy';
import { EmptyState } from '../EmptyState/EmptyState';
import { RELEASE_STATUSES } from '../../types';
import './ProjectDataPage.css';

export function ProjectDataPage() {
  const { t } = usePreferences();
  const projects = useProjects();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [weekId, setWeekId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId && projects.activeProjects.length) {
      setProjectId(projects.activeProjects[0].id);
    }
  }, [projects.activeProjects, projectId]);

  const weeks = useWeeks(projectId);

  useEffect(() => {
    if (weeks.data.length && !weeks.data.some((w) => w.id === weekId)) {
      setWeekId(weeks.data[0].id);
    }
    if (!weeks.data.length) {
      setWeekId(null);
    }
  }, [weeks.data, weekId]);

  const editor = useProjectDataEditor(weekId, projectId);

  if (!projectId || !weekId) {
    return (
      <section className="project-data-page">
        <h2 className="section-heading">{t(copy.projectData)}</h2>
        <EmptyState title={t(copy.projectData)} body={t(copy.noWeeks)} />
      </section>
    );
  }

  return (
    <section className="project-data-page">
      <h2 className="section-heading">{t(copy.projectData)}</h2>

      <div className="project-data-page__selectors">
        <label>
          {t(copy.selectProject)}
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            {projects.activeProjects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </label>
        <label>
          {t(copy.selectWeek)}
          <select value={weekId} onChange={(e) => setWeekId(e.target.value)}>
            {weeks.data.map((week) => (
              <option key={week.id} value={week.id}>{`${t(copy.weeks)} ${week.week_number}`}</option>
            ))}
          </select>
        </label>
      </div>

      {editor.loading ? <p className="project-data-page__hint">{t(copy.loading)}</p> : null}
      {editor.error ? <div className="maintenance-form__error">{editor.error}</div> : null}

      <div className="project-data-page__sections">
        <fieldset className="project-data-page__section">
          <legend>{t(copy.issueHistory)}</legend>
          <label className="project-data-page__inline">
            <input
              type="checkbox"
              checked={editor.issueEnabled}
              onChange={(e) => editor.setIssueEnabled(e.target.checked)}
            />
            {t(copy.active)}
          </label>
          {editor.issueEnabled ? (
            <div className="project-data-page__grid">
              <label>{t(copy.reported)}<input type="number" value={editor.reported} onChange={(e) => editor.setReported(Number(e.target.value))} /></label>
              <label>{t(copy.fixed)}<input type="number" value={editor.fixed} onChange={(e) => editor.setFixed(Number(e.target.value))} /></label>
            </div>
          ) : null}
        </fieldset>

        <fieldset className="project-data-page__section">
          <legend>{t(copy.testCaseDistribution)}</legend>
          <label className="project-data-page__inline">
            <input
              type="checkbox"
              checked={editor.testEnabled}
              onChange={(e) => editor.setTestEnabled(e.target.checked)}
            />
            {t(copy.active)}
          </label>
          {editor.testEnabled ? (
            <div className="project-data-page__grid">
              <label>{t(copy.formAutomated)}<input type="number" value={editor.automated} onChange={(e) => editor.setAutomated(Number(e.target.value))} /></label>
              <label>{t(copy.formPending)}<input type="number" value={editor.pending} onChange={(e) => editor.setPending(Number(e.target.value))} /></label>
              <label>{t(copy.formNotAutomated)}<input type="number" value={editor.notAuto} onChange={(e) => editor.setNotAuto(Number(e.target.value))} /></label>
            </div>
          ) : null}
        </fieldset>

        <fieldset className="project-data-page__section">
          <legend>{t(copy.releases)}</legend>
          <button type="button" className="dashboard-header__refresh" onClick={editor.addRelease}>
            {t(copy.newRecord)}
          </button>
          {editor.releases.map((release, index) => (
            <ReleaseEditor
              key={release.id ?? `new-${index}`}
              release={release}
              index={index}
              onChange={editor.updateRelease}
              onRemove={editor.removeRelease}
            />
          ))}
        </fieldset>

        <fieldset className="project-data-page__section">
          <legend>{t(copy.notes)}</legend>
          <button type="button" className="dashboard-header__refresh" onClick={editor.addNote}>
            {t(copy.newRecord)}
          </button>
          {editor.notes.map((note, index) => (
            <NoteEditor
              key={note.id ?? `new-${index}`}
              note={note}
              index={index}
              onChange={editor.updateNote}
              onRemove={editor.removeNote}
            />
          ))}
        </fieldset>
      </div>

      {editor.saveError ? <div className="maintenance-form__error">{editor.saveError}</div> : null}
      <div className="project-data-page__actions">
        <button type="button" className="maintenance-form__primary" disabled={editor.saving} onClick={() => void editor.save()}>
          {t(copy.save)}
        </button>
      </div>
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
    <div className="project-data-page__item">
      <div className="project-data-page__grid">
        <label>{t(copy.version)}<input value={release.version} onChange={(e) => onChange(index, { version: e.target.value })} /></label>
        <label>{t(copy.date)}<input type="date" value={release.date} onChange={(e) => onChange(index, { date: e.target.value })} /></label>
        <label>{t(copy.status)}<select value={release.status} onChange={(e) => onChange(index, { status: e.target.value as ReleaseDraft['status'] })}>
          {RELEASE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select></label>
      </div>
      <div className="project-data-page__grid">
        <label>{t(copy.issueCountA)}<input type="number" value={release.issue_count_a} onChange={(e) => onChange(index, { issue_count_a: Number(e.target.value) })} /></label>
        <label>{t(copy.issueCountB)}<input type="number" value={release.issue_count_b} onChange={(e) => onChange(index, { issue_count_b: Number(e.target.value) })} /></label>
        <label>{t(copy.issueCountC)}<input type="number" value={release.issue_count_c} onChange={(e) => onChange(index, { issue_count_c: Number(e.target.value) })} /></label>
      </div>
      <label>{t(copy.releaseNotes)}<textarea value={release.release_notes} onChange={(e) => onChange(index, { release_notes: e.target.value })} /></label>
      <button type="button" className="maintenance-form__secondary" onClick={() => onRemove(index)}>{t(copy.cancel)}</button>
    </div>
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
    <div className="project-data-page__item">
      <div className="project-data-page__grid">
        <label>{t(copy.priority)}<select value={note.priority} onChange={(e) => onChange(index, { priority: Number(e.target.value) as 0 | 1 | 2 })}>
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select></label>
        <label>{t(copy.author)}<input value={note.author} onChange={(e) => onChange(index, { author: e.target.value })} /></label>
      </div>
      <label>{t(copy.note)}<textarea value={note.note_text} onChange={(e) => onChange(index, { note_text: e.target.value })} /></label>
      <button type="button" className="maintenance-form__secondary" onClick={() => onRemove(index)}>{t(copy.cancel)}</button>
    </div>
  );
}
