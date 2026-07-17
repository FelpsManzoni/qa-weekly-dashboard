import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../src/App';

const useIssueHistory = vi.fn<
  (projectId: string | null, selectedWeekId?: string | null, rangeWeeks?: 5 | 10) => {
    data: [];
    refresh: ReturnType<typeof vi.fn>;
    isLoading: false;
    error: null;
  }
>(() => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }));

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'u1', username: 'qa', email: 'qa@example.com', display_name: 'QA' },
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
  })
}));

vi.mock('../../src/hooks/useWeeks', () => ({
  useWeeks: () => ({
    data: [{ id: 'w1', week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }],
    activeWeeks: [{ id: 'w1', week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }],
    refresh: vi.fn(),
    isLoading: false,
    error: null
  })
}));

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    data: [{ id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }],
    activeProjects: [{ id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }],
    refresh: vi.fn(),
    isLoading: false,
    error: null
  })
}));

vi.mock('../../src/hooks/useIssueHistory', () => ({
  useIssueHistory: (projectId: string | null, selectedWeekId?: string | null, rangeWeeks?: 5 | 10) =>
    useIssueHistory(projectId, selectedWeekId, rangeWeeks)
}));
vi.mock('../../src/hooks/useTestCaseDistribution', () => ({ useTestCaseDistribution: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));
vi.mock('../../src/hooks/useReleases', () => ({ useReleases: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));
vi.mock('../../src/hooks/useNotes', () => ({ useNotes: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));

it('renders the filter flow', async () => {
  render(<App />);
  expect(screen.getByRole('tab', { name: /Weekly report/i })).toHaveAttribute('aria-selected', 'true');
  fireEvent.click(screen.getByRole('button', { name: /Week 27/i }));
  fireEvent.click(screen.getByRole('button', { name: /HAM/i }));
  await waitFor(() => expect(screen.getAllByText(/Projects/i).length).toBeGreaterThan(0));
  expect(screen.getByText('Harman Audio Mixer')).toBeInTheDocument();
  expect(screen.getByText(/Lead QA: Not assigned/i)).toBeInTheDocument();
  expect(screen.queryAllByText('Harman Audio Mixer')).toHaveLength(1);
  expect(screen.getByRole('button', { name: /Last 5 weeks/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Last 10 weeks/i }));
  await waitFor(() => expect(useIssueHistory).toHaveBeenLastCalledWith('p1', 'w1', 10));
});
