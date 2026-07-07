import { fetchNotes, saveNote } from '../../../src/api/notes';

vi.mock('../../../src/api/client', () => ({
  listRows: vi.fn().mockResolvedValue({ data: [{ id: 'n1' }], error: null }),
  updateRow: vi.fn().mockResolvedValue({ data: { id: 'n1' }, error: null }),
  upsertRow: vi.fn().mockResolvedValue({ data: { id: 'n2' }, error: null })
}));

it('fetches notes', async () => {
  const response = await fetchNotes('w1', 'p1');
  expect(response.data).toHaveLength(1);
});

it('saves a note', async () => {
  const response = await saveNote({ priority: 1, note_text: 'hello', week_id: 'w1', project_id: 'p1' } as any);
  expect(response.error).toBeNull();
});
