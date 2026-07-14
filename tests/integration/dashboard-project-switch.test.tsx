import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { DashboardSection } from '../../src/components/DashboardSection/DashboardSection';

// Weeks are global calendar entities: the same calendar week shares one id across projects.
// Project A has weeks 28 and 20; Project B only has week 20 (older). Week 20 shares the same
// id in both lists. Fixtures are defined inside the (hoisted) vi.mock factories.
vi.mock('../../src/api/projects', () => ({
  fetchProjects: vi.fn().mockResolvedValue({
    data: [
      { id: 'p-a', code: 'AAA', name: 'Project A', description: null, lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 1, is_active: true },
      { id: 'p-b', code: 'BBB', name: 'Project B', description: null, lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 2, is_active: true }
    ],
    error: null
  })
}));

vi.mock('../../src/api/weeks', () => {
  const WEEK_28 = { id: 'w-28', week_number: 28, calendar_year: 2026, start_date: '2026-07-06', end_date: '2026-07-12', is_active: true };
  const WEEK_20 = { id: 'w-20', week_number: 20, calendar_year: 2026, start_date: '2026-05-11', end_date: '2026-05-17', is_active: true };
  return {
    fetchWeeks: vi.fn(async (projectId?: string | null) => {
      if (projectId === 'p-b') return { data: [WEEK_20], error: null };
      return { data: [WEEK_28, WEEK_20], error: null };
    })
  };
});

// Downstream data hooks are irrelevant to the week-selection logic under test.
vi.mock('../../src/hooks/useIssueHistory', () => ({ useIssueHistory: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));
vi.mock('../../src/hooks/useTestCaseDistribution', () => ({ useTestCaseDistribution: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));
vi.mock('../../src/hooks/useReleases', () => ({ useReleases: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));
vi.mock('../../src/hooks/useNotes', () => ({ useNotes: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));

function selectedWeekLabel(): string | null {
  const selected = document.querySelector('.week-selector__item--selected');
  return selected?.textContent ?? null;
}

it('returns to the newest week when switching back to a project (week ids shared across projects)', async () => {
  render(<DashboardSection />);

  // Defaults to Project A → its newest week (28).
  await waitFor(() => expect(selectedWeekLabel()).toMatch(/Week 28/));

  // Switch to Project B, whose latest week (20) is older → lands on week 20.
  fireEvent.click(screen.getByRole('button', { name: /BBB/i }));
  await waitFor(() => expect(selectedWeekLabel()).toMatch(/Week 20/));

  // Switch back to Project A: must return to A's newest week (28), NOT stay on week 20 even
  // though week 20 also exists in A's list (shared id). This is the regression.
  fireEvent.click(screen.getByRole('button', { name: /AAA/i }));
  await waitFor(() => expect(selectedWeekLabel()).toMatch(/Week 28/));

  // And week 20 is present but not the selected one.
  expect(within(document.body).getByText(/Week 20/)).toBeInTheDocument();
});
