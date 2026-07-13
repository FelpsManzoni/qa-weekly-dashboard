import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchProjectData } from '../api/projectData';
import { saveIssueMetric } from '../api/issues';
import { saveTestCaseDistribution } from '../api/testCases';
import { saveRelease } from '../api/releases';
import { saveNote } from '../api/notes';
import { ensureWeek } from '../api/weeks';
import { apiDelete } from '../api/client';
import { useAuth } from './useAuth';
import type { ProjectDataRequest, ReleaseStatus, Week, WeekDraft } from '../types';

export type ReleaseDraft = {
  id: string | null;
  version: string;
  released_date: string;
  verified_date: string;
  status: ReleaseStatus;
  tests_pass: number;
  tests_fail: number;
  tests_not_tested: number;
  issue_count_a: number;
  issue_count_b: number;
  issue_count_c: number;
  release_notes: string;
};

export type NoteDraft = {
  id: string | null;
  priority: 0 | 1 | 2 | 3;
  note_text: string;
  author: string;
};

type Loaded = {
  issueId: string | null;
  testId: string | null;
  releaseIds: string[];
  noteIds: string[];
};

const emptyLoaded: Loaded = { issueId: null, testId: null, releaseIds: [], noteIds: [] };
type EditorState = ReturnType<typeof resetLoadedState>;

function resetLoadedState() {
  return {
    reported: 0,
    fixed: 0,
    automated: 0,
    pending: 0,
    notAuto: 0,
    releases: [] as ReleaseDraft[],
    notes: [] as NoteDraft[]
  };
}

function cloneEditorState(state: EditorState): EditorState {
  return {
    reported: state.reported,
    fixed: state.fixed,
    automated: state.automated,
    pending: state.pending,
    notAuto: state.notAuto,
    releases: state.releases.map((release) => ({ ...release })),
    notes: state.notes.map((note) => ({ ...note }))
  };
}

function hasProjectData(state: EditorState): boolean {
  return Boolean(
    state.reported ||
    state.fixed ||
    state.automated ||
    state.pending ||
    state.notAuto ||
    state.releases.length ||
    state.notes.length
  );
}

function editorStateKey(state: EditorState): string {
  return JSON.stringify(state);
}

