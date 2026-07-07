import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProjectForm } from '../../../src/components/forms';

vi.mock('../../../src/api/projects', () => ({
  saveProject: vi.fn().mockResolvedValue({ data: { id: 'p1' }, error: null })
}));

it('submits a project form', async () => {
  const onSaved = vi.fn();
  render(<ProjectForm selected={null} onSaved={onSaved} />);

  fireEvent.change(screen.getByLabelText(/Code/i), { target: { value: 'ham' } });
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Harman Audio Mixer' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => expect(onSaved).toHaveBeenCalled());
});
