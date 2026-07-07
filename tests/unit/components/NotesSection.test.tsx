import { render, screen } from '@testing-library/react';
import { NotesSection } from '../../../src/components/NotesSection/NotesSection';

it('renders notes in priority view', () => {
  render(<NotesSection notes={[{ id: 'n1', week_id: 'w1', project_id: 'p1', priority: 0, note_text: 'Critical issue', author: null }]} />);
  expect(screen.getByText(/Critical issue/)).toBeInTheDocument();
});
