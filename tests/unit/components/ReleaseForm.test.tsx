import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReleaseForm } from '../../../src/components/forms';

vi.mock('../../../src/api/releases', () => ({
  saveRelease: vi.fn().mockResolvedValue({ data: { id: 'r1' }, error: null })
}));

vi.mock('../../../src/hooks/useEditLock', () => ({
  useEditLock: () => ({ lock: null, error: null, release: vi.fn() })
}));

it('submits a release form', async () => {
  const onSaved = vi.fn();
  render(<ReleaseForm weekId="w1" projectId="p1" selected={null} onSaved={onSaved} />);

  fireEvent.change(screen.getByLabelText(/Version/i), { target: { value: 'v1.0.0' } });
  fireEvent.change(screen.getByLabelText(/Released date/i), { target: { value: '2026-07-03' } });
  fireEvent.change(screen.getByLabelText(/Verified date/i), { target: { value: '2026-07-04' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => expect(onSaved).toHaveBeenCalled());
});
