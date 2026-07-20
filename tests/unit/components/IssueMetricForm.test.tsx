import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IssueMetricForm } from '../../../src/components/forms';

vi.mock('../../../src/api/issues', () => ({
  saveIssueMetric: vi.fn().mockResolvedValue({ data: { id: 'i1' }, error: null })
}));

it('submits issue metrics', async () => {
  const onSaved = vi.fn();
  render(<IssueMetricForm weekId="w1" projectId="p1" selected={null} onSaved={onSaved} />);

  fireEvent.change(screen.getByLabelText(/Reported/i), { target: { value: '4' } });
  fireEvent.change(screen.getByLabelText(/Fixed/i), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => expect(onSaved).toHaveBeenCalled());
});
