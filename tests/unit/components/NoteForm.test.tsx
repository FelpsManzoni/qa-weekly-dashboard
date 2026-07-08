import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NoteForm } from '../../../src/components/forms';

vi.mock('../../../src/api/notes', () => ({
  saveNote: vi.fn().mockResolvedValue({ data: { id: 'n1' }, error: null })
}));

vi.mock('../../../src/hooks/useEditLock', () => ({
  useEditLock: () => ({ lock: null, error: null, release: vi.fn() })
}));

it('submits a note form', async () => {
  const onSaved = vi.fn();
  render(<NoteForm weekId="w1" projectId="p1" selected={null} onSaved={onSaved} />);

  fireEvent.change(screen.getByLabelText(/Note/i), { target: { value: 'Important note' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => expect(onSaved).toHaveBeenCalled());
});
