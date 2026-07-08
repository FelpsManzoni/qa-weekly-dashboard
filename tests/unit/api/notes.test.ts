import { fetchNotes, saveNote, deleteNote } from '../../../src/api/notes';

vi.mock('../../../src/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue({ data: [{ id: 'n1' }], error: null }),
  apiPost: vi.fn().mockResolvedValue({ data: { id: 'n2' }, error: null }),
  apiPut: vi.fn().mockResolvedValue({ data: { id: 'n1' }, error: null }),
  apiDelete: vi.fn().mockResolvedValue({ data: null, error: null }),
  queryString: vi.fn(() => '?q')
}));

it('fetches notes', async () => {
  const response = await fetchNotes('w1', 'p1');
  expect(response.data).toHaveLength(1);
});

it('creates a note (POST)', async () => {
  const response = await saveNote({ priority: 1, note_text: 'hello', week_id: 'w1', project_id: 'p1' } as never);
  expect(response.error).toBeNull();
});

it('updates a note (PUT)', async () => {
  const response = await saveNote({ id: 'n1', priority: 2, note_text: 'edit', week_id: 'w1', project_id: 'p1' } as never);
  expect(response.data?.id).toBe('n1');
});

it('deletes a note', async () => {
  const response = await deleteNote('n1');
  expect(response.error).toBeNull();
});
