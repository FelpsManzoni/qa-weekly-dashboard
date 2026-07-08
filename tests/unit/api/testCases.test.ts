import { fetchTestCaseDistribution, saveTestCaseDistribution } from '../../../src/api/testCases';

vi.mock('../../../src/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue({ data: [{ id: 't1' }], error: null }),
  apiPost: vi.fn().mockResolvedValue({ data: { id: 't1' }, error: null }),
  queryString: vi.fn(() => '?q')
}));

it('fetches distribution', async () => {
  const response = await fetchTestCaseDistribution('w1', 'p1');
  expect(response.data).toHaveLength(1);
});

it('saves distribution', async () => {
  const response = await saveTestCaseDistribution({ week_id: 'w1', project_id: 'p1', automated_count: 1, pending_auto_count: 1, not_auto_count: 1 } as never);
  expect(response.error).toBeNull();
});