export function useProjectDataEditor(
  selectedWeek: WeekDraft | null,
  projectId: string | null,
  onWeekResolved?: (week: Week) => void
) {
  const selectedWeekId = selectedWeek?.id ?? null;
  const selectedWeekStart = selectedWeek?.start_date ?? null;
  const selectedWeekNumber = selectedWeek?.week_number ?? null;
  const selectedWeekYear = selectedWeek?.calendar_year ?? null;
  const selectedWeekEnd = selectedWeek?.end_date ?? null;
  const selectedWeekActive = selectedWeek?.is_active ?? true;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const [reported, setReported] = useState(0);
  const [fixed, setFixed] = useState(0);

  const [automated, setAutomated] = useState(0);
  const [pending, setPending] = useState(0);
  const [notAuto, setNotAuto] = useState(0);

  const [releases, setReleases] = useState<ReleaseDraft[]>([]);
  const [notes, setNotes] = useState<NoteDraft[]>([]);

  const loadedRef = useRef<Loaded>(emptyLoaded);
  const baselineRef = useRef<EditorState>(resetLoadedState());

  const applyState = useCallback((state: EditorState) => {
    setReported(state.reported);
    setFixed(state.fixed);
    setAutomated(state.automated);
    setPending(state.pending);
    setNotAuto(state.notAuto);
    setReleases(cloneEditorState(state).releases);
    setNotes(cloneEditorState(state).notes);
  }, []);

  const reset = useCallback(() => {
    const state = resetLoadedState();
    applyState(state);
    baselineRef.current = cloneEditorState(state);
    loadedRef.current = emptyLoaded;
    setCopyMessage(null);
    setSaveError(null);
  }, [applyState]);

  const currentState = useMemo<EditorState>(() => ({
    reported,
    fixed,
    automated,
    pending,
    notAuto,
    releases,
    notes
  }), [automated, fixed, notAuto, notes, pending, releases, reported]);

  const isDirty = editorStateKey(currentState) !== editorStateKey(baselineRef.current);

  const loadByRequest = useCallback(async (request: ProjectDataRequest) => {
    if (!projectId) {
      reset();
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: loadError } = await fetchProjectData(request);
      if (loadError) {
        throw new Error(loadError.message);
      }
      const payload = data ?? { issueMetric: null, testCase: null, releases: [], notes: [] };
      const loadedState: EditorState = {
        reported: payload.issueMetric?.reported_count ?? 0,
        fixed: payload.issueMetric?.fixed_count ?? 0,
        automated: payload.testCase?.automated_count ?? 0,
        pending: payload.testCase?.pending_auto_count ?? 0,
        notAuto: payload.testCase?.not_auto_count ?? 0,
        releases: payload.releases.map((release) => ({
          id: release.id,
          version: release.version,
          released_date: release.released_date,
          verified_date: release.verified_date ?? '',
          status: release.status,
          tests_pass: release.tests_pass,
          tests_fail: release.tests_fail,
          tests_not_tested: release.tests_not_tested,
          issue_count_a: release.issue_count_a,
          issue_count_b: release.issue_count_b,
          issue_count_c: release.issue_count_c,
          release_notes: release.release_notes ?? ''
        })),
        notes: payload.notes.map((note) => ({
          id: note.id,
          priority: note.priority,
          note_text: note.note_text,
          author: note.author ?? ''
        }))
      };
      applyState(loadedState);
      baselineRef.current = cloneEditorState(loadedState);
      loadedRef.current = {
        issueId: payload.issueMetric?.id ?? null,
        testId: payload.testCase?.id ?? null,
        releaseIds: payload.releases.map((release) => release.id),
        noteIds: payload.notes.map((note) => note.id)
      };
      setCopyMessage(null);
      setSaveError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [applyState, projectId, reset]);

  const load = useCallback(async () => {
    if (!selectedWeekStart || !projectId) {
      reset();
      setError(null);
      setLoading(false);
      return;
    }

    await loadByRequest({
      project_id: projectId,
      week_id: selectedWeekId,
      week_start_date: selectedWeekStart
    });
  }, [loadByRequest, projectId, reset, selectedWeekId, selectedWeekStart]);

  useEffect(() => {
    void load();
  }, [load]);

  const addRelease = useCallback(() => {
    setReleases((current) => [
      ...current,
      {
        id: null,
        version: '',
        released_date: '',
        verified_date: '',
        status: 'Approved',
        tests_pass: 0,
        tests_fail: 0,
        tests_not_tested: 0,
        issue_count_a: 0,
        issue_count_b: 0,
        issue_count_c: 0,
        release_notes: ''
      }
    ]);
  }, []);

  const updateRelease = useCallback((index: number, patch: Partial<ReleaseDraft>) => {
    setReleases((current) => current.map((release, i) => (i === index ? { ...release, ...patch } : release)));
  }, []);

  const removeRelease = useCallback((index: number) => {
    setReleases((current) => current.filter((_, i) => i !== index));
  }, []);

  const addNote = useCallback(() => {
    setNotes((current) => [...current, { id: null, priority: 0, note_text: '', author: '' }]);
  }, []);

  const updateNote = useCallback((index: number, patch: Partial<NoteDraft>) => {
    setNotes((current) => current.map((note, i) => (i === index ? { ...note, ...patch } : note)));
  }, []);

  const removeNote = useCallback((index: number) => {
    setNotes((current) => current.filter((_, i) => i !== index));
  }, []);

  const copyFromPreviousWeek = useCallback(async (previousWeekStart: string) => {
    if (!projectId) return;

    setCopying(true);
    setCopyMessage(null);
    setSaveError(null);
    try {
      const { data, error: copyError } = await fetchProjectData({
        project_id: projectId,
        week_start_date: previousWeekStart
      });
      if (copyError) {
        throw new Error(copyError.message);
      }

      const payload = data ?? { issueMetric: null, testCase: null, releases: [], notes: [] };
      const copiedState: EditorState = {
        reported: payload.issueMetric?.reported_count ?? 0,
        fixed: payload.issueMetric?.fixed_count ?? 0,
        automated: payload.testCase?.automated_count ?? 0,
        pending: payload.testCase?.pending_auto_count ?? 0,
        notAuto: payload.testCase?.not_auto_count ?? 0,
        releases: payload.releases.map((release) => ({
          id: null,
          version: release.version,
          released_date: release.released_date,
          verified_date: release.verified_date ?? '',
          status: release.status,
          tests_pass: release.tests_pass,
          tests_fail: release.tests_fail,
          tests_not_tested: release.tests_not_tested,
          issue_count_a: release.issue_count_a,
          issue_count_b: release.issue_count_b,
          issue_count_c: release.issue_count_c,
          release_notes: release.release_notes ?? ''
        })),
        notes: payload.notes.map((note) => ({
          id: null,
          priority: note.priority,
          note_text: note.note_text,
          author: note.author ?? ''
        }))
      };

      if (!hasProjectData(copiedState)) {
        setCopyMessage('No data found in the previous week.');
        return;
      }

      applyState(copiedState);
      setCopyMessage('Previous week data copied. Review and save to apply it to this week.');
    } catch (err) {
      setCopyMessage(err instanceof Error ? err.message : 'Failed to copy previous week data.');
    } finally {
      setCopying(false);
    }
  }, [applyState, projectId]);

  const discardChanges = useCallback(() => {
    applyState(baselineRef.current);
    setCopyMessage(null);
    setSaveError(null);
  }, [applyState]);

  const save = useCallback(async () => {
    if (!selectedWeekStart || !selectedWeekEnd || selectedWeekNumber == null || selectedWeekYear == null || !projectId) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    const loaded = loadedRef.current;
    try {
      let weekId = selectedWeekId;
      if (!weekId) {
        const ensured = await ensureWeek({
          week_number: selectedWeekNumber,
          calendar_year: selectedWeekYear,
          start_date: selectedWeekStart,
          end_date: selectedWeekEnd,
          is_active: selectedWeekActive
        });
        if (ensured.error) throw new Error(ensured.error.message);
        if (!ensured.data) throw new Error('Failed to create week');
        weekId = ensured.data.id;
        onWeekResolved?.(ensured.data);
      }

      const issueRes = await saveIssueMetric({
        id: loaded.issueId ?? '',
        week_id: weekId,
        project_id: projectId,
        reported_count: reported,
        fixed_count: fixed
      });
      if (issueRes.error) throw new Error(issueRes.error.message);

      const testRes = await saveTestCaseDistribution({
        id: loaded.testId ?? '',
        week_id: weekId,
        project_id: projectId,
        automated_count: automated,
        pending_auto_count: pending,
        not_auto_count: notAuto
      });
      if (testRes.error) throw new Error(testRes.error.message);

      const releaseIds = new Set(releases.map((r) => r.id).filter(Boolean) as string[]);
      const removedReleases = loaded.releaseIds.filter((id) => !releaseIds.has(id));
      for (const id of removedReleases) {
        const { error } = await apiDelete(`/releases/${id}`);
        if (error) throw new Error(error.message);
      }
      for (const release of releases) {
        const res = await saveRelease({
          id: release.id ?? undefined,
          week_id: weekId,
          project_id: projectId,
          version: release.version,
          released_date: release.released_date,
          verified_date: release.verified_date || null,
          status: release.status,
          tests_pass: release.tests_pass,
          tests_fail: release.tests_fail,
          tests_not_tested: release.tests_not_tested,
          issue_count_a: release.issue_count_a,
          issue_count_b: release.issue_count_b,
          issue_count_c: release.issue_count_c,
          release_notes: release.release_notes
        });
        if (res.error) throw new Error(res.error.message);
      }

      const noteIds = new Set(notes.map((n) => n.id).filter(Boolean) as string[]);
      const removedNotes = loaded.noteIds.filter((id) => !noteIds.has(id));
      for (const id of removedNotes) {
        const { error } = await apiDelete(`/notes/${id}`);
        if (error) throw new Error(error.message);
      }
      for (const note of notes) {
        const res = await saveNote({
          id: note.id ?? undefined,
          week_id: weekId,
          project_id: projectId,
          priority: note.priority,
          note_text: note.note_text,
          author: user?.display_name?.trim() || user?.username || null
        });
        if (res.error) throw new Error(res.error.message);
      }

      // Re-sync local ids so subsequent saves don't re-create records.
      await loadByRequest({
        project_id: projectId,
        week_id: weekId,
        week_start_date: selectedWeekStart
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [
    selectedWeekActive,
    selectedWeekEnd,
    selectedWeekId,
    selectedWeekNumber,
    selectedWeekStart,
    selectedWeekYear,
    projectId,
    reported,
    fixed,
    automated,
    pending,
    notAuto,
    releases,
    notes,
    loadByRequest,
    onWeekResolved,
    user?.display_name,
    user?.username
  ]);

  return {
    loading,
    error,
    saving,
    saveError,
    copying,
    copyMessage,
    isDirty,
    reported,
    fixed,
    automated,
    pending,
    notAuto,
    releases,
    notes,
    setReported,
    setFixed,
    setAutomated,
    setPending,
    setNotAuto,
    addRelease,
    updateRelease,
    removeRelease,
    addNote,
    updateNote,
    removeNote,
    copyFromPreviousWeek,
    discardChanges,
    save
  };
}
