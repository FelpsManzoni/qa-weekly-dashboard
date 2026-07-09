import { useEffect, useState, type FormEvent } from 'react';
import { saveProject } from '../api/projects';
import { saveWeek } from '../api/weeks';
import { saveIssueMetric } from '../api/issues';
import { saveTestCaseDistribution } from '../api/testCases';
import { saveRelease } from '../api/releases';
import { saveNote } from '../api/notes';
import { copy, maintenanceTitles } from '../utils/copy';
import { usePreferences } from '../hooks/usePreferences';
import { validateNote, validateProject, validateWeek, requireNonNegative } from '../utils/validation';
import { useEditLock } from '../hooks/useEditLock';
import { useUsers } from '../hooks/useUsers';
import type { IssueMetric, PriorityNote, Project, ReleaseStatus, ReleaseVersion, TestCaseDistribution, Week } from '../types';
import { RELEASE_STATUSES } from '../types';
import './shared/Form.css';

type SaveHandler = () => void;

function FormActions({ onCancel }: { onCancel: () => void }) {
  const { t } = usePreferences();

  return (
    <div className="maintenance-form__actions">
      <button className="maintenance-form__primary" type="submit">
        {t(copy.save)}
      </button>
      <button className="maintenance-form__secondary" onClick={onCancel} type="button">
        {t(copy.cancel)}
      </button>
    </div>
  );
}

function LockNotice({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return <div className="maintenance-form__lock">{message}</div>;
}

// Shared edit-lock message: shows the "locked by another editor" error, otherwise the
// expiry hint while this user holds the lock.
function lockMessage(lock: { error: string | null; lock: unknown }, t: (text: typeof copy.lockExpires) => string): string | null {
  return lock.error || (lock.lock ? t(copy.lockExpires) : null);
}

export function WeekForm({ selected, onSaved }: { selected: Week | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ week_number: 27, start_date: '', end_date: '', is_active: true });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('weeks', selected?.id ?? null, Boolean(selected?.id));
  const { t } = usePreferences();

  useEffect(() => {
    if (selected) {
      setValues(selected);
    }
  }, [selected]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.error) return setError(lock.error);
    const validation = validateWeek(values as Week);
    if (validation) return setError(validation);
    const response = await saveWeek({ ...selected, ...values });
    setError(response.error?.message ?? null);
    if (!response.error) {
      await lock.release();
      onSaved();
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit}>
      <div className="section-heading">{t(maintenanceTitles.weeks)}</div>
      <LockNotice message={lockMessage(lock, t)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>{t(copy.weekNumber)}<input type="number" value={values.week_number} onChange={(e) => setValues({ ...values, week_number: Number(e.target.value) })} /></label>
        <label>{t(copy.startDate)}<input type="date" value={values.start_date} onChange={(e) => setValues({ ...values, start_date: e.target.value })} /></label>
        <label>{t(copy.endDate)}<input type="date" value={values.end_date} onChange={(e) => setValues({ ...values, end_date: e.target.value })} /></label>
      </div>
      <label><input checked={values.is_active} type="checkbox" onChange={(e) => setValues({ ...values, is_active: e.target.checked })} />  {t(copy.active)}</label>
      <FormActions onCancel={() => { if (selected) setValues(selected); void lock.release(); }} />
    </form>
  );
}

export function ProjectForm({ selected, onSaved }: { selected: Project | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ code: '', name: '', description: '', client: '', main_technology_scope: '', lead_qa_user_id: '', display_order: 1, is_active: true });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('projects', selected?.id ?? null, Boolean(selected?.id));
  const { t } = usePreferences();
  const users = useUsers();

  useEffect(() => {
    if (selected) {
      setValues({
        code: selected.code,
        name: selected.name,
        description: selected.description ?? '',
        client: selected.client ?? '',
        main_technology_scope: selected.main_technology_scope ?? '',
        lead_qa_user_id: selected.lead_qa_user_id ?? '',
        display_order: selected.display_order,
        is_active: selected.is_active
      });
    }
  }, [selected]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.error) return setError(lock.error);
    const validation = validateProject(values as Project);
    if (validation) return setError(validation);
    const payload: Partial<Project> = {
      ...selected,
      code: values.code,
      name: values.name,
      description: values.description || null,
      client: values.client || null,
      main_technology_scope: values.main_technology_scope || null,
      lead_qa_user_id: values.lead_qa_user_id || null,
      display_order: values.display_order,
      is_active: values.is_active
    };
    const response = await saveProject(payload);
    setError(response.error?.message ?? null);
    if (!response.error) {
      await lock.release();
      onSaved();
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit}>
      <div className="section-heading">{t(maintenanceTitles.projects)}</div>
      <LockNotice message={lockMessage(lock, t)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>{t(copy.code)}<input value={values.code} onChange={(e) => setValues({ ...values, code: e.target.value.toUpperCase() })} /></label>
        <label>{t(copy.name)}<input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></label>
        <label>{t(copy.order)}<input type="number" value={values.display_order} onChange={(e) => setValues({ ...values, display_order: Number(e.target.value) })} /></label>
      </div>
      <label>{t(copy.description)}<textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} /></label>
      <label>{t(copy.leadQa)}<select value={values.lead_qa_user_id} onChange={(e) => setValues({ ...values, lead_qa_user_id: e.target.value })}>
        <option value="">{t(copy.selectProject)}</option>
        {users.data.map((user) => (
          <option key={user.id} value={user.id}>{user.display_name || user.username}</option>
        ))}
      </select></label>
      <div className="maintenance-form__grid">
        <label>{t(copy.client)}<input value={values.client} onChange={(e) => setValues({ ...values, client: e.target.value })} /></label>
        <label>{t(copy.mainTechScope)}<input value={values.main_technology_scope} onChange={(e) => setValues({ ...values, main_technology_scope: e.target.value })} /></label>
      </div>
      <label className="maintenance-form__checkbox"><input type="checkbox" checked={values.is_active} onChange={(e) => setValues({ ...values, is_active: e.target.checked })} /> {t(copy.active)}</label>
      <FormActions onCancel={() => { if (selected) setValues({ ...selected, description: selected.description ?? '', client: selected.client ?? '', main_technology_scope: selected.main_technology_scope ?? '', lead_qa_user_id: selected.lead_qa_user_id ?? '' }); void lock.release(); }} />
    </form>
  );
}

