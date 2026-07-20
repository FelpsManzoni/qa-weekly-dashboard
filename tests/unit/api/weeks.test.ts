import { ensureWeek, fetchWeeks, saveWeek } from '../../../src/api/weeks';

vi.mock('../../../src/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue({ data: [{ id: 'w1' }], error: null }),
  apiPost: vi.fn().mockResolvedValue({ data: { id: 'w2' }, error: null }),
  apiPut: vi.fn().mockResolvedValue({ data: { id: 'w1' }, error: null })
}));

it('fetches weeks', async () => {
  const response = await fetchWeeks();
  expect(response.data).toHaveLength(1);
});

it('creates a new week (POST)', async () => {
  const response = await saveWeek({ week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true });
  expect(response.error).toBeNull();
});

it('updates an existing week (PUT)', async () => {
  const response = await saveWeek({ id: 'w1', week_number: 28, calendar_year: 2026, start_date: '2026-07-06', end_date: '2026-07-12', is_active: true });
  expect(response.data?.id).toBe('w1');
});

it('ensures a canonical ISO week via POST', async () => {
  const response = await ensureWeek({ week_number: 28, calendar_year: 2026, start_date: '2026-07-06', end_date: '2026-07-12', is_active: true });
  expect(response.error).toBeNull();
});
