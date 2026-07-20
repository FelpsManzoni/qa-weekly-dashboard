import { fetchProjectData } from '../../../src/api/projectData';

const apiGet = vi.fn().mockResolvedValue({ data: { issueMetric: null, testCase: null, releases: [], notes: [] }, error: null });

vi.mock('../../../src/api/client', () => ({
  apiGet: (path: string) => apiGet(path),
  queryString: (params: Record<string, string | number | boolean | null | undefined>) => {
    const entries = Object.entries(params).filter(([, value]) => value != null && value !== '');
    if (!entries.length) return '';
    const search = new URLSearchParams(entries.map(([key, value]) => [key, String(value)]));
    return `?${search.toString()}`;
  }
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it('requests project data by week_start_date and project_id', async () => {
  await fetchProjectData({ project_id: 'p1', week_start_date: '2026-06-29' });
  expect(apiGet).toHaveBeenCalledWith('/project-data?project_id=p1&week_start_date=2026-06-29');
});

it('includes week_id when available for project data hydration', async () => {
  await fetchProjectData({ project_id: 'p1', week_id: 'w1', week_start_date: '2026-06-29' });
  expect(apiGet).toHaveBeenCalledWith('/project-data?project_id=p1&week_id=w1&week_start_date=2026-06-29');
});
