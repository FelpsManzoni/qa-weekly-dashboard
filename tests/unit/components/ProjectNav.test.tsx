import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectNav } from '../../../src/components/ProjectNav/ProjectNav';

const projects = [
  { id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }
];

it('renders projects and supports selection', () => {
  const onSelect = vi.fn();
  render(<ProjectNav projects={projects} selectedProjectId={null} onSelect={onSelect} />);

  const button = screen.getByRole('button', { name: /HAM/i });
  fireEvent.click(button);
  expect(onSelect).toHaveBeenCalledWith('p1');
});

it('renders code-only project buttons', () => {
  render(<ProjectNav projects={projects} selectedProjectId="p1" onSelect={vi.fn()} />);

  expect(screen.getByRole('button', { name: 'HAM' })).toBeInTheDocument();
  expect(screen.queryByText('Harman Audio Mixer')).not.toBeInTheDocument();
});
