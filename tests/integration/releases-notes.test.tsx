import { render, screen } from '@testing-library/react';
import { ReleaseTable } from '../../src/components/ReleaseTable/ReleaseTable';
import { NotesSection } from '../../src/components/NotesSection/NotesSection';

it('renders release and note data together', () => {
  render(
    <>
      <ReleaseTable releases={[{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v2.0', released_date: '2026-07-03', verified_date: '2026-07-04', status: 'Approved', tests_pass: 5, tests_fail: 0, tests_not_tested: 1, issue_count_a: 0, issue_count_b: 0, issue_count_c: 0, release_notes: 'Done' }]} />
      <NotesSection notes={[{ id: 'n1', week_id: 'w1', project_id: 'p1', priority: 1, note_text: 'Watch smoke suite', author: null }]} />
    </>
  );
  expect(screen.getByText('v2.0')).toBeInTheDocument();
  expect(screen.getByText(/Watch smoke suite/)).toBeInTheDocument();
});
