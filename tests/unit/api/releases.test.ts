import { fetchReleases, saveRelease } from '../../../src/api/releases';

vi.mock('../../../src/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue({ data: [{ id: 'r1' }], error: null }),
  apiPost: vi.fn().mockResolvedValue({ data: { id: 'r2' }, error: null }),
  apiPut: vi.fn().mockResolvedValue({ data: { id: 'r1' }, error: null }),
  queryString: vi.fn(() => '?q')
}));

it('fetches releases', async () => {
  const response = await fetchReleases({ week_id: 'w1', project_id: 'p1', released_before: '2026-07-05', limit: 5 });
  expect(response.data).toHaveLength(1);
});

it('creates a release (POST)', async () => {
  const response = await saveRelease({
    version: 'v1',
    week_id: 'w1',
    project_id: 'p1',
    released_date: '2026-07-03',
    verified_date: '2026-07-04',
    status: 'Approved',
    tests_pass: 10,
    tests_fail: 1,
    tests_not_tested: 0,
    issue_count_a: 0,
    issue_count_b: 0,
    issue_count_c: 0
  });
  expect(response.error).toBeNull();
});

it('updates a release (PUT)', async () => {
  const response = await saveRelease({
    id: 'r1',
    version: 'v2',
    week_id: 'w1',
    project_id: 'p1',
    released_date: '2026-07-04',
    verified_date: null,
    status: 'Blocked',
    tests_pass: 8,
    tests_fail: 2,
    tests_not_tested: 1,
    issue_count_a: 1,
    issue_count_b: 0,
    issue_count_c: 0
  });
  expect(response.data?.id).toBe('r1');
});
