import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../../../src/hooks/useAuth';

const loginApi = vi.fn();
const registerApi = vi.fn();
const fetchCurrentUser = vi.fn();

vi.mock('../../../src/api/auth', () => ({
  login: (...args: unknown[]) => loginApi(...args),
  register: (...args: unknown[]) => registerApi(...args),
  fetchCurrentUser: () => fetchCurrentUser()
}));

let storedToken: string | null = null;
vi.mock('../../../src/api/client', () => ({
  getAuthToken: () => storedToken,
  setAuthToken: (t: string | null) => {
    storedToken = t;
  },
  setUnauthorizedHandler: vi.fn()
}));

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

beforeEach(() => {
  storedToken = null;
  vi.clearAllMocks();
});

it('starts unauthenticated when no token is stored', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.user).toBeNull();
});

it('logs in and stores the user', async () => {
  loginApi.mockResolvedValue({ data: { token: 'tok', user: { id: 'u1', username: 'qa' } }, error: null });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    const err = await result.current.login('qa', 'pw');
    expect(err).toBeNull();
  });
  expect(result.current.user?.id).toBe('u1');
  expect(storedToken).toBe('tok');
});

it('returns the error on failed login', async () => {
  loginApi.mockResolvedValue({ data: null, error: { message: 'bad', code: 'INVALID_CREDENTIALS' } });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    const err = await result.current.login('qa', 'wrong');
    expect(err?.code).toBe('INVALID_CREDENTIALS');
  });
  expect(result.current.user).toBeNull();
});

it('registers then logs out', async () => {
  registerApi.mockResolvedValue({ data: { token: 'tok', user: { id: 'u2', username: 'new' } }, error: null });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    await result.current.register({ username: 'new', email: 'n@e.com', password: 'password1' });
  });
  expect(result.current.user?.id).toBe('u2');

  act(() => result.current.logout());
  expect(result.current.user).toBeNull();
  expect(storedToken).toBeNull();
});

it('bootstraps the user from a stored token', async () => {
  storedToken = 'existing';
  fetchCurrentUser.mockResolvedValue({ data: { id: 'u9', username: 'stored' }, error: null });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.user?.id).toBe('u9'));
});
