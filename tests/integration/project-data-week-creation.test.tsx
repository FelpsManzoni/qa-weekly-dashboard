import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProjectDataPage } from '../../src/components/ProjectDataPage/ProjectDataPage';

const week27 = { id: 'w1', week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true };
let weeksData = [week27];
let weeksIsLoading = false;
const refreshWeeks = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  weeksData = [week27];
  weeksIsLoading = false;
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2026-07-09T12:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

const fetchProjectData = vi.fn().mockImplementation((request: { week_id?: string; week_start_date?: string; project_id: string }) => {
  if (request.week_start_date === '2026-06-29') {
    return Promise.resolve({
      data: {
        issueMetric: { id: 'im1', week_id: 'w1', project_id: 'p1', reported_count: 4, fixed_count: 3 },
        testCase: { id: 'tc1', week_id: 'w1', project_id: 'p1', automated_count: 8, pending_auto_count: 2, not_auto_count: 1 },
        releases: [{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v1.0.0', released_date: '2026-07-03', verified_date: '2026-07-04', status: 'Approved', tests_pass: 10, tests_fail: 1, tests_not_tested: 0, issue_count_a: 1, issue_count_b: 0, issue_count_c: 0, release_notes: 'Existing release' }],
        notes: [{ id: 'n1', week_id: 'w1', project_id: 'p1', priority: 1, note_text: 'Existing note', author: 'QA' }]
      },
      error: null
    });
  }
  return Promise.resolve({
    data: { issueMetric: null, testCase: null, releases: [], notes: [] },
    error: null
  });
});
const ensureWeek = vi.fn().mockResolvedValue({
  data: { id: 'w28', week_number: 28, calendar_year: 2026, start_date: '2026-07-06', end_date: '2026-07-12', is_active: true },
  error: null
});
const saveIssueMetric = vi.fn().mockResolvedValue({ data: { id: 'i1' }, error: null });
const saveTestCaseDistribution = vi.fn().mockResolvedValue({ data: { id: 't1' }, error: null });
const saveRelease = vi.fn().mockResolvedValue({ data: { id: 'r1' }, error: null });
const saveNote = vi.fn().mockResolvedValue({ data: { id: 'n1' }, error: null });

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    data: [{ id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }],
    activeProjects: [{ id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', lead_qa_user_id: null, lead_qa_name: null, client: null, main_technology_scope: null, display_order: 1, is_active: true }],
    refresh: vi.fn(),
    isLoading: false,
    error: null
  })
}));

vi.mock('../../src/hooks/useWeeks', () => ({
  useWeeks: () => ({
    data: weeksData,
    activeWeeks: [],
    refresh: refreshWeeks,
    isLoading: weeksIsLoading,
    error: null
  })
}));

vi.mock('../../src/api/weeks', () => ({
  ensureWeek: (payload: unknown) => ensureWeek(payload)
}));

vi.mock('../../src/api/projectData', () => ({
  fetchProjectData: (request: { week_id?: string; week_start_date?: string; project_id: string }) => fetchProjectData(request)
}));

vi.mock('../../src/api/issues', () => ({
  saveIssueMetric: (payload: unknown) => saveIssueMetric(payload)
}));

vi.mock('../../src/api/testCases', () => ({
  saveTestCaseDistribution: (payload: unknown) => saveTestCaseDistribution(payload)
}));

vi.mock('../../src/api/releases', () => ({
  saveRelease: (payload: unknown) => saveRelease(payload)
}));

vi.mock('../../src/api/notes', () => ({
  saveNote: (payload: unknown) => saveNote(payload)
}));
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'u1', username: 'qauser', email: 'qa@example.com', display_name: 'QA User' },
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
  })
}));

vi.mock('../../src/api/client', async () => {
  const actual = await vi.importActual<typeof import('../../src/api/client')>('../../src/api/client');
  return {
    ...actual,
    apiDelete: vi.fn().mockResolvedValue({ data: null, error: null })
  };
});

it('saves first project data for a newly selected week', async () => {
  render(<ProjectDataPage />);

  expect(await screen.findByRole('option', { name: /2026-W28/i })).toBeInTheDocument();
  await waitFor(() =>
    expect(fetchProjectData).toHaveBeenCalledWith({
      project_id: 'p1',
      week_id: null,
      week_start_date: '2026-07-06'
    })
  );
  await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

  fireEvent.change(screen.getByLabelText(/Reported/i), { target: { value: '7' } });
  fireEvent.change(screen.getByLabelText(/Fixed/i), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText(/^Automated$/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/^Pending$/i), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText(/^Not automated$/i), { target: { value: '1' } });

  fireEvent.click(screen.getByRole('button', { name: /^Save project data$/i }));

  await waitFor(() =>
    expect(ensureWeek).toHaveBeenCalledWith({
      week_number: 28,
      calendar_year: 2026,
      start_date: '2026-07-06',
      end_date: '2026-07-12',
      is_active: true
    })
  );
  await waitFor(() =>
    expect(saveIssueMetric).toHaveBeenCalledWith({
      id: '',
      week_id: 'w28',
      project_id: 'p1',
      reported_count: 7,
      fixed_count: 5
    })
  );
  await waitFor(() =>
    expect(saveTestCaseDistribution).toHaveBeenCalledWith({
      id: '',
      week_id: 'w28',
      project_id: 'p1',
      automated_count: 10,
      pending_auto_count: 3,
      not_auto_count: 1
    })
  );
  expect(saveRelease).not.toHaveBeenCalled();
  expect(saveNote).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(fetchProjectData).toHaveBeenCalledWith({
      project_id: 'p1',
      week_id: 'w28',
      week_start_date: '2026-07-06'
    })
  );
});

it('loads and allows editing an existing project/week tuple', async () => {
  const { rerender } = render(<ProjectDataPage />);

  fireEvent.change(screen.getByLabelText(/Select week/i), { target: { value: '2026-06-29' } });

  await waitFor(() =>
    expect(fetchProjectData).toHaveBeenCalledWith({
      project_id: 'p1',
      week_id: 'w1',
      week_start_date: '2026-06-29'
    })
  );

  expect(await screen.findByDisplayValue('4')).toBeInTheDocument();
  expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  expect(screen.getByDisplayValue('8')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Existing release')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Existing note')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Reported/i), { target: { value: '6' } });
  fireEvent.click(screen.getByRole('button', { name: /^Save project data$/i }));

  await waitFor(() =>
    expect(saveIssueMetric).toHaveBeenCalledWith({
      id: 'im1',
      week_id: 'w1',
      project_id: 'p1',
      reported_count: 6,
      fixed_count: 3
    })
  );
  expect(ensureWeek).not.toHaveBeenCalledWith(
    expect.objectContaining({ start_date: '2026-06-29' })
  );

  weeksIsLoading = true;
  weeksData = [];
  vi.setSystemTime(new Date('2026-11-05T12:00:00Z'));
  rerender(<ProjectDataPage />);

  weeksIsLoading = false;
  weeksData = [week27];
  vi.setSystemTime(new Date('2026-07-09T12:00:00Z'));
  rerender(<ProjectDataPage />);

  await waitFor(() => expect(screen.getByLabelText(/Select week/i)).toHaveValue('2026-06-29'));
});
