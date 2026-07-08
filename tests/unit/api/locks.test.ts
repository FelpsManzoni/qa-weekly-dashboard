import { acquireLock, extendLock, releaseLock } from '../../../src/api/locks';

vi.mock('../../../src/api/client', () => ({
  apiPost: vi.fn().mockResolvedValue({ data: { id: 'l1' }, error: null }),
  apiPut: vi.fn().mockResolvedValue({ data: { id: 'l1' }, error: null }),
  apiDelete: vi.fn().mockResolvedValue({ data: null, error: null })
}));

it('acquires a lock', async () => {
  const acquired = await acquireLock('notes', 'n1');
  expect(acquired.error).toBeNull();
  expect(acquired.data?.id).toBe('l1');
});

it('extends a lock (heartbeat)', async () => {
  const extended = await extendLock('l1');
  expect(extended.data?.id).toBe('l1');
});

it('releases locks', async () => {
  const response = await releaseLock('l1');
  expect(response.error).toBeNull();
});
