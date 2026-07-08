import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { WeekForm } from '../../../src/components/forms';

vi.mock('../../../src/api/weeks', () => ({
  saveWeek: vi.fn().mockResolvedValue({ data: { id: 'w1' }, error: null })
}));

it('submits a week form', async () => {
  const onSaved = vi.fn();
  render(<WeekForm selected={null} onSaved={onSaved} />);

  fireEvent.change(screen.getByLabelText(/Week number/i), { target: { value: '27' } });
  fireEvent.change(screen.getByLabelText(/Start date/i), { target: { value: '2026-06-29' } });
  fireEvent.change(screen.getByLabelText(/End date/i), { target: { value: '2026-07-05' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => expect(onSaved).toHaveBeenCalled());
});
