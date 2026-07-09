import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProjectData } from '../api/projectData';
import { saveIssueMetric } from '../api/issues';
import { saveTestCaseDistribution } from '../api/testCases';
import { saveRelease } from '../api/releases';
import { saveNote } from '../api/notes';
import { apiDelete } from '../api/client';
import type { ReleaseStatus } from '../types';

export type ReleaseDraft = {
  id: string | null;
  version: string;
  date: string;
  status: ReleaseStatus;
  issue_count_a: number;
  issue_count_b: number;
  issue_count_c: number;
  release_notes: string;
};

export type NoteDraft = {
  id: string | null;
  priority: 0 | 1 | 2;
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

export function useProjectDataEditor(weekId: string | null, projectId: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [reported, setReported] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [issueEnabled, setIssueEnabled] = useState(false);

  const [automated, setAutomated] = useState(0);
  const [pending, setPending] = useState(0);
  const [notAuto, setNotAuto] = useState(0);
  const [testEnabled, setTestEnabled] = useState(false);

  const [releases, setReleases] = useState<ReleaseDraft[]>([]);
  const [notes, setNotes] = useState<NoteDraft[]>([]);

  const loadedRef = useRef<Loaded>(emptyLoaded);

  const load = useCallback(async () => {
    if (!weekId || !projectId) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: loadError } = await fetchProjectData(weekId, projectId);
      if (loadError) {
        throw new Error(loadError.message);
      }
      const payload = data ?? { issueMetric: null, testCase: null, releases: [], notes: [] };
      setReported(payload.issueMetric?.reported_count ?? 0);
      setFixed(payload.issueMetric?.fixed_count ?? 0);
      setIssueEnabled(Boolean(payload.issueMetric));
      setAutomated(payload.testCase?.automated_count ?? 0);
      setPending(payload.testCase?.pending_auto_count ?? 0);
      setNotAuto(payload.testCase?.not_auto_count ?? 0);
      setTestEnabled(Boolean(payload.testCase));
      setReleases(
        payload.releases.map((release) => ({
          id: release.id,
          version: release.version,
          date: release.date,
          status: release.status,
          issue_count_a: release.issue_count_a,
          issue_count_b: release.issue_count_b,
          issue_count_c: release.issue_count_c,
          release_notes: release.release_notes ?? ''
        }))
      );
      setNotes(
        payload.notes.map((note) => ({
          id: note.id,
          priority: note.priority,
          note_text: note.note_text,
          author: note.author ?? ''
        }))
      );
      loadedRef.current = {
        issueId: payload.issueMetric?.id ?? null,
        testId: payload.testCase?.id ?? null,
        releaseIds: payload.releases.map((release) => release.id),
        noteIds: payload.notes.map((note) => note.id)
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [weekId, projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  const addRelease = useCallback(() => {
    setReleases((current) => [
      ...current,
      { id: null, version: '', date: '', status: 'Approved', issue_count_a: 0, issue_count_b: 0, issue_count_c: 0, release_notes: '' }
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

  const save = useCallback(async () => {
    if (!weekId || !projectId) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    const loaded = loadedRef.current;
    try {
      if (issueEnabled) {
        const res = await saveIssueMetric({
          id: loaded.issueId ?? '',
          week_id: weekId,
          project_id: projectId,
          reported_count: reported,
          fixed_count: fixed
        });
        if (res.error) throw new Error(res.error.message);
      }
      if (testEnabled) {
        const res = await saveTestCaseDistribution({
          id: loaded.testId ?? '',
          week_id: weekId,
          project_id: projectId,
          automated_count: automated,
          pending_auto_count: pending,
          not_auto_count: notAuto
        });
        if (res.error) throw new Error(res.error.message);
      }

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
          date: release.date,
          status: release.status,
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
          author: note.author || null
        });
        if (res.error) throw new Error(res.error.message);
      }

      // Re-sync local ids so subsequent saves don't re-create records.
      await load();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [weekId, projectId, issueEnabled, reported, fixed, testEnabled, automated, pending, notAuto, releases, notes, load]);

  return {
    loading,
    error,
    saving,
    saveError,
    reported,
    fixed,
    issueEnabled,
    automated,
    pending,
    notAuto,
    testEnabled,
    releases,
    notes,
    setReported,
    setFixed,
    setIssueEnabled,
    setAutomated,
    setPending,
    setNotAuto,
    setTestEnabled,
    addRelease,
    updateRelease,
    removeRelease,
    addNote,
    updateNote,
    removeNote,
    save
  };
}
