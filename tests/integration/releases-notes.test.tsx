import { render, screen } from '@testing-library/react';
import { ReleaseTable } from '../../src/components/ReleaseTable/ReleaseTable';
import { NotesSection } from '../../src/components/NotesSection/NotesSection';

it('renders release and note data together', () => {
  render(
    <>
      <ReleaseTable releases={[{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v2.0', date: '2026-07-03', status: 'Ready', critical_issues: '0', changelog: 'Done' }]} />
      <NotesSection notes={[{ id: 'n1', week_id: 'w1', project_id: 'p1', priority: 1, note_text: 'Watch smoke suite', author: null }]} />
    </>
  );
  expect(screen.getByText('v2.0')).toBeInTheDocument();
  expect(screen.getByText(/Watch smoke suite/)).toBeInTheDocument();
});
