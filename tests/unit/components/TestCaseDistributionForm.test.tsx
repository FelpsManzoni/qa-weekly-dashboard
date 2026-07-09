import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TestCaseDistributionForm } from '../../../src/components/forms';

vi.mock('../../../src/api/testCases', () => ({
  saveTestCaseDistribution: vi.fn().mockResolvedValue({ data: { id: 't1' }, error: null })
}));

it('submits test case distribution', async () => {
  const onSaved = vi.fn();
  render(<TestCaseDistributionForm weekId="w1" projectId="p1" selected={null} onSaved={onSaved} />);

  fireEvent.change(screen.getByLabelText(/^Automated$/i), { target: { value: '20' } });
  fireEvent.change(screen.getByLabelText(/^Pending$/i), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText(/^Not automated$/i), { target: { value: '3' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => expect(onSaved).toHaveBeenCalled());
});
