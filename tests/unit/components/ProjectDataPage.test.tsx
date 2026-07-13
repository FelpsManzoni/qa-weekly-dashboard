import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ProjectDataPage } from '../../../src/components/ProjectDataPage/ProjectDataPage';

let editorIsDirty = false;

beforeEach(() => {
  editorIsDirty = false;
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-09T12:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

const useWeeks = vi.fn(() => ({
  data: [
    { id: 'w1', week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }
  ],
  activeWeeks: [],
  refresh: vi.fn(),
  isLoading: false,
  error: null
}));

vi.mock('../../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    data: [{ id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }],
    activeProjects: [{ id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }],
    refresh: vi.fn(),
    isLoading: false,
    error: null
  })
}));

vi.mock('../../../src/hooks/useWeeks', () => ({
  useWeeks: () => useWeeks()
}));

vi.mock('../../../src/hooks/useProjectDataEditor', () => ({
  useProjectDataEditor: () => ({
    loading: false,
    error: null,
    saving: false,
    saveError: null,
    copying: false,
    copyMessage: null,
    isDirty: editorIsDirty,
    reported: 0,
    fixed: 0,
    issueEnabled: false,
    automated: 0,
    pending: 0,
    notAuto: 0,
    testEnabled: false,
    releases: [],
    notes: [{ id: 'n3', priority: 3, note_text: 'Low priority item', author: '' }],
    setReported: vi.fn(),
    setFixed: vi.fn(),
    setIssueEnabled: vi.fn(),
    setAutomated: vi.fn(),
    setPending: vi.fn(),
    setNotAuto: vi.fn(),
    setTestEnabled: vi.fn(),
    addRelease: vi.fn(),
    updateRelease: vi.fn(),
    removeRelease: vi.fn(),
    addNote: vi.fn(),
    updateNote: vi.fn(),
    removeNote: vi.fn(),
    copyFromPreviousWeek: vi.fn(),
    discardChanges: vi.fn(),
    save: vi.fn()
  })
}));

it('shows recent ISO weeks in Project Data even when the current week does not exist yet', () => {
  render(<ProjectDataPage />);

  expect(useWeeks).toHaveBeenCalledWith();
  expect(screen.getByRole('heading', { name: 'Quality Report Hub' })).toBeInTheDocument();
  expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument();
  expect(screen.getByRole('option', { name: /2026-W28/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /2026-W27/i })).toBeInTheDocument();
});

it('shows an unsaved changes pill in the Project Data header when the editor is dirty', () => {
  editorIsDirty = true;

  render(<ProjectDataPage />);

  expect(screen.getByRole('heading', { name: 'Quality Report Hub' })).toBeInTheDocument();
  expect(screen.getByText('Unsaved changes', { selector: '.project-data-page__change-pill' })).toBeInTheDocument();
});

it('shows the full P0-P3 priority display scale in Project Data notes', () => {
  render(<ProjectDataPage />);

  expect(screen.getByRole('option', { name: 'P0 · Critical' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'P1 · High' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'P2 · Medium' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'P3 · Low' })).toBeInTheDocument();
});
