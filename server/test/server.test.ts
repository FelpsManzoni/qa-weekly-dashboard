import request from 'supertest';

const query = vi.fn();
const queryOne = vi.fn();

vi.mock('../src/db.js', () => ({
  query: (...a: unknown[]) => query(...a),
  queryOne: (...a: unknown[]) => queryOne(...a),
  pool: {}
}));

const { createApp } = await import('../src/app.js');
const app = createApp();

beforeEach(() => vi.clearAllMocks());

async function registerAndToken() {
  queryOne.mockResolvedValueOnce(null); // no existing user
  queryOne.mockResolvedValueOnce({ id: 'u1', username: 'qauser', email: 'qa@e.com', display_name: null, password_hash: 'h' });
  const res = await request(app).post('/api/auth/register').send({ username: 'qauser', email: 'qa@e.com', password: 'password1' });
  return res.body.token as string;
}

it('reports health without auth', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});

it('registers a new user and returns a token', async () => {
  queryOne.mockResolvedValueOnce(null);
  queryOne.mockResolvedValueOnce({ id: 'u1', username: 'qauser', email: 'qa@e.com', display_name: null, password_hash: 'h' });
  const res = await request(app).post('/api/auth/register').send({ username: 'qauser', email: 'qa@e.com', password: 'password1' });
  expect(res.status).toBe(201);
  expect(res.body.token).toBeTruthy();
  expect(res.body.user.username).toBe('qauser');
});

it('rejects duplicate registration', async () => {
  queryOne.mockResolvedValueOnce({ id: 'existing' });
  const res = await request(app).post('/api/auth/register').send({ username: 'qauser', email: 'qa@e.com', password: 'password1' });
  expect(res.status).toBe(409);
});

it('validates the registration body', async () => {
  const res = await request(app).post('/api/auth/register').send({ username: 'x', email: 'bad', password: 'short' });
  expect(res.status).toBe(400);
});

it('rejects login with unknown user', async () => {
  queryOne.mockResolvedValueOnce(null);
  const res = await request(app).post('/api/auth/login').send({ username: 'nope', password: 'password1' });
  expect(res.status).toBe(401);
});

it('requires auth for protected routes', async () => {
  const res = await request(app).get('/api/weeks');
  expect(res.status).toBe(401);
});

it('lists weeks when authenticated', async () => {
  const token = await registerAndToken();
  query.mockResolvedValueOnce([{ id: 'w1', week_number: 27 }]);
  const res = await request(app).get('/api/weeks').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

it('returns 409 when a lock is held by another editor', async () => {
  const token = await registerAndToken();
  // Existing, unexpired lock owned by someone else.
  queryOne.mockResolvedValueOnce({
    id: 'l1',
    resource_type: 'notes',
    resource_id: '00000000-0000-0000-0000-000000000001',
    owner_id: 'someone-else',
    expires_at: new Date(Date.now() + 60_000).toISOString()
  });
  const res = await request(app)
    .post('/api/locks')
    .set('Authorization', `Bearer ${token}`)
    .send({ resource_type: 'notes', resource_id: '00000000-0000-0000-0000-000000000001' });
  expect(res.status).toBe(409);
  expect(res.body.error.code).toBe('LOCKED');
});

it('upserts an issue metric', async () => {
  const token = await registerAndToken();
  queryOne.mockResolvedValueOnce({ id: 'i1', reported_count: 3, fixed_count: 2 });
  const res = await request(app)
    .post('/api/issue-metrics')
    .set('Authorization', `Bearer ${token}`)
    .send({
      week_id: '00000000-0000-0000-0000-000000000001',
      project_id: '00000000-0000-0000-0000-000000000002',
      reported_count: 3,
      fixed_count: 2
    });
  expect(res.status).toBe(201);
  expect(res.body.id).toBe('i1');
});
