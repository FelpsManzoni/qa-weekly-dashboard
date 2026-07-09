import { fireEvent, render, screen } from '@testing-library/react';
import { ReleaseTable } from '../../../src/components/ReleaseTable/ReleaseTable';

it('renders release rows', () => {
  render(
    <ReleaseTable
      releases={[{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v1', released_date: '2026-07-03', verified_date: '2026-07-04', status: 'Approved', tests_pass: 10, tests_fail: 1, tests_not_tested: 0, issue_count_a: 0, issue_count_b: 0, issue_count_c: 0, release_notes: 'Updates' }]}
    />
  );

  expect(screen.getByText('Version')).toBeInTheDocument();
  expect(screen.getByText('v1')).toBeInTheDocument();
  expect(screen.getByText('Approved')).toBeInTheDocument();
});

it('opens the notes overlay from the notes button', () => {
  render(
    <ReleaseTable
      releases={[{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v1', released_date: '2026-07-03', verified_date: '2026-07-04', status: 'Approved', tests_pass: 10, tests_fail: 1, tests_not_tested: 0, issue_count_a: 0, issue_count_b: 0, issue_count_c: 0, release_notes: 'Ship it' }]}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: /Release notes/i }));
  expect(screen.getByText('Ship it')).toBeInTheDocument();
});
