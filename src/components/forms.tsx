import { useEffect, useState, type FormEvent } from 'react';
import { saveProject } from '../api/projects';
import { saveWeek } from '../api/weeks';
import { saveIssueMetric } from '../api/issues';
import { saveTestCaseDistribution } from '../api/testCases';
import { saveRelease } from '../api/releases';
import { saveNote } from '../api/notes';
import { bilingualText, copy } from '../utils/copy';
import { validateNote, validateProject, validateWeek, requireNonNegative } from '../utils/validation';
import { useEditLock } from '../hooks/useEditLock';
import type { IssueMetric, PriorityNote, Project, ReleaseVersion, TestCaseDistribution, Week } from '../types';
import './shared/Form.css';

type SaveHandler = () => void;

function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="maintenance-form__actions">
      <button className="maintenance-form__primary" type="submit">
        {bilingualText(copy.save)}
      </button>
      <button className="maintenance-form__secondary" onClick={onCancel} type="button">
        {bilingualText(copy.cancel)}
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
function lockMessage(lock: { error: string | null; lock: unknown }): string | null {
  return lock.error || (lock.lock ? bilingualText(copy.lockExpires) : null);
}

export function WeekForm({ selected, onSaved }: { selected: Week | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ week_number: 27, start_date: '', end_date: '', is_active: true });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('weeks', selected?.id ?? null, Boolean(selected?.id));

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
      <div className="section-heading">Manage weeks / Gerenciar semanas</div>
      <LockNotice message={lockMessage(lock)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>Week number / Numero da semana<input type="number" value={values.week_number} onChange={(e) => setValues({ ...values, week_number: Number(e.target.value) })} /></label>
        <label>Start date / Data inicial<input type="date" value={values.start_date} onChange={(e) => setValues({ ...values, start_date: e.target.value })} /></label>
        <label>End date / Data final<input type="date" value={values.end_date} onChange={(e) => setValues({ ...values, end_date: e.target.value })} /></label>
      </div>
      <label><input checked={values.is_active} type="checkbox" onChange={(e) => setValues({ ...values, is_active: e.target.checked })} /> Active / Ativa</label>
      <FormActions onCancel={() => { if (selected) setValues(selected); void lock.release(); }} />
    </form>
  );
}

export function ProjectForm({ selected, onSaved }: { selected: Project | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ code: '', name: '', description: '', display_order: 1, is_active: true });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('projects', selected?.id ?? null, Boolean(selected?.id));

  useEffect(() => {
    if (selected) setValues({ ...selected, description: selected.description ?? '' });
  }, [selected]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.error) return setError(lock.error);
    const validation = validateProject(values as Project);
    if (validation) return setError(validation);
    const response = await saveProject({ ...selected, ...values });
    setError(response.error?.message ?? null);
    if (!response.error) {
      await lock.release();
      onSaved();
    }
  };

  return (
    <form className="maintenance-form" onSubmit={handleSubmit}>
      <div className="section-heading">Manage projects / Gerenciar projetos</div>
      <LockNotice message={lockMessage(lock)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>Code / Codigo<input value={values.code} onChange={(e) => setValues({ ...values, code: e.target.value.toUpperCase() })} /></label>
        <label>Name / Nome<input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></label>
        <label>Order / Ordem<input type="number" value={values.display_order} onChange={(e) => setValues({ ...values, display_order: Number(e.target.value) })} /></label>
      </div>
      <label>Description / Descricao<textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} /></label>
      <FormActions onCancel={() => { if (selected) setValues({ ...selected, description: selected.description ?? '' }); void lock.release(); }} />
    </form>
  );
}

export function IssueMetricForm({ weekId, projectId, selected, onSaved }: { weekId: string | null; projectId: string | null; selected: IssueMetric | null; onSaved: SaveHandler }) {
  const [reported, setReported] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('issue_metrics', selected?.id ?? null, Boolean(selected?.id));

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
      <div className="section-heading">Manage issue metrics / Gerenciar metricas de issues</div>
      <LockNotice message={lockMessage(lock)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>Reported / Reportadas<input type="number" value={reported} onChange={(e) => setReported(Number(e.target.value))} /></label>
        <label>Fixed / Corrigidas<input type="number" value={fixed} onChange={(e) => setFixed(Number(e.target.value))} /></label>
      </div>
      <FormActions onCancel={() => { setReported(selected?.reported_count ?? 0); setFixed(selected?.fixed_count ?? 0); void lock.release(); }} />
    </form>
  );
}

