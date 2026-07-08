import { fetchReleases, saveRelease } from '../../../src/api/releases';

vi.mock('../../../src/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue({ data: [{ id: 'r1' }], error: null }),
  apiPost: vi.fn().mockResolvedValue({ data: { id: 'r2' }, error: null }),
  apiPut: vi.fn().mockResolvedValue({ data: { id: 'r1' }, error: null }),
  queryString: vi.fn(() => '?q')
}));

it('fetches releases', async () => {
  const response = await fetchReleases('w1', 'p1');
  expect(response.data).toHaveLength(1);
});

it('creates a release (POST)', async () => {
  const response = await saveRelease({ version: 'v1', week_id: 'w1', project_id: 'p1', date: '2026-07-03', status: 'Ready' } as never);
  expect(response.error).toBeNull();
});

it('updates a release (PUT)', async () => {
  const response = await saveRelease({ id: 'r1', version: 'v2', week_id: 'w1', project_id: 'p1', date: '2026-07-04', status: 'Done' } as never);
  expect(response.data?.id).toBe('r1');
});
