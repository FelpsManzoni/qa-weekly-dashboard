import { fireEvent, render, screen, within } from '@testing-library/react';
import { ReleaseTable } from '../../../src/components/ReleaseTable/ReleaseTable';
import type { ReleaseVersion } from '../../../src/types';

const baseRelease: ReleaseVersion = {
  id: 'r1',
  week_id: 'w1',
  project_id: 'p1',
  version: 'v1',
  released_date: '2026-07-03',
  verified_date: '2026-07-04',
  status: 'Approved',
  tests_pass: 10,
  tests_fail: 1,
  tests_not_tested: 1,
  issue_count_a: 0,
  issue_count_b: 2,
  issue_count_c: 0,
  release_notes: 'Updates'
};

it('renders release summary cards instead of a wide table', () => {
  const { container } = render(<ReleaseTable releases={[baseRelease]} />);

  expect(screen.getByText('Release summary')).toBeInTheDocument();
  expect(screen.getByText('v1')).toBeInTheDocument();
  expect(screen.getByText('Approved')).toBeInTheDocument();
  expect(screen.getByText('Released date: 03/07/2026')).toBeInTheDocument();
  expect(screen.getByText('Verified date: 04/07/2026')).toBeInTheDocument();
  expect(screen.getByText('B:2')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Notes' })).toBeInTheDocument();
  expect(container.querySelector('.release-table__footer-left')).toBeInTheDocument();
  expect(screen.queryByText('Tests pass')).not.toBeInTheDocument();
  expect(screen.queryByText('Tests fail')).not.toBeInTheDocument();
  expect(screen.queryByText('Tests not tested')).not.toBeInTheDocument();
  expect(container.querySelector('table')).not.toBeInTheDocument();
});

it('opens the notes overlay with the test case report and pass rate', () => {
  render(<ReleaseTable releases={[baseRelease]} />);

  fireEvent.click(screen.getByRole('button', { name: 'Notes' }));

  expect(screen.getByRole('dialog', { name: /v1 - Release notes/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Test case report' })).toBeInTheDocument();
  const report = screen.getByLabelText('Test case report');
  expect(within(report).getByText('Tests pass')).toBeInTheDocument();
  expect(within(report).getByText('10')).toBeInTheDocument();
  expect(within(report).getByText('Tests fail')).toBeInTheDocument();
  expect(within(report).getAllByText('1')).toHaveLength(2);
  expect(within(report).getByText('Tests not tested')).toBeInTheDocument();
  expect(screen.getByText('Pass rate')).toBeInTheDocument();
  expect(screen.getByText('83%')).toBeInTheDocument();
  expect(screen.getByText('Updates')).toBeInTheDocument();
});

it('shows a dash for pass rate when the release has no test counts', () => {
  render(
    <ReleaseTable
      releases={[
        {
          ...baseRelease,
          tests_pass: 0,
          tests_fail: 0,
          tests_not_tested: 0,
          release_notes: ''
        }
      ]}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: 'Notes' }));

  expect(screen.getByText('Pass rate')).toBeInTheDocument();
  expect(screen.getByText('-')).toBeInTheDocument();
});