export function TestCaseDistributionForm({ weekId, projectId, selected, onSaved }: { weekId: string | null; projectId: string | null; selected: TestCaseDistribution | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ automated_count: 0, pending_auto_count: 0, not_auto_count: 0 });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('test_case_distributions', selected?.id ?? null, Boolean(selected?.id));

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
      <div className="section-heading">Manage test coverage / Gerenciar cobertura de testes</div>
      <LockNotice message={lockMessage(lock)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>Automated / Automatizados<input type="number" value={values.automated_count} onChange={(e) => setValues({ ...values, automated_count: Number(e.target.value) })} /></label>
        <label>Pending / Pendentes<input type="number" value={values.pending_auto_count} onChange={(e) => setValues({ ...values, pending_auto_count: Number(e.target.value) })} /></label>
        <label>Not automated / Nao automatizados<input type="number" value={values.not_auto_count} onChange={(e) => setValues({ ...values, not_auto_count: Number(e.target.value) })} /></label>
      </div>
      <FormActions onCancel={() => { setValues({ automated_count: selected?.automated_count ?? 0, pending_auto_count: selected?.pending_auto_count ?? 0, not_auto_count: selected?.not_auto_count ?? 0 }); void lock.release(); }} />
    </form>
  );
}

export function ReleaseForm({ weekId, projectId, selected, onSaved }: { weekId: string | null; projectId: string | null; selected: ReleaseVersion | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ version: '', date: '', status: '', critical_issues: '', changelog: '' });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('release_versions', selected?.id ?? null, Boolean(selected?.id));

  useEffect(() => {
    if (selected) {
      setValues({
        version: selected.version,
        date: selected.date,
        status: selected.status,
        critical_issues: selected.critical_issues ?? '',
        changelog: selected.changelog ?? ''
      });
    } else {
      setValues({ version: '', date: '', status: '', critical_issues: '', changelog: '' });
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
      <div className="section-heading">Manage releases / Gerenciar releases</div>
      <LockNotice message={lockMessage(lock)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>Version / Versao<input value={values.version} onChange={(e) => setValues({ ...values, version: e.target.value })} /></label>
        <label>Date / Data<input type="date" value={values.date} onChange={(e) => setValues({ ...values, date: e.target.value })} /></label>
        <label>Status<input value={values.status} onChange={(e) => setValues({ ...values, status: e.target.value })} /></label>
      </div>
      <label>Critical issues / Issues criticas<textarea value={values.critical_issues} onChange={(e) => setValues({ ...values, critical_issues: e.target.value })} /></label>
      <label>Changelog<textarea value={values.changelog} onChange={(e) => setValues({ ...values, changelog: e.target.value })} /></label>
      <FormActions onCancel={() => void lock.release()} />
    </form>
  );
}

export function NoteForm({ weekId, projectId, selected, onSaved }: { weekId: string | null; projectId: string | null; selected: PriorityNote | null; onSaved: SaveHandler }) {
  const [values, setValues] = useState({ priority: 0 as 0 | 1 | 2, note_text: '', author: '' });
  const [error, setError] = useState<string | null>(null);
  const lock = useEditLock('notes', selected?.id ?? null, Boolean(selected?.id));

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
      <div className="section-heading">Manage notes / Gerenciar notas</div>
      <LockNotice message={lockMessage(lock)} />
      {error ? <div className="maintenance-form__error">{error}</div> : null}
      <div className="maintenance-form__grid">
        <label>Priority / Prioridade<select value={values.priority} onChange={(e) => setValues({ ...values, priority: Number(e.target.value) as 0 | 1 | 2 })}><option value={0}>0</option><option value={1}>1</option><option value={2}>2</option></select></label>
        <label>Author / Autor<input value={values.author} onChange={(e) => setValues({ ...values, author: e.target.value })} /></label>
      </div>
      <label>Note / Nota<textarea value={values.note_text} onChange={(e) => setValues({ ...values, note_text: e.target.value })} /></label>
      <FormActions onCancel={() => void lock.release()} />
    </form>
  );
}
