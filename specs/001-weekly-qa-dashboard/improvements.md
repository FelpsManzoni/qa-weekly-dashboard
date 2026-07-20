# Improvements Identified (Non-Task Gaps)

Gaps found during static verification of the codebase against the spec.
These are separate from the two unchecked tasks (T085 — coverage gate, T086 — quickstart validation).

---

## 1. Edit Lock Enforcement is Incomplete

**Spec Ref**: FR-032, FR-033

**Problem**: `useEditLock` is only wired in `ReleaseForm` and `NoteForm` (`src/components/forms.tsx:175`, `src/components/forms.tsx:220`). The other maintenance forms (Week, Project, IssueMetric, TestCaseDistribution) never acquire locks. Additionally, even in Release/Note forms, `handleSubmit` does **not** check `lock.error` before calling the save API — the lock notice is displayed but submission is not blocked.

**Fix**: Either apply locks to all six maintenance forms as spec requires, or document the scoping decision. Add a guard in submit handlers:

```ts
if (lock.error) return;
```

---

## 2. No Inactivity Heartbeat for Edit Locks

**Spec Ref**: FR-033 (lock must expire after 15 minutes of inactivity)

**Problem**: `useEditLock` acquires the lock on mount with a 15-minute expiry but never refreshes it on user activity (keypress, mousemove, etc.). A user actively editing past the 15-minute mark will have their lock expire and be silently overridden by `acquireLock`'s `upsertRow`.

**Fix**: Add an event listener in `useEditLock` that extends the lock's `expires_at` via a periodic upsert (e.g., every 5 minutes) or clears/re-acquires the lock on user interaction.

---

## 3. Coverage Threshold Not Enforced

**Spec Ref**: Constitution Principle II — "Minimum 80% line coverage"

**Problem**: `vite.config.ts` has coverage configuration but no `thresholds` block. The coverage step reports numbers but does not fail the build when coverage drops below 80%.

**Fix**: Add to `vite.config.ts`:

```ts
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

---

## 4. Several Forms Excluded from Coverage

**Problem**: `vite.config.ts` explicitly excludes six form components (`WeekForm`, `ProjectForm`, `IssueMetricForm`, `TestCaseDistributionForm`, `ReleaseForm`, `NoteForm`) from coverage instrumentation. This means the maintenance flows — the core data-entry UX — are not tracked.

**Fix**: Remove the exclusion entries from `vite.config.ts`, or, if the forms are hard to test, add unit tests that cover them first, then remove the exclusion.

---

## 5. Hardcoded Colors Instead of Design-System Tokens

**Spec Ref**: Plan.md lines 44-46 — "No hardcoded colors." Constitution Principle III.

**Problem**: `src/components/Header/Header.css:29-30` uses `rgba(255, 255, 255, 0.15)` and `rgba(255, 255, 255, 0.3)` instead of design-system custom properties.

**Fix**: Replace with design-system tokens, e.g.:

```css
background: var(--sidi-header-overlay);
border: 1px solid var(--sidi-header-border);
```

---

## 6. Issue History Ordering is by `created_at`, Not Week Number

**Problem**: `src/api/issues.ts:5` orders by `created_at` ascending. When test data is inserted in non-chronological week order, or when `created_at` values are close together, the line chart will show data points in the wrong sequence across the X axis.

**Fix**: The `fetchIssueHistory` query should include a join to `weeks` and order by `week_number`:

```ts
// join via a view or add week_number to the query builder
builder.eq('project_id', projectId).order('week_id', { ascending: true });
```

Or, change the approach to join weeks and sort by `weeks.week_number`.

---

## 7. Issue History is Not Scoped to Selected Week Range

**Spec Ref**: FR-009 — "display an Issue History line chart comparing Fixed Issues and Reported Issues across weeks" and "show historical issue values across the visible week range"

**Problem**: `src/hooks/useIssueHistory.ts` fetches all issue metrics for the selected project ID with no date/week-range filter. The chart shows all data for that project, ignoring the selected week context. If the user selects Week 27, they should see historical data covering a sensible range around that week, not every metric ever recorded.

**Fix**: Pass `selectedWeekId` to `useIssueHistory` and use it to query a range (e.g., ±4 weeks), or apply a filter after fetching.

---

## 8. Supabase Client Missing Strong Typing

**Problem**: `src/api/client.ts:4` declares `type Database = any`. This bypasses all TypeScript safety for database queries — column names, return types, and relationships are unchecked.

**Fix**: Generate Supabase types from the database schema (`supabase gen types typescript --linked`) and replace `any` with the generated `Database` type.

---

## 9. Notes Section Sorting Relies Entirely on API Order

**Spec Ref**: FR-017, FR-018 (notes sorted by priority with color coding)

**Problem**: `src/api/notes.ts:6` orders by `priority` ascending at the database level. This works but is fragile: if notes are re-fetched via a different code path or if offline data is used, client-side sort is absent in `src/components/NotesSection/NotesSection.tsx`.

**Fix**: Add a defensive client-side sort in `NotesSection`:

```ts
const sorted = [...notes].sort((a, b) => a.priority - b.priority);
```

---

## 10. Issue History Chart Does Not Receive Selected Week

**Problem**: `src/App.tsx:42` calls `useIssueHistory(dashboard.selectedProjectId)` with only the project ID. The chart cannot highlight which week corresponds to the current selection, and `notes` and `releases` both receive `selectedWeekId` while issues do not.

**Fix**: Add `selectedWeekId` to `useIssueHistory` to enable visual highlighting of the active week on the chart line or to scope the historical range.

---

## 11. Duplicate-Prevention Approaches Are Inconsistent

**Spec Ref**: FR-022a, FR-024a

**Problem**: Issue metrics use a pure `upsertRow` with `onConflict: 'week_id,project_id'` (`src/api/issues.ts:13`). Test case distributions do the same (`src/api/testCases.ts:16`). However, the `week` and `project` services save by checking `payload.id` and routing to either `upsertRow` or `updateRow`. This dual approach is fragile — `upsertRow` in Supabase requires the table to have a unique constraint and can silently insert duplicates if the constraint is missing or misconfigured.

**Fix**: Standardize to one pattern. Since the DB already has `UNIQUE (week_id, project_id)` on both tables, confirm that Supabase upsert behaves correctly in all scenarios and add a test that exercises the duplicate-protection path.

---

## 12. `selectedNote` in App.tsx Uses `data[0]`

**Problem**: `src/App.tsx:53` picks `notes.data[0]` as the "selected" note for the form. If there are multiple notes, only the first one can be edited through the maintenance panel. The same pattern applies to `selectedDistribution` and `selectedRelease`.

**Fix**: Either provide a note-picker/list within the maintenance panel, or pass the whole array so each note can be independently selected for editing.
