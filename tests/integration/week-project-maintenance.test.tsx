import { render, screen } from '@testing-library/react';
import App from '../../src/App';

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
  useWeeks: () => ({ data: [], activeWeeks: [], refresh: vi.fn(), isLoading: false, error: null })
}));
vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({ data: [], activeProjects: [], refresh: vi.fn(), isLoading: false, error: null })
}));
vi.mock('../../src/hooks/useIssueHistory', () => ({ useIssueHistory: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));
vi.mock('../../src/hooks/useTestCaseDistribution', () => ({ useTestCaseDistribution: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));
vi.mock('../../src/hooks/useReleases', () => ({ useReleases: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));
vi.mock('../../src/hooks/useNotes', () => ({ useNotes: () => ({ data: [], refresh: vi.fn(), isLoading: false, error: null }) }));

it('shows maintenance forms', () => {
  render(<App />);
  expect(screen.getAllByText(/Manage weeks/i)).toHaveLength(2);
});
