import { render, screen } from '@testing-library/react';
import { NotesSection } from '../../../src/components/NotesSection/NotesSection';

it('renders notes in priority view', () => {
  render(<NotesSection notes={[{ id: 'n1', week_id: 'w1', project_id: 'p1', priority: 0, note_text: 'Critical issue', author: null }]} />);
  expect(screen.getByText(/Critical issue/)).toBeInTheDocument();
});

it('renders the empty state when there are no notes', () => {
  render(<NotesSection notes={[]} />);
  expect(screen.getByText(/No data available/i)).toBeInTheDocument();
});

it('sorts notes by priority regardless of input order', () => {
  render(
    <NotesSection
      notes={[
        { id: 'n2', week_id: 'w1', project_id: 'p1', priority: 2, note_text: 'Low prio', author: null },
        { id: 'n0', week_id: 'w1', project_id: 'p1', priority: 0, note_text: 'High prio', author: null }
      ]}
    />
  );
  const high = screen.getByText('High prio');
  const low = screen.getByText('Low prio');
  // High priority (0) must appear before low priority (2) in the DOM.
  expect(high.compareDocumentPosition(low) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
