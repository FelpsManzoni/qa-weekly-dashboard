import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { errorHandler } from './http.js';
import { requireAuth } from './auth.js';
import { authRouter } from './routes/auth.js';
import { weeksRouter } from './routes/weeks.js';
import { projectsRouter } from './routes/projects.js';
import { issuesRouter } from './routes/issues.js';
import { testCasesRouter } from './routes/testCases.js';
import { releasesRouter } from './routes/releases.js';
import { notesRouter } from './routes/notes.js';
import { locksRouter } from './routes/locks.js';

/** Builds the Express app. Separated from index.ts so tests can import it without listening. */
export function createApp() {
  const app = express();

  app.use(express.json());
  if (env.corsOrigins.length) {
    app.use(cors({ origin: env.corsOrigins }));
  }

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  // Auth is public; everything else requires a valid token.
  app.use('/api/auth', authRouter);
  app.use('/api/weeks', requireAuth, weeksRouter);
  app.use('/api/projects', requireAuth, projectsRouter);
  app.use('/api/issue-metrics', requireAuth, issuesRouter);
  app.use('/api/test-case-distributions', requireAuth, testCasesRouter);
  app.use('/api/releases', requireAuth, releasesRouter);
  app.use('/api/notes', requireAuth, notesRouter);
  app.use('/api/locks', requireAuth, locksRouter);

  app.use(errorHandler);

  return app;
}
