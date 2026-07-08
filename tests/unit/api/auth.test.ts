import { register, login, fetchCurrentUser } from '../../../src/api/auth';

vi.mock('../../../src/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue({ data: { user: { id: 'u1', username: 'qa' } }, error: null }),
  apiPost: vi.fn().mockResolvedValue({ data: { token: 't', user: { id: 'u1', username: 'qa' } }, error: null })
}));

it('registers a user', async () => {
  const res = await register({ username: 'qa', email: 'qa@example.com', password: 'password1' });
  expect(res.data?.token).toBe('t');
});

it('logs in a user', async () => {
  const res = await login({ username: 'qa', password: 'password1' });
  expect(res.data?.user.id).toBe('u1');
});

it('fetches the current user and unwraps the envelope', async () => {
  const res = await fetchCurrentUser();
  expect(res.data?.username).toBe('qa');
});
