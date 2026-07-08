import { fetchProjects, saveProject } from '../../../src/api/projects';

vi.mock('../../../src/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue({ data: [{ id: 'p1' }], error: null }),
  apiPost: vi.fn().mockResolvedValue({ data: { id: 'p2' }, error: null }),
  apiPut: vi.fn().mockResolvedValue({ data: { id: 'p1' }, error: null })
}));

it('fetches projects', async () => {
  const response = await fetchProjects();
  expect(response.data).toHaveLength(1);
});

it('creates a new project (POST)', async () => {
  const response = await saveProject({ code: 'HAM', name: 'Harman Audio Mixer', display_order: 1, is_active: true });
  expect(response.error).toBeNull();
});

it('updates an existing project (PUT)', async () => {
  const response = await saveProject({ id: 'p1', code: 'HAM', name: 'Harman', display_order: 2, is_active: true });
  expect(response.data?.id).toBe('p1');
});
