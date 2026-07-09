import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { WeekForm, NoteForm, ReleaseForm, IssueMetricForm } from '../../../src/components/forms';

const saveWeek = vi.fn();
const saveNote = vi.fn();
const saveRelease = vi.fn();
const saveIssueMetric = vi.fn();

vi.mock('../../../src/api/weeks', () => ({ saveWeek: (...a: unknown[]) => saveWeek(...a) }));
vi.mock('../../../src/api/notes', () => ({ saveNote: (...a: unknown[]) => saveNote(...a) }));
vi.mock('../../../src/api/releases', () => ({ saveRelease: (...a: unknown[]) => saveRelease(...a) }));
vi.mock('../../../src/api/issues', () => ({ saveIssueMetric: (...a: unknown[]) => saveIssueMetric(...a) }));

let lockValue: { lock: unknown; error: string | null; acquire: () => void; release: () => void };
vi.mock('../../../src/hooks/useEditLock', () => ({ useEditLock: () => lockValue }));

beforeEach(() => {
  vi.clearAllMocks();
  lockValue = { lock: null, error: null, acquire: vi.fn(), release: vi.fn() };
  saveWeek.mockResolvedValue({ data: { id: 'w1' }, error: null });
  saveNote.mockResolvedValue({ data: { id: 'n1' }, error: null });
  saveRelease.mockResolvedValue({ data: { id: 'r1' }, error: null });
  saveIssueMetric.mockResolvedValue({ data: { id: 'i1' }, error: null });
});

const release = { id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v2.0', date: '2026-07-03', status: 'Ready', critical_issues: '', changelog: '' };

it('blocks save and shows a validation error for invalid week dates', async () => {
  render(<WeekForm selected={null} onSaved={vi.fn()} />);
  fireEvent.change(screen.getByLabelText(/Week number/i), { target: { value: '27' } });
  fireEvent.change(screen.getByLabelText(/Start date/i), { target: { value: '2026-07-10' } });
  fireEvent.change(screen.getByLabelText(/End date/i), { target: { value: '2026-07-01' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));
  await waitFor(() => expect(screen.getByText(/after start date/i)).toBeInTheDocument());
  expect(saveWeek).not.toHaveBeenCalled();
});

it('blocks save when the record is locked by another editor', async () => {
  lockValue = { lock: null, error: 'Record locked for editing / Registro bloqueado', acquire: vi.fn(), release: vi.fn() };
  render(<NoteForm weekId="w1" projectId="p1" selected={{ id: 'n1', week_id: 'w1', project_id: 'p1', priority: 1, note_text: 'existing', author: null }} onSaved={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));
  await waitFor(() => expect(screen.getAllByText(/Record locked/i).length).toBeGreaterThan(0));
  expect(saveNote).not.toHaveBeenCalled();
});

it('requires week and project before saving issue metrics', async () => {
  render(<IssueMetricForm weekId={null} projectId={null} selected={null} onSaved={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));
  await waitFor(() => expect(screen.getByText(/Select week and project/i)).toBeInTheDocument());
  expect(saveIssueMetric).not.toHaveBeenCalled();
});

it('surfaces a save error and does not call onSaved', async () => {
  saveNote.mockResolvedValue({ data: null, error: { message: 'DB down', code: 'X' } });
  const onSaved = vi.fn();
  render(<NoteForm weekId="w1" projectId="p1" selected={null} onSaved={onSaved} />);
  fireEvent.change(screen.getByLabelText(/^Note$/i), { target: { value: 'hello' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));
  await waitFor(() => expect(screen.getByText(/DB down/i)).toBeInTheDocument());
  expect(onSaved).not.toHaveBeenCalled();
});

it('hydrates from a selected record and saves an edit', async () => {
  const onSaved = vi.fn();
  render(<ReleaseForm weekId="w1" projectId="p1" selected={release} onSaved={onSaved} />);
  expect(screen.getByLabelText(/Version/i)).toHaveValue('v2.0');
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));
  await waitFor(() => expect(onSaved).toHaveBeenCalled());
  expect(saveRelease).toHaveBeenCalled();
});
