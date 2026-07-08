import { fetchIssueHistory, fetchIssueMetric, saveIssueMetric } from '../../../src/api/issues';

vi.mock('../../../src/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue({ data: [{ id: 'i1' }], error: null }),
  apiPost: vi.fn().mockResolvedValue({ data: { id: 'i1' }, error: null }),
  queryString: vi.fn(() => '?q')
}));

it('fetches issue history', async () => {
  const response = await fetchIssueHistory('p1');
  expect(response.data).toHaveLength(1);
});

it('fetches issue history scoped to a week', async () => {
  const response = await fetchIssueHistory('p1', 'w1');
  expect(response.data).toHaveLength(1);
});

it('fetches a single issue metric', async () => {
  const response = await fetchIssueMetric('w1', 'p1');
  expect(response.data).toHaveLength(1);
});

it('saves issue metrics', async () => {
  const response = await saveIssueMetric({ week_id: 'w1', project_id: 'p1', reported_count: 2, fixed_count: 1 } as never);
  expect(response.error).toBeNull();
});
