import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, HttpError, parseBody } from '../http.js';
import { testCaseDistributionSchema } from '../validation.js';

export const testCasesRouter = Router();

testCasesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const weekId = req.query.week_id as string | undefined;
    const weekStartDate = req.query.week_start_date as string | undefined;
    const projectId = req.query.project_id as string | undefined;
    if ((!weekId && !weekStartDate) || !projectId) {
      res.json([]);
      return;
    }

    const rows = weekId
      ? await query(
          `select
             coalesce(max(tcd.id::text), concat($2::text, ':', $1::text)) as id,
             $2::uuid as week_id,
             $1::uuid as project_id,
             count(tcd.id)::integer as record_count,
             coalesce(sum(tcd.automated_count), 0)::integer as automated_count,
             (coalesce(sum(tcd.pending_auto_count), 0) - coalesce(sum(tcd.automated_count), 0))::integer as pending_auto_count,
             coalesce(sum(tcd.not_auto_count), 0)::integer as not_auto_count
           from test_case_distributions tcd
           join weeks w on w.id = tcd.week_id
           where tcd.project_id = $1::uuid
             and w.start_date <= (select start_date from weeks where id = $2::uuid)`,
          [projectId, weekId]
        )
      : await query(
          `select
             coalesce(max(tcd.id::text), concat($2::text, ':', $1::text)) as id,
             (select id from weeks where start_date = $2::date limit 1) as week_id,
             $1::uuid as project_id,
             count(tcd.id)::integer as record_count,
             coalesce(sum(tcd.automated_count), 0)::integer as automated_count,
             (coalesce(sum(tcd.pending_auto_count), 0) - coalesce(sum(tcd.automated_count), 0))::integer as pending_auto_count,
             coalesce(sum(tcd.not_auto_count), 0)::integer as not_auto_count
           from test_case_distributions tcd
           join weeks w on w.id = tcd.week_id
           where tcd.project_id = $1::uuid
             and w.start_date <= $2::date`,
          [projectId, weekStartDate]
        );

    if (weekId && rows[0]?.record_count === 0) {
      res.json([]);
      return;
    }

    res.json(
      rows.map((row) => {
        const aggregate = { ...row };
        delete aggregate.record_count;
        return aggregate;
      })
    );
  })
);

testCasesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(testCaseDistributionSchema, req.body);
    const aggregate = await queryOne<{ pending_auto_count: number }>(
      `with selected_week as (
         select start_date from weeks where id = $1
       ),
       prior_totals as (
         select
           coalesce(sum(tcd.pending_auto_count), 0) as pending_created,
           coalesce(sum(tcd.automated_count), 0) as automated_done
         from test_case_distributions tcd
         join weeks w on w.id = tcd.week_id
         join selected_week sw on w.start_date < sw.start_date
         where tcd.project_id = $2
       )
       select (pending_created - automated_done + $3::integer - $4::integer)::integer as pending_auto_count
       from prior_totals`,
      [body.week_id, body.project_id, body.pending_auto_count, body.automated_count]
    );

    if (aggregate && aggregate.pending_auto_count < 0) {
      throw new HttpError(
        400,
        'Automated this week cannot exceed the available pending automation total.',
        'VALIDATION_ERROR'
      );
    }

    const row = await queryOne(
      `insert into test_case_distributions
         (week_id, project_id, automated_count, pending_auto_count, not_auto_count)
       values ($1, $2, $3, $4, $5)
       on conflict (week_id, project_id) do update set
         automated_count = excluded.automated_count,
         pending_auto_count = excluded.pending_auto_count,
         not_auto_count = excluded.not_auto_count,
         updated_at = now()
       returning *`,
      [body.week_id, body.project_id, body.automated_count, body.pending_auto_count, body.not_auto_count]
    );
    res.status(201).json(row);
  })
);
