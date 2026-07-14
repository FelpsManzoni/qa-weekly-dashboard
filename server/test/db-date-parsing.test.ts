import { types } from 'pg';

// pg's default `date` (OID 1082) parser returns a JS Date, which round-trips through
// res.json() as a full ISO timestamp instead of the plain 'YYYY-MM-DD' string the frontend
// expects (Week.start_date/end_date, Release.released_date/verified_date). Importing db.ts
// registers the raw-string override as a side effect; verify it actually took.
await import('../src/db.js');

it('returns date columns as plain YYYY-MM-DD strings instead of parsed Date objects', () => {
  const parseDate = types.getTypeParser(types.builtins.DATE);
  expect(parseDate('2026-05-11')).toBe('2026-05-11');
});
