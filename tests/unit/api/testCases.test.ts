import { fetchTestCaseDistribution, saveTestCaseDistribution } from '../../../src/api/testCases';

vi.mock('../../../src/api/client', () => ({
  listRows: vi.fn().mockResolvedValue({ data: [{ id: 't1' }], error: null }),
  upsertRow: vi.fn().mockResolvedValue({ data: { id: 't1' }, error: null })
}));

it('fetches distribution', async () => {
  const response = await fetchTestCaseDistribution('w1', 'p1');
  expect(response.data).toHaveLength(1);
});

it('saves distribution', async () => {
  const response = await saveTestCaseDistribution({ week_id: 'w1', project_id: 'p1', automated_count: 1, pending_auto_count: 1, not_auto_count: 1 } as any);
  expect(response.error).toBeNull();
});
