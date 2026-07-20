# Implementation Plan: Dark/Light Theme + PT/EN Language Toggle

**Status:** Ready for implementation (handover doc)
**Scope:** Frontend only — no backend, database, or migration changes required.
**Author context:** Derived from analysis of the existing Vite + React + TS weekly QA dashboard (SiDi design system).

---

## 1. Goal

1. **Theme toggle** — a dark/light mode switch, button visible in the top-right corner, always present (on login screen and dashboard).
2. **Language toggle** — a PT/EN switch, always visible next to the theme button.
3. **Single-language display** — replace the current "always show both languages" behavior with text in the *selected* language only.

---

## 2. Confirmed decisions (product owner answers)

| Decision | Choice |
| --- | --- |
| Default language (first visit) | **Browser locale** via `navigator.language` → map `pt-BR`/`pt` → `pt`, otherwise `en`. Fallback `pt`. |
| Default theme (first visit) | **Follow system** via `window.matchMedia('(prefers-color-scheme: dark)')`. |
| Persistence | **Persist both** to `localStorage` so they survive reloads/sessions. |

---

## 3. Current-state facts (read before implementing)

### 3.1 Why this is straightforward
- `src/utils/copy.ts` already stores **all** UI strings as `BilingualText = { en: string; pt: string }` (see `src/types/index.ts:1`).
- Today `bilingualText(text)` (`src/utils/copy.ts:123`) renders `en / pt` always. We just need a `t(text)` that returns `text[language]` instead.

### 3.2 Files that currently call `bilingualText(...)` (all must be migrated to `t(...)`)
- `src/App.tsx` (line 10, 33)
- `src/main.tsx` (line 6, 13)
- `src/components/Header/Header.tsx` (lines 1, 16, 17, 22, 26)
- `src/components/Auth/AuthScreen.tsx` (lines 3, 43, 44, 49, 56, 60, 67, 78, 89)
- `src/components/WeekSelector/WeekSelector.tsx` (line 1, 15)
- `src/components/ProjectNav/ProjectNav.tsx` (line 1, 14)
- `src/components/ReleaseTable/ReleaseTable.tsx` (lines 2, 12, 17) — note line 12 uses hardcoded `copy.emptyRelease.pt` (BUG to fix → use `t(copy.emptyRelease)`)
- `src/components/NotesSection/NotesSection.tsx` (lines 2, 18, 26)
- `src/components/IssueHistoryChart/IssueHistoryChart.tsx` (lines 13, 25, 44)
- `src/components/TestCaseDistributionChart/TestCaseDistributionChart.tsx` (lines 3, 17, 28)
- `src/components/forms.tsx` (lines 8, 20, 23, 40)
- `src/hooks/useEditLock.ts` (line 3, 38) — uses `${copy.lockActive.en} / ${copy.lockActive.pt}` hardcoded; change to `t(copy.lockActive)`.
- `src/App.tsx` `maintenanceTitles` and `PanelTabs` use `bilingualText(label)` (line 33) → `t(label)`.

### 3.3 Hardcoded chart labels that need NEW copy keys
These are not in `copy.ts` yet and must be added as `BilingualText` and passed through `t()`:
- `IssueHistoryChart.tsx` lines 54–55: `"Fixed issues"` / `"Reported issues"` (recharts `<Line name=...>` used in Legend/Tooltip).
- `TestCaseDistributionChart.tsx` lines 21–23: `"Automated"` / `"Pending Automation"` / `"Not Automated"` (pie `name` used in Legend/Tooltip).

### 3.4 Design system / theming facts
- All styling uses SiDi design-system CSS variables (e.g. `var(--surface-page)`, `var(--text-primary)`, `var(--border-default)`).
- The design system has **NO dark theme** (`themes: []` in `sidi-design-system/project/_ds_manifest.json`). All semantic tokens are light by definition.
- Semantic tokens to override for dark mode live in `sidi-design-system/project/tokens/colors.css` and are surfaced in `src/styles/globals.css` (`@import '../../sidi-design-system/project/styles.css'`).
- Charts reference tokens directly (`stroke="var(--status-pass)"`), so overriding the tokens automatically re-themes charts. No chart code changes needed for theming.
- **Do NOT edit the design system files** under `sidi-design-system/`. Add dark overrides in the app's own CSS.

