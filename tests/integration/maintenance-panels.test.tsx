import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../src/App';

const week = { id: 'w1', week_number: 27, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true };
const project = { id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', display_order: 1, is_active: true };

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'u1', username: 'qa', email: 'qa@example.com', display_name: 'QA Lead' },
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
  })
}));

vi.mock('../../src/hooks/useWeeks', () => ({
  useWeeks: () => ({ data: [week], activeWeeks: [week], refresh: vi.fn(), isLoading: false, error: null })
}));
vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({ data: [project], activeProjects: [project], refresh: vi.fn(), isLoading: false, error: null })
}));
vi.mock('../../src/hooks/useIssueHistory', () => ({
  useIssueHistory: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null })
}));
vi.mock('../../src/hooks/useTestCaseDistribution', () => ({
  useTestCaseDistribution: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null })
}));
vi.mock('../../src/hooks/useReleases', () => ({
  useReleases: () => ({
    data: [{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v2.0', date: '2026-07-03', status: 'Ready', critical_issues: '', changelog: '' }],
    refresh: vi.fn(),
    isLoading: false,
    error: null
  })
}));
vi.mock('../../src/hooks/useNotes', () => ({
  useNotes: () => ({
    data: [{ id: 'n1', week_id: 'w1', project_id: 'p1', priority: 1, note_text: 'Watch smoke suite', author: null }],
    refresh: vi.fn(),
    isLoading: false,
    error: null
  })
}));
vi.mock('../../src/hooks/useEditLock', () => ({
  useEditLock: () => ({ lock: null, error: null, acquire: vi.fn(), release: vi.fn() })
}));

it('shows the signed-in user and a working record picker for notes and releases', () => {
  render(<App />);

  // Header shows the authenticated display name and a sign-out control.
  expect(screen.getByText('QA Lead')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sign out/i })).toBeInTheDocument();

  // Switch to the releases panel and pick the existing release from the record picker.
  fireEvent.click(screen.getByRole('button', { name: /Manage releases/i }));
  const releasePicker = screen.getByLabelText(/Edit release/i);
  fireEvent.change(releasePicker, { target: { value: 'r1' } });
  expect(screen.getByLabelText(/Version/i)).toHaveValue('v2.0');

  // Switch to the notes panel and pick the existing note.
  fireEvent.click(screen.getByRole('button', { name: /Manage notes/i }));
  const notePicker = screen.getByLabelText(/Edit note/i);
  fireEvent.change(notePicker, { target: { value: 'n1' } });
  expect(screen.getByLabelText(/^Note$/i)).toHaveValue('Watch smoke suite');
});
