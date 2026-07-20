import { fireEvent, render, screen } from '@testing-library/react';
import { IssueMetricForm, TestCaseDistributionForm } from '../../src/components/forms';

vi.mock('../../src/api/issues', () => ({ saveIssueMetric: vi.fn().mockResolvedValue({ data: { id: 'i1' }, error: null }) }));
vi.mock('../../src/api/testCases', () => ({ saveTestCaseDistribution: vi.fn().mockResolvedValue({ data: { id: 't1' }, error: null }) }));

it('renders metrics forms and accepts values', () => {
  render(
    <>
      <IssueMetricForm weekId="w1" projectId="p1" selected={null} onSaved={vi.fn()} />
      <TestCaseDistributionForm weekId="w1" projectId="p1" selected={null} onSaved={vi.fn()} />
    </>
  );
  fireEvent.change(screen.getByLabelText(/Reported/i), { target: { value: '6' } });
  expect(screen.getByDisplayValue('6')).toBeInTheDocument();
});
