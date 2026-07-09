import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectNav } from '../../../src/components/ProjectNav/ProjectNav';

const projects = [
  { id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }
];

it('renders projects and supports selection', () => {
  const onSelect = vi.fn();
  render(<ProjectNav projects={projects} selectedProjectId={null} onSelect={onSelect} />);

  fireEvent.click(screen.getByRole('button', { name: /HAM/i }));
  expect(onSelect).toHaveBeenCalledWith('p1');
});
