import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectNav } from '../../../src/components/ProjectNav/ProjectNav';

const projects = [
  { id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }
];

it('renders projects and supports selection', () => {
  const onSelect = vi.fn();
  render(<ProjectNav projects={projects} selectedProjectId={null} onSelect={onSelect} />);

  const button = screen.getByRole('button', { name: /HAM/i });
  fireEvent.mouseEnter(button);
  expect(screen.getByText('Harman Audio Mixer')).toBeInTheDocument();
  fireEvent.click(button);
  expect(onSelect).toHaveBeenCalledWith('p1');
});

it('reveals the selected project name inline', () => {
  render(<ProjectNav projects={projects} selectedProjectId="p1" onSelect={vi.fn()} />);

  expect(screen.getByText('Harman Audio Mixer')).toBeInTheDocument();
});
