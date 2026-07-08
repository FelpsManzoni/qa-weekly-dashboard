import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  mapError,
  queryString,
  setAuthToken,
  getAuthToken,
  setUnauthorizedHandler
} from '../../../src/api/client';

function mockFetch(response: { ok?: boolean; status?: number; body?: unknown }) {
  const { ok = true, status = 200, body = {} } = response;
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: vi.fn().mockResolvedValue(body)
  });
}

beforeEach(() => {
  setAuthToken(null);
  setUnauthorizedHandler(null);
  vi.restoreAllMocks();
});

it('maps errors', () => {
  expect(mapError(new Error('Boom')).message).toBe('Boom');
  expect(mapError('nope').message).toBe('Unexpected error');
});

it('builds query strings from defined params only', () => {
  expect(queryString({ a: '1', b: null, c: undefined, d: '' })).toBe('?a=1');
  expect(queryString({})).toBe('');
});

it('stores and clears the auth token', () => {
  setAuthToken('abc');
  expect(getAuthToken()).toBe('abc');
  setAuthToken(null);
  expect(getAuthToken()).toBeNull();
});

it('GETs and returns parsed data', async () => {
  vi.stubGlobal('fetch', mockFetch({ body: [{ id: 'x' }] }));
  const res = await apiGet<{ id: string }[]>('/weeks');
  expect(res.data).toEqual([{ id: 'x' }]);
  expect(res.error).toBeNull();
});

it('attaches the bearer token when set', async () => {
  const fetchMock = mockFetch({ body: {} });
  vi.stubGlobal('fetch', fetchMock);
  setAuthToken('tok');
  await apiGet('/weeks');
  const headers = fetchMock.mock.calls[0][1].headers;
  expect(headers.Authorization).toBe('Bearer tok');
});

it('POSTs a JSON body', async () => {
  const fetchMock = mockFetch({ status: 201, body: { id: 'n' } });
  vi.stubGlobal('fetch', fetchMock);
  const res = await apiPost('/notes', { note_text: 'hi' });
  expect(res.data).toEqual({ id: 'n' });
  expect(fetchMock.mock.calls[0][1].body).toBe(JSON.stringify({ note_text: 'hi' }));
});

it('PUTs and returns data', async () => {
  vi.stubGlobal('fetch', mockFetch({ body: { id: 'n' } }));
  const res = await apiPut('/notes/n', { note_text: 'hi' });
  expect(res.data).toEqual({ id: 'n' });
});

it('returns null data on 204 delete', async () => {
  vi.stubGlobal('fetch', mockFetch({ status: 204, body: null }));
  const res = await apiDelete('/notes/n');
  expect(res.data).toBeNull();
  expect(res.error).toBeNull();
});

it('surfaces API error envelopes', async () => {
  vi.stubGlobal('fetch', mockFetch({ ok: false, status: 409, body: { error: { message: 'dup', code: 'DUPLICATE' } } }));
  const res = await apiPost('/notes', {});
  expect(res.error?.code).toBe('DUPLICATE');
});

it('invokes the unauthorized handler on 401', async () => {
  const onUnauthorized = vi.fn();
  setUnauthorizedHandler(onUnauthorized);
  vi.stubGlobal('fetch', mockFetch({ ok: false, status: 401, body: { error: { message: 'no', code: 'UNAUTHENTICATED' } } }));
  await apiGet('/weeks');
  expect(onUnauthorized).toHaveBeenCalled();
});

it('returns a mapped error when fetch throws', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
  const res = await apiGet('/weeks');
  expect(res.error?.message).toBe('network down');
});
