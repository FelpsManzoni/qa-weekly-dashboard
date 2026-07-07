import { fetchWeeks, saveWeek } from '../../../src/api/weeks';

vi.mock('../../../src/api/client', () => ({
  listRows: vi.fn().mockResolvedValue({ data: [{ id: 'w1' }], error: null }),
  updateRow: vi.fn().mockResolvedValue({ data: { id: 'w1' }, error: null }),
  upsertRow: vi.fn().mockResolvedValue({ data: { id: 'w2' }, error: null })
}));

it('fetches weeks', async () => {
  const response = await fetchWeeks();
  expect(response.data).toHaveLength(1);
});

it('saves a week', async () => {
  const response = await saveWeek({ week_number: 27, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true });
  expect(response.error).toBeNull();
});
