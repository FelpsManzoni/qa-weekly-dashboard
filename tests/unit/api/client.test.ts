const upsertMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
const selectMock = vi.fn();
const eqMock = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: selectMock,
      upsert: upsertMock,
      update: updateMock,
      delete: deleteMock
    }))
  }))
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');

  eqMock.mockReturnThis();
  selectMock.mockReturnThis();
  upsertMock.mockReturnThis();
  updateMock.mockReturnThis();
  deleteMock.mockReturnThis();
});

it('maps errors', async () => {
  const { mapError } = await import('../../../src/api/client');
  expect(mapError(new Error('Boom')).message).toBe('Boom');
});

it('lists rows successfully', async () => {
  selectMock.mockResolvedValueOnce({ data: [{ id: 'row1' }], error: null });
  const { listRows } = await import('../../../src/api/client');
  const response = await listRows('weeks');
  expect(response.data).toHaveLength(1);
});

it('gets a single row', async () => {
  selectMock.mockReturnValueOnce({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 'row1' }, error: null }) }) });
  const { getRow } = await import('../../../src/api/client');
  const response = await getRow('weeks', 'row1');
  expect(response.data?.id).toBe('row1');
});

it('upserts rows and removes empty id values', async () => {
  upsertMock.mockReturnValueOnce({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 'row2' }, error: null }) }) });
  const { upsertRow } = await import('../../../src/api/client');
  const response = await upsertRow('weeks', { id: '', week_number: 27 } as any);
  expect((response.data as any)?.id).toBe('row2');
});

it('updates and deletes rows', async () => {
  updateMock.mockReturnValueOnce({ eq: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 'row3' }, error: null }) }) }) });
  deleteMock.mockReturnValueOnce({ eq: vi.fn().mockResolvedValue({ error: null }) });
  const { updateRow, deleteRow } = await import('../../../src/api/client');
  const updated = await updateRow('weeks', 'row3', { week_number: 28 } as any);
  const deleted = await deleteRow('weeks', 'row3');
  expect((updated.data as any)?.id).toBe('row3');
  expect(deleted.error).toBeNull();
});
