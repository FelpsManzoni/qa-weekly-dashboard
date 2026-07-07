import { renderHook, waitFor } from '@testing-library/react';
import { useAsyncData } from '../../../src/hooks/useAsyncData';
import { useDashboard } from '../../../src/hooks/useDashboard';
import { useEditLock } from '../../../src/hooks/useEditLock';
import { useIssueHistory } from '../../../src/hooks/useIssueHistory';
import { useNotes } from '../../../src/hooks/useNotes';
import { useProjects } from '../../../src/hooks/useProjects';
import { useReleases } from '../../../src/hooks/useReleases';
import { useTestCaseDistribution } from '../../../src/hooks/useTestCaseDistribution';
import { useWeeks } from '../../../src/hooks/useWeeks';

vi.mock('../../../src/api/weeks', () => ({
  fetchWeeks: vi.fn().mockResolvedValue({ data: [{ id: 'w1', week_number: 27, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }], error: null })
}));
vi.mock('../../../src/api/projects', () => ({
  fetchProjects: vi.fn().mockResolvedValue({ data: [{ id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', display_order: 1, is_active: true }], error: null })
}));
vi.mock('../../../src/api/issues', () => ({
  fetchIssueHistory: vi.fn().mockResolvedValue({ data: [{ id: 'i1', week_id: 'w1', project_id: 'p1', reported_count: 4, fixed_count: 3 }], error: null })
}));
vi.mock('../../../src/api/testCases', () => ({
  fetchTestCaseDistribution: vi.fn().mockResolvedValue({ data: [{ id: 't1', week_id: 'w1', project_id: 'p1', automated_count: 5, pending_auto_count: 2, not_auto_count: 1 }], error: null })
}));
vi.mock('../../../src/api/releases', () => ({
  fetchReleases: vi.fn().mockResolvedValue({ data: [{ id: 'r1', week_id: 'w1', project_id: 'p1', version: 'v1', date: '2026-07-03', status: 'Ready', critical_issues: '', changelog: '' }], error: null })
}));
vi.mock('../../../src/api/notes', () => ({
  fetchNotes: vi.fn().mockResolvedValue({ data: [{ id: 'n1', week_id: 'w1', project_id: 'p1', priority: 1, note_text: 'Watch', author: null }], error: null })
}));
vi.mock('../../../src/api/locks', () => ({
  acquireLock: vi.fn().mockResolvedValue({ data: { id: 'l1' }, error: null }),
  releaseLock: vi.fn().mockResolvedValue({ data: null, error: null })
}));

it('loads async data', async () => {
  const { result } = renderHook(() => useAsyncData(async () => ['value'], [] as string[]));
  await waitFor(() => expect(result.current.data).toEqual(['value']));
});

it('loads weeks and projects hooks', async () => {
  const weeks = renderHook(() => useWeeks());
  const projects = renderHook(() => useProjects());

  await waitFor(() => expect(weeks.result.current.activeWeeks).toHaveLength(1));
  await waitFor(() => expect(projects.result.current.activeProjects).toHaveLength(1));
});

it('loads issue, distribution, release, and note hooks', async () => {
  const issueHook = renderHook(() => useIssueHistory('p1'));
  const distributionHook = renderHook(() => useTestCaseDistribution('w1', 'p1'));
  const releaseHook = renderHook(() => useReleases('w1', 'p1'));
  const notesHook = renderHook(() => useNotes('w1', 'p1'));

  await waitFor(() => expect(issueHook.result.current.data).toHaveLength(1));
  await waitFor(() => expect(distributionHook.result.current.data).toHaveLength(1));
  await waitFor(() => expect(releaseHook.result.current.data).toHaveLength(1));
  await waitFor(() => expect(notesHook.result.current.data).toHaveLength(1));
});

it('initializes dashboard defaults', () => {
  const { result } = renderHook(() =>
    useDashboard(
      [{ id: 'w1', week_number: 27, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }],
      [{ id: 'p1', code: 'HAM', name: 'Harman Audio Mixer', description: 'Audio', display_order: 1, is_active: true }]
    )
  );

  expect(result.current.selectedWeek?.id).toBe('w1');
  expect(result.current.selectedProject?.id).toBe('p1');
});

it('acquires and releases edit locks', async () => {
  const { result, unmount } = renderHook(() => useEditLock('notes', 'n1'));

  await waitFor(() => expect(result.current.lock?.id).toBe('l1'));
  unmount();
});
