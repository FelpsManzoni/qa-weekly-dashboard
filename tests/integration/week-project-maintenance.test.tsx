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

it('renders the dashboard shell with the side menu sections', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Weekly report/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Projects \/ modules/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Project Data/i })).toBeInTheDocument();
});
