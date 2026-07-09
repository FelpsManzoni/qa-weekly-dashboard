import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../src/App';

const project = { id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, client: null, main_technology_scope: null, display_order: 1, is_active: true };

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'u1', username: 'qa', email: 'qa@example.com', display_name: 'QA Lead' },
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
  })
}));

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({ data: [project], activeProjects: [project], refresh: vi.fn(), isLoading: false, error: null })
}));

it('shows the signed-in user and navigates to the projects list', () => {
  render(<App />);

  // Header shows the authenticated display name and a sign-out control.
  expect(screen.getByText('QA Lead')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sign out/i })).toBeInTheDocument();

  // The side menu exposes the Projects management screen.
  const projectsButton = screen.getByRole('button', { name: /Projects \/ modules/i });
  fireEvent.click(projectsButton);

  // Selecting it lists the registered projects.
  expect(screen.getByText('Harman Audio Mixer')).toBeInTheDocument();
});
