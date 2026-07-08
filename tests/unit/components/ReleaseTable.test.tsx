import { render, screen } from '@testing-library/react';
import { ReleaseTable } from '../../../src/components/ReleaseTable/ReleaseTable';

it('renders release rows', () => {
  render(
    <ReleaseTable
      releases={[{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v1', date: '2026-07-03', status: 'Ready', critical_issues: '0', changelog: 'Updates' }]}
    />
  );

  expect(screen.getByText('VERSION')).toBeInTheDocument();
  expect(screen.getByText('v1')).toBeInTheDocument();
});
