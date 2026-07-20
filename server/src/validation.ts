import { z } from 'zod';

// Mirrors src/utils/validation.ts on the frontend so the server is the source of truth.

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
  display_name: z.string().max(255).optional()
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export const WEEK_STATUSES = ['Approved', 'Failed', 'Conditionally Approved', 'Blocked'] as const;

function isoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export const weekSchema = z
  .object({
    week_number: z.number().int().min(1).max(53),
    calendar_year: z.number().int().min(2000).max(2999),
    start_date: z.string().refine(isoDate, { message: 'start_date must be YYYY-MM-DD.' }),
    end_date: z.string().refine(isoDate, { message: 'end_date must be YYYY-MM-DD.' }),
    is_active: z.boolean().default(true)
  })
  .superRefine((v, ctx) => {
    const start = new Date(v.start_date);
    const end = new Date(v.end_date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid date.', path: ['start_date'] });
      return;
    }
    // Monday = ISO day 1, Sunday = ISO day 7.
    const startDay = (start.getUTCDay() + 6) % 7; // 0 = Monday
    const endDay = (end.getUTCDay() + 6) % 7; // 6 = Sunday
    if (startDay !== 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'start_date must be a Monday.', path: ['start_date'] });
    }
    if (endDay !== 6) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'end_date must be a Sunday.', path: ['end_date'] });
    }
    const spanDays = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    if (spanDays !== 6) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Week must span exactly 7 days (Monday to Sunday).', path: ['end_date'] });
    }
  });

export const projectSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]+$/, 'Project code must be uppercase alphanumeric.'),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  lead_qa_user_id: z.string().uuid().nullable().optional(),
  client: z.string().max(255).nullable().optional(),
  main_technology_scope: z.string().max(255).nullable().optional(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true)
});

export const issueMetricSchema = z.object({
  week_id: z.string().uuid(),
  project_id: z.string().uuid(),
  reported_count: z.number().int().min(0),
  fixed_count: z.number().int().min(0)
});

export const testCaseDistributionSchema = z.object({
  week_id: z.string().uuid(),
  project_id: z.string().uuid(),
  automated_count: z.number().int().min(0),
  pending_auto_count: z.number().int().min(0),
  not_auto_count: z.number().int().min(0)
});

export const releaseSchema = z.object({
  week_id: z.string().uuid(),
  project_id: z.string().uuid(),
  version: z.string().min(1),
  released_date: z.string().refine(isoDate, { message: 'released_date must be YYYY-MM-DD.' }),
  verified_date: z.string().refine(isoDate, { message: 'verified_date must be YYYY-MM-DD.' }).nullable(),
  status: z.enum(WEEK_STATUSES),
  tests_pass: z.number().int().min(0),
  tests_fail: z.number().int().min(0),
  tests_not_tested: z.number().int().min(0),
  issue_count_a: z.number().int().min(0).default(0),
  issue_count_b: z.number().int().min(0).default(0),
  issue_count_c: z.number().int().min(0).default(0),
  release_notes: z.string().nullable().optional()
});

export const noteSchema = z.object({
  week_id: z.string().uuid(),
  project_id: z.string().uuid(),
  priority: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  note_text: z.string().trim().min(1),
  author: z.string().nullable().optional()
});

export const lockSchema = z.object({
  resource_type: z.string().min(1),
  resource_id: z.string().uuid()
});
