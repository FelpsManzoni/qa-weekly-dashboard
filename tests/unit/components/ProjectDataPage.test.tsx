import { render, screen } from '@testing-library/react';
import { ProjectDataPage } from '../../../src/components/ProjectDataPage/ProjectDataPage';

beforeEach(() => {
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
    reported: 0,
    fixed: 0,
    issueEnabled: false,
    automated: 0,
    pending: 0,
    notAuto: 0,
    testEnabled: false,
    releases: [],
    notes: [],
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
    save: vi.fn()
  })
}));

it('shows recent ISO weeks in Project Data even when the current week does not exist yet', async () => {
  render(<ProjectDataPage />);

  expect(useWeeks).toHaveBeenCalledWith();
  expect(await screen.findByRole('option', { name: /2026-W28/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /2026-W27/i })).toBeInTheDocument();
});
