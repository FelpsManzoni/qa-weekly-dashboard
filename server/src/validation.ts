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

export const weekSchema = z
  .object({
    week_number: z.number().int().min(1).max(53),
    start_date: z.string(),
    end_date: z.string(),
    is_active: z.boolean().default(true)
  })
  .refine((v) => new Date(v.end_date) > new Date(v.start_date), {
    message: 'End date must be after start date.',
    path: ['end_date']
  });

export const projectSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]+$/, 'Project code must be uppercase alphanumeric.'),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
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
  date: z.string(),
  status: z.string().min(1),
  critical_issues: z.string().nullable().optional(),
  changelog: z.string().nullable().optional()
});

export const noteSchema = z.object({
  week_id: z.string().uuid(),
  project_id: z.string().uuid(),
  priority: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  note_text: z.string().trim().min(1),
  author: z.string().nullable().optional()
});

export const lockSchema = z.object({
  resource_type: z.string().min(1),
  resource_id: z.string().uuid()
});
