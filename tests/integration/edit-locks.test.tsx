import { render, screen } from '@testing-library/react';
import { ReleaseForm } from '../../src/components/forms';

vi.mock('../../src/api/releases', () => ({ saveRelease: vi.fn().mockResolvedValue({ data: { id: 'r1' }, error: null }) }));
vi.mock('../../src/hooks/useEditLock', () => ({
  useEditLock: () => ({ lock: { id: 'l1' }, error: null, release: vi.fn() })
}));

it('shows lock expiry guidance when editing locked resources', () => {
  render(<ReleaseForm weekId="w1" projectId="p1" selected={{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v1', released_date: '2026-07-03', verified_date: null, status: 'Approved', tests_pass: 1, tests_fail: 0, tests_not_tested: 0, issue_count_a: 0, issue_count_b: 0, issue_count_c: 0, release_notes: '' }} onSaved={vi.fn()} />);
  expect(screen.getByText(/15 minutes/i)).toBeInTheDocument();
});
