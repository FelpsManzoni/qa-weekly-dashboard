import { acquireLock, fetchLock, releaseLock } from '../../../src/api/locks';

vi.mock('../../../src/api/client', () => ({
  listRows: vi.fn().mockResolvedValue({ data: [], error: null }),
  upsertRow: vi.fn().mockResolvedValue({ data: { id: 'l1' }, error: null }),
  deleteRow: vi.fn().mockResolvedValue({ data: null, error: null })
}));

it('fetches and acquires locks', async () => {
  const list = await fetchLock('notes', 'n1');
  expect(list.data).toEqual([]);
  const acquired = await acquireLock('notes', 'n1', 'owner');
  expect(acquired.error).toBeNull();
});

it('releases locks', async () => {
  const response = await releaseLock('l1');
  expect(response.error).toBeNull();
});
