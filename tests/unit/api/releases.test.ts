import { fetchReleases, saveRelease } from '../../../src/api/releases';

vi.mock('../../../src/api/client', () => ({
  listRows: vi.fn().mockResolvedValue({ data: [{ id: 'r1' }], error: null }),
  updateRow: vi.fn().mockResolvedValue({ data: { id: 'r1' }, error: null }),
  upsertRow: vi.fn().mockResolvedValue({ data: { id: 'r2' }, error: null })
}));

it('fetches releases', async () => {
  const response = await fetchReleases('w1', 'p1');
  expect(response.data).toHaveLength(1);
});

it('saves release data', async () => {
  const response = await saveRelease({ version: 'v1', week_id: 'w1', project_id: 'p1', date: '2026-07-03', status: 'Ready' } as any);
  expect(response.error).toBeNull();
});