export function IssueMetricForm({ weekId, projectId, selected, onSaved }: { weekId: string | null; projectId: string | null; selected: IssueMetric | null; onSaved: SaveHandler }) {
  const [reported, setReported] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('issue_metrics', selected?.id ?? null, Boolean(selected?.id));
  const { t } = usePreferences();

  useEffect(() => {
    setReported(selected?.reported_count ?? 0);
    setFixed(selected?.fixed_count ?? 0);
  }, [selected]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.error) return setError(lock.error);
    const validation = requireNonNegative(reported, 'Reported count') ?? requireNonNegative(fixed, 'Fixed count');
    if (validation) return setError(validation);
    if (!weekId || !projectId) return setError('Select week and project first.');
    const response = await saveIssueMetric({ id: selected?.id ?? '', week_id: weekId, project_id: projectId, reported_count: reported, fixed_count: fixed });
    setError(response.error?.message ?? null);
    if (!response.error) {
      await lock.release();
      onSaved();
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit}>
      <div className="section-heading">{t(maintenanceTitles.issues)}</div>
      <LockNotice message={lockMessage(lock, t)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>{t(copy.reported)}<input type="number" value={reported} onChange={(e) => setReported(Number(e.target.value))} /></label>
        <label>{t(copy.fixed)}<input type="number" value={fixed} onChange={(e) => setFixed(Number(e.target.value))} /></label>
      </div>
      <FormActions onCancel={() => { setReported(selected?.reported_count ?? 0); setFixed(selected?.fixed_count ?? 0); void lock.release(); }} />
    </form>
  );
}

export function TestCaseDistributionForm({ weekId, projectId, selected, onSaved }: { weekId: string | null; projectId: string | null; selected: TestCaseDistribution | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ automated_count: 0, pending_auto_count: 0, not_auto_count: 0 });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('test_case_distributions', selected?.id ?? null, Boolean(selected?.id));
  const { t } = usePreferences();

  useEffect(() => {
    setValues({
      automated_count: selected?.automated_count ?? 0,
      pending_auto_count: selected?.pending_auto_count ?? 0,
      not_auto_count: selected?.not_auto_count ?? 0
    });
  }, [selected]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.error) return setError(lock.error);
    const validation = requireNonNegative(values.automated_count, 'Automated count') || requireNonNegative(values.pending_auto_count, 'Pending automation count') || requireNonNegative(values.not_auto_count, 'Not automated count');
    if (validation) return setError(validation);
    if (!weekId || !projectId) return setError('Select week and project first.');
    const response = await saveTestCaseDistribution({ id: selected?.id ?? '', week_id: weekId, project_id: projectId, ...values });
    setError(response.error?.message ?? null);
    if (!response.error) {
      await lock.release();
      onSaved();
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit}>
      <div className="section-heading">{t(maintenanceTitles['test-cases'])}</div>
      <LockNotice message={lockMessage(lock, t)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>{t(copy.formAutomated)}<input type="number" value={values.automated_count} onChange={(e) => setValues({ ...values, automated_count: Number(e.target.value) })} /></label>
        <label>{t(copy.formPending)}<input type="number" value={values.pending_auto_count} onChange={(e) => setValues({ ...values, pending_auto_count: Number(e.target.value) })} /></label>
        <label>{t(copy.formNotAutomated)}<input type="number" value={values.not_auto_count} onChange={(e) => setValues({ ...values, not_auto_count: Number(e.target.value) })} /></label>
      </div>
      <FormActions onCancel={() => { setValues({ automated_count: selected?.automated_count ?? 0, pending_auto_count: selected?.pending_auto_count ?? 0, not_auto_count: selected?.not_auto_count ?? 0 }); void lock.release(); }} />
    </form>
  );
}

