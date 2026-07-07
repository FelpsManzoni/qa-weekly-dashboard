import { fetchIssueHistory, saveIssueMetric } from '../../../src/api/issues';

vi.mock('../../../src/api/client', () => ({
  listRows: vi.fn().mockResolvedValue({ data: [{ id: 'i1' }], error: null }),
  upsertRow: vi.fn().mockResolvedValue({ data: { id: 'i1' }, error: null })
}));

it('fetches issue history', async () => {
  const response = await fetchIssueHistory('p1');
  expect(response.data).toHaveLength(1);
});

it('saves issue metrics', async () => {
  const response = await saveIssueMetric({ week_id: 'w1', project_id: 'p1', reported_count: 2, fixed_count: 1 } as any);
  expect(response.error).toBeNull();
});
