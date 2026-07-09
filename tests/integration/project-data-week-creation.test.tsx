import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProjectDataPage } from '../../src/components/ProjectDataPage/ProjectDataPage';

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
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
    data: [
      { id: 'w1', week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }
    ],
    activeWeeks: [],
    refresh: vi.fn(),
    isLoading: false,
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

  fireEvent.change(screen.getByLabelText(/Reported/i), { target: { value: '7' } });
  fireEvent.change(screen.getByLabelText(/Fixed/i), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText(/^Automated$/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/^Pending$/i), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText(/^Not automated$/i), { target: { value: '1' } });

  fireEvent.click(screen.getAllByRole('button', { name: /\+ New/i })[0]);
  fireEvent.click(screen.getAllByRole('button', { name: /\+ New/i })[1]);

  fireEvent.change(screen.getByLabelText(/Version/i), { target: { value: 'v2.8.0' } });
  fireEvent.change(screen.getByLabelText(/Released date/i), { target: { value: '2026-07-10' } });
  fireEvent.change(screen.getByLabelText(/Verified date/i), { target: { value: '2026-07-11' } });
  fireEvent.change(screen.getByLabelText(/Tests pass/i), { target: { value: '12' } });
  fireEvent.change(screen.getByLabelText(/Tests fail/i), { target: { value: '2' } });
  fireEvent.change(screen.getByLabelText(/Tests not tested/i), { target: { value: '1' } });
  fireEvent.change(screen.getByLabelText(/Category A/i), { target: { value: '2' } });
  fireEvent.change(screen.getByLabelText(/Category B/i), { target: { value: '1' } });
  fireEvent.change(screen.getByLabelText(/Category C/i), { target: { value: '0' } });
  fireEvent.change(screen.getByLabelText(/Release notes/i), { target: { value: 'Initial week setup' } });

  fireEvent.change(screen.getByLabelText(/^Note$/i), { target: { value: 'Start smoke coverage' } });

  fireEvent.click(screen.getByRole('button', { name: /^Save$/i }));

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
  await waitFor(() =>
    expect(saveRelease).toHaveBeenCalledWith({
      id: undefined,
      week_id: 'w28',
      project_id: 'p1',
      version: 'v2.8.0',
      released_date: '2026-07-10',
      verified_date: '2026-07-11',
      status: 'Approved',
      tests_pass: 12,
      tests_fail: 2,
      tests_not_tested: 1,
      issue_count_a: 2,
      issue_count_b: 1,
      issue_count_c: 0,
      release_notes: 'Initial week setup'
    })
  );
  await waitFor(() =>
    expect(saveNote).toHaveBeenCalledWith({
      id: undefined,
      week_id: 'w28',
      project_id: 'p1',
      priority: 0,
      note_text: 'Start smoke coverage',
      author: 'QA User'
    })
  );
  await waitFor(() =>
    expect(fetchProjectData).toHaveBeenCalledWith({
      project_id: 'p1',
      week_id: 'w28',
      week_start_date: '2026-07-06'
    })
  );
});

it('loads and allows editing an existing project/week tuple', async () => {
  render(<ProjectDataPage />);

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
  fireEvent.click(screen.getByRole('button', { name: /^Save$/i }));

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
});
