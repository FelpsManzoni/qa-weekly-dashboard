import { fetchProjects, saveProject } from '../../../src/api/projects';

vi.mock('../../../src/api/client', () => ({
  listRows: vi.fn().mockResolvedValue({ data: [{ id: 'p1' }], error: null }),
  updateRow: vi.fn().mockResolvedValue({ data: { id: 'p1' }, error: null }),
  upsertRow: vi.fn().mockResolvedValue({ data: { id: 'p2' }, error: null })
}));

it('fetches projects', async () => {
  const response = await fetchProjects();
  expect(response.data).toHaveLength(1);
});

it('saves a project', async () => {
  const response = await saveProject({ code: 'HAM', name: 'Harman Audio Mixer', display_order: 1, is_active: true });
  expect(response.error).toBeNull();
});
