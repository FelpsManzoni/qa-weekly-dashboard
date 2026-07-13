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

it('rejects a week that does not start on Monday', async () => {
  const token = await registerAndToken();
  const res = await request(app)
    .post('/api/weeks')
    .set('Authorization', `Bearer ${token}`)
    .send({ week_number: 5, calendar_year: 2026, start_date: '2026-01-01', end_date: '2026-01-08', is_active: true });
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
});

it('upserts an existing ISO week by start_date', async () => {
  const token = await registerAndToken();
  queryOne.mockResolvedValueOnce({ id: 'w28', week_number: 28, calendar_year: 2026, start_date: '2026-07-06', end_date: '2026-07-12', is_active: true });
  const res = await request(app)
    .post('/api/weeks')
    .set('Authorization', `Bearer ${token}`)
    .send({ week_number: 28, calendar_year: 2026, start_date: '2026-07-06', end_date: '2026-07-12', is_active: true });
  expect(res.status).toBe(201);
  expect(res.body.id).toBe('w28');
});

it('rejects a release with an unsupported status', async () => {
  const token = await registerAndToken();
  const res = await request(app)
    .post('/api/releases')
    .set('Authorization', `Bearer ${token}`)
    .send({
      week_id: '00000000-0000-0000-0000-000000000001',
      project_id: '00000000-0000-0000-0000-000000000002',
      version: 'v1',
      released_date: '2026-07-03',
      verified_date: '2026-07-04',
      status: 'Ready'
    });
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
});

it('accepts a valid release with structured issue counts', async () => {
  const token = await registerAndToken();
  queryOne.mockResolvedValueOnce({ id: 'rv1' });
  const res = await request(app)
    .post('/api/releases')
    .set('Authorization', `Bearer ${token}`)
    .send({
      week_id: '00000000-0000-0000-0000-000000000001',
      project_id: '00000000-0000-0000-0000-000000000002',
      version: 'v1',
      released_date: '2026-07-03',
      verified_date: '2026-07-04',
      status: 'Approved',
      tests_pass: 10,
      tests_fail: 1,
      tests_not_tested: 0,
      issue_count_a: 1,
      issue_count_b: 2,
      issue_count_c: 3,
      release_notes: 'Notes'
    });
  expect(res.status).toBe(201);
  expect(res.body.id).toBe('rv1');
});

it('lists the latest release history up to the selected week end date', async () => {
  const token = await registerAndToken();
  query.mockResolvedValueOnce([{ id: 'rv2' }, { id: 'rv1' }]);
  const res = await request(app)
    .get('/api/releases?project_id=00000000-0000-0000-0000-000000000002&released_before=2026-07-05&limit=5')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
  expect(query).toHaveBeenCalledWith(expect.stringContaining('released_date <= $2'), [
    '00000000-0000-0000-0000-000000000002',
    '2026-07-05',
    5
  ]);
});

it('lists users', async () => {
  const token = await registerAndToken();
  query.mockResolvedValueOnce([{ id: 'u2', username: 'qa2', email: 'qa2@e.com', display_name: 'QA Two' }]);
  const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].username).toBe('qa2');
});

it('returns aggregated project data', async () => {
  const token = await registerAndToken();
  queryOne.mockResolvedValueOnce({ id: 'im1', reported_count: 1, fixed_count: 1 });
  queryOne.mockResolvedValueOnce(null);
  query.mockResolvedValueOnce([]);
  query.mockResolvedValueOnce([]);
  const res = await request(app)
    .get('/api/project-data?week_id=00000000-0000-0000-0000-000000000001&project_id=00000000-0000-0000-0000-000000000002')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.issueMetric.id).toBe('im1');
  expect(res.body.releases).toEqual([]);
});

it('returns aggregated project data by week_start_date when the week exists', async () => {
  const token = await registerAndToken();
  queryOne.mockResolvedValueOnce({ id: 'w1' });
  queryOne.mockResolvedValueOnce({ id: 'im1', reported_count: 1, fixed_count: 1 });
  queryOne.mockResolvedValueOnce(null);
  query.mockResolvedValueOnce([]);
  query.mockResolvedValueOnce([]);
  const res = await request(app)
    .get('/api/project-data?week_start_date=2026-06-29&project_id=00000000-0000-0000-0000-000000000002')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.issueMetric.id).toBe('im1');
});

it('returns an empty aggregated payload by week_start_date when the week does not exist', async () => {
  const token = await registerAndToken();
  queryOne.mockResolvedValueOnce(null);
  const res = await request(app)
    .get('/api/project-data?week_start_date=2026-06-29&project_id=00000000-0000-0000-0000-000000000002')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ issueMetric: null, testCase: null, releases: [], notes: [] });
});

it('rejects mismatched week_id and week_start_date on project data load', async () => {
  const token = await registerAndToken();
  queryOne.mockResolvedValueOnce({ id: 'w1' });
  const res = await request(app)
    .get('/api/project-data?week_id=w2&week_start_date=2026-06-29&project_id=00000000-0000-0000-0000-000000000002')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
});