### 3.5 Where the toggle buttons must live
- Currently `Header` (with action buttons) is rendered **only inside `App`**, not on `AuthScreen`.
- The theme + language buttons must be visible on the **login screen too**, so they must be rendered at the `Gate` level in `src/main.tsx`, *outside* both `App` and `AuthScreen`, as a fixed top-right control.

### 3.6 Entry HTML
- `index.html` currently has no anti-FOUC script. A dark-theme flash would occur without an early inline script.

---

## 4. Implementation steps

### Step 1 — Preferences context (`src/hooks/usePreferences.tsx`) [NEW FILE]
Create a context provider exposing language + theme + `t()`.

Suggested API:
```ts
export type Language = 'pt' | 'en';
export type Theme = 'light' | 'dark';

export function PreferencesProvider({ children }: { children: React.ReactNode }): JSX.Element

export function usePreferences(): {
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (text: BilingualText) => string;
};
```
Rules:
- `language`: init from `localStorage.getItem('qa.lang')` → else `navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'`. Persist on change.
- `theme`: init from `localStorage.getItem('qa.theme')` → else `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`. Persist on change.
- On theme change, also set `document.documentElement.setAttribute('data-theme', theme)`.
- On language change, also set `document.documentElement.setAttribute('lang', language === 'pt' ? 'pt-BR' : 'en')`.
- `t(text)` returns `text[language]`.

### Step 2 — `src/utils/copy.ts` changes
- Keep the `copy` object and `maintenanceTitles` as `BilingualText`.
- Add new keys (examples — translate accurately):
  ```ts
  fixedIssues: { en: 'Fixed issues', pt: 'Issues corrigidas' },
  reportedIssues: { en: 'Reported issues', pt: 'Issues reportadas' },
  automated: { en: 'Automated', pt: 'Automatizado' },
  pendingAutomation: { en: 'Pending Automation', pt: 'Pendente de automacao' },
  notAutomated: { en: 'Not Automated', pt: 'Nao automatizado' },
  ```
- Keep `bilingualText` only if anything still imports it; otherwise delete it and update all imports to use `t` from `usePreferences`. (Recommended: delete and migrate all callers.)

### Step 3 — `index.html` anti-FOUC inline script [BEFORE CSS]
Add in `<head>`, before the module script, something like:
```html
<script>
  (function () {
    var theme = localStorage.getItem('qa.theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    var lang = localStorage.getItem('qa.lang');
    if (!lang) {
      lang = (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
    }
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
  })();
</script>
```

### Step 4 — Dark theme token overrides (`src/styles/globals.css`)
Append a dark block. Override the **semantic** tokens (not raw neutrals) so the whole UI flips consistently:
```css
:root[data-theme='dark'] {
  --surface-page: var(--neutral-900);
  --surface-card: var(--neutral-800);
  --surface-sunken: var(--neutral-700);
  --surface-inverse: var(--neutral-0);
  --border-subtle: var(--neutral-700);
  --border-default: var(--neutral-600);
  --border-strong: var(--neutral-300);
  --text-primary: var(--neutral-0);
  --text-secondary: var(--neutral-300);
  --text-tertiary: var(--neutral-400);
  --text-inverse: var(--neutral-900);
  /* status backgrounds may need darkening; keep status fg tokens as-is or adjust */
  --status-pass-bg: #0c2f17;
  --status-fail-bg: #3a1414;
  --status-warning-bg: #3a2e10;
  --status-running-bg: #2a1740;
  --status-blocked-bg: var(--neutral-700);
}
```
> Verify contrast after implementation; adjust values as needed. Charts and components referencing these tokens will adapt automatically.

### Step 5 — `src/main.tsx` wiring
- Import `PreferencesProvider` and a new `PreferencesControls` component.
- Wrap `Gate` (or wrap `AuthProvider` content) so `PreferencesControls` renders **once**, fixed top-right, above both `App` and `AuthScreen`.
```tsx
<AuthProvider>
  <PreferencesProvider>
    <PreferencesControls />
    <Gate />
  </PreferencesProvider>
</AuthProvider>
```
- Change `Gate`'s loading state to use `t(copy.loading)` (needs to be inside `PreferencesProvider`; since `PreferencesControls` and `Gate` are both children, `Gate` can call `usePreferences()`).