export function ReleaseForm({ weekId, projectId, selected, onSaved }: { weekId: string | null; projectId: string | null; selected: ReleaseVersion | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({
    version: '',
    date: '',
    status: 'Approved' as ReleaseStatus,
    issue_count_a: 0,
    issue_count_b: 0,
    issue_count_c: 0,
    release_notes: ''
  });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('release_versions', selected?.id ?? null, Boolean(selected?.id));
  const { t } = usePreferences();

  useEffect(() => {
    if (selected) {
      setValues({
        version: selected.version,
        date: selected.date,
        status: selected.status,
        issue_count_a: selected.issue_count_a,
        issue_count_b: selected.issue_count_b,
        issue_count_c: selected.issue_count_c,
        release_notes: selected.release_notes ?? ''
      });
    } else {
      setValues({ version: '', date: '', status: 'Approved', issue_count_a: 0, issue_count_b: 0, issue_count_c: 0, release_notes: '' });
    }
  }, [selected]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.error) return setError(lock.error);
    if (!weekId || !projectId) return setError('Select week and project first.');
    const response = await saveRelease({ id: selected?.id, week_id: weekId, project_id: projectId, ...values });
    setError(response.error?.message ?? null);
    if (!response.error) {
      await lock.release();
      onSaved();
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit}>
      <div className="section-heading">{t(maintenanceTitles.releases)}</div>
      <LockNotice message={lockMessage(lock, t)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>{t(copy.version)}<input value={values.version} onChange={(e) => setValues({ ...values, version: e.target.value })} /></label>
        <label>{t(copy.date)}<input type="date" value={values.date} onChange={(e) => setValues({ ...values, date: e.target.value })} /></label>
        <label>{t(copy.status)}<select value={values.status} onChange={(e) => setValues({ ...values, status: e.target.value as ReleaseStatus })}>
          {RELEASE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select></label>
      </div>
      <div className="maintenance-form__grid">
        <label>{t(copy.issueCountA)}<input type="number" value={values.issue_count_a} onChange={(e) => setValues({ ...values, issue_count_a: Number(e.target.value) })} /></label>
        <label>{t(copy.issueCountB)}<input type="number" value={values.issue_count_b} onChange={(e) => setValues({ ...values, issue_count_b: Number(e.target.value) })} /></label>
        <label>{t(copy.issueCountC)}<input type="number" value={values.issue_count_c} onChange={(e) => setValues({ ...values, issue_count_c: Number(e.target.value) })} /></label>
      </div>
      <label>{t(copy.releaseNotes)}<textarea value={values.release_notes} onChange={(e) => setValues({ ...values, release_notes: e.target.value })} /></label>
      <FormActions onCancel={() => void lock.release()} />
    </form>
  );
}

export function NoteForm({ weekId, projectId, selected, onSaved }: { weekId: string | null; projectId: string | null; selected: PriorityNote | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ priority: 0 as 0 | 1 | 2, note_text: '', author: '' });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('notes', selected?.id ?? null, Boolean(selected?.id));
  const { t } = usePreferences();

  useEffect(() => {
    if (selected) {
      setValues({ priority: selected.priority, note_text: selected.note_text, author: selected.author ?? '' });
    } else {
      setValues({ priority: 0, note_text: '', author: '' });
    }
  }, [selected]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.error) return setError(lock.error);
    const validation = validateNote(values);
    if (validation) return setError(validation);
    if (!weekId || !projectId) return setError('Select week and project first.');
    const response = await saveNote({ id: selected?.id, week_id: weekId, project_id: projectId, ...values });
    setError(response.error?.message ?? null);
    if (!response.error) {
      await lock.release();
      onSaved();
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit}>
      <div className="section-heading">{t(maintenanceTitles.notes)}</div>
      <LockNotice message={lockMessage(lock, t)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>{t(copy.priority)}<select value={values.priority} onChange={(e) => setValues({ ...values, priority: Number(e.target.value) as 0 | 1 | 2 })}><option value={0}>0</option><option value={1}>1</option><option value={2}>2</option></select></label>
        <label>{t(copy.author)}<input value={values.author} onChange={(e) => setValues({ ...values, author: e.target.value })} /></label>
      </div>
      <label>{t(copy.note)}<textarea value={values.note_text} onChange={(e) => setValues({ ...values, note_text: e.target.value })} /></label>
      <FormActions onCancel={() => void lock.release()} />
    </form>
  );
}
