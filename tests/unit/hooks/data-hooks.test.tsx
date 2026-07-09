import { renderHook, waitFor } from '@testing-library/react';
import { useIssueHistory } from '../../../src/hooks/useIssueHistory';
import { useNotes } from '../../../src/hooks/useNotes';
import { useReleases } from '../../../src/hooks/useReleases';
import { useTestCaseDistribution } from '../../../src/hooks/useTestCaseDistribution';

const fetchIssueHistory = vi.fn();
const fetchNotes = vi.fn();
const fetchReleases = vi.fn();
const fetchTestCaseDistribution = vi.fn();

vi.mock('../../../src/api/issues', () => ({ fetchIssueHistory: (...a: unknown[]) => fetchIssueHistory(...a) }));
vi.mock('../../../src/api/notes', () => ({ fetchNotes: (...a: unknown[]) => fetchNotes(...a) }));
vi.mock('../../../src/api/releases', () => ({ fetchReleases: (...a: unknown[]) => fetchReleases(...a) }));
vi.mock('../../../src/api/testCases', () => ({ fetchTestCaseDistribution: (...a: unknown[]) => fetchTestCaseDistribution(...a) }));

beforeEach(() => vi.clearAllMocks());

it('returns empty and does not fetch when ids are missing (disabled)', async () => {
  const issues = renderHook(() => useIssueHistory(null));
  const notes = renderHook(() => useNotes(null, null));
  const releases = renderHook(() => useReleases('w1', null));
  const dist = renderHook(() => useTestCaseDistribution(null, 'p1'));

  await waitFor(() => expect(issues.result.current.data).toEqual([]));
  expect(notes.result.current.data).toEqual([]);
  expect(releases.result.current.data).toEqual([]);
  expect(dist.result.current.data).toEqual([]);
  expect(fetchIssueHistory).not.toHaveBeenCalled();
  expect(fetchNotes).not.toHaveBeenCalled();
});

it('surfaces loader errors as hook error state', async () => {
  fetchNotes.mockResolvedValue({ data: [], error: { message: 'boom', code: 'X' } });
  const notes = renderHook(() => useNotes('w1', 'p1'));
  await waitFor(() => expect(notes.result.current.error).toBe('boom'));
});

it('passes selected week and range through the issue history hook', async () => {
  fetchIssueHistory.mockResolvedValue({ data: [], error: null });
  renderHook(() => useIssueHistory('p1', 'w1', 10));
  await waitFor(() => expect(fetchIssueHistory).toHaveBeenCalledWith('p1', 'w1', 10));
});