### Step 6 — `src/components/PreferencesControls/PreferencesControls.tsx` [NEW FILE]
- Fixed-position container, top-right (`position: fixed; top: var(--space-3); right: var(--space-3); z-index: 50;`).
- Two buttons:
  - **Theme**: toggles `theme` (`usePreferences().toggleTheme()`); icon/label sun ☀ / moon 🌙 (or text). Accessible `aria-label`.
  - **Language**: toggles `language` between `pt`/`en`; label shows the *other* language or current (`PT`/`EN`). Accessible `aria-label`.
- Add a small `PreferencesControls.css` next to it.

### Step 7 — Migrate all `bilingualText(...)` → `t(...)`
For every file in §3.2:
1. Remove `bilingualText` from the `copy` import; import `usePreferences` and call `const { t } = usePreferences();` at the top of the component.
2. Replace `bilingualText(x)` with `t(x)`.
3. `useEditLock.ts` line 38: replace `` `${copy.lockActive.en} / ${copy.lockActive.pt}` `` with `t(copy.lockActive)` (the hook must be inside `PreferencesProvider`; verify provider wraps the hook's usage — it does, since it's used within `App`).
4. `ReleaseTable.tsx` line 12: change `body={copy.emptyRelease.pt}` → `body={t(copy.emptyRelease)}`.

### Step 8 — Chart label translation
- `IssueHistoryChart.tsx`: `name={t(copy.fixedIssues)}` / `name={t(copy.reportedIssues)}` on the two `<Line>` elements.
- `TestCaseDistributionChart.tsx`: build `data` names with `t(copy.automated)` etc.

---

## 5. Edge cases / acceptance criteria
- [ ] Reloading the page keeps the chosen theme and language (localStorage).
- [ ] First visit with no storage: language follows browser locale; theme follows OS setting.
- [ ] No flash of incorrect theme on load (inline script in `index.html`).
- [ ] Theme + language buttons visible on **both** login and dashboard, top-right, always.
- [ ] Only ONE language shown at a time everywhere (auth, headers, charts, legends, tooltips, empty states, forms, lock messages).
- [ ] Charts (lines + pie) re-theme correctly via tokens; legend/tooltip labels translated.
- [ ] `<html lang>` reflects selected language.

---

## 6. Verification commands
Run from repo root:
- `npm run lint`
- `npm run typecheck` (or the project's typecheck script if named differently — check `package.json`)
- `npm run test` (existing tests do **not** reference `copy`/`bilingualText`, so no test updates expected; confirm after changes)
- `npm run dev` for manual verification of the acceptance criteria above.

---

## 7. Files summary
**NEW**
- `src/hooks/usePreferences.tsx`
- `src/components/PreferencesControls/PreferencesControls.tsx`
- `src/components/PreferencesControls/PreferencesControls.css`

**EDIT**
- `src/utils/copy.ts` (add 5 keys; remove/keep `bilingualText`)
- `index.html` (anti-FOUC script)
- `src/styles/globals.css` (dark token block)
- `src/main.tsx` (provider + controls wiring)
- `src/App.tsx`
- `src/components/Header/Header.tsx`
- `src/components/Auth/AuthScreen.tsx`
- `src/components/WeekSelector/WeekSelector.tsx`
- `src/components/ProjectNav/ProjectNav.tsx`
- `src/components/ReleaseTable/ReleaseTable.tsx`
- `src/components/NotesSection/NotesSection.tsx`
- `src/components/IssueHistoryChart/IssueHistoryChart.tsx`
- `src/components/TestCaseDistributionChart/TestCaseDistributionChart.tsx`
- `src/components/forms.tsx`
- `src/hooks/useEditLock.ts`

**NO CHANGES**
- Backend (`server/`), DB migrations (`db/`), design system (`sidi-design-system/`), tests (unless they break).
