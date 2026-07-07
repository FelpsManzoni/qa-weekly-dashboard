export type BilingualText = {
  en: string;
  pt: string;
};

export type ApiError = {
  message: string;
  code: string;
};

export type ApiListResponse<T> = {
  data: T[];
  error: ApiError | null;
};

export type ApiItemResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

export type Week = {
  id: string;
  week_number: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

export type Project = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

export type IssueMetric = {
  id: string;
  week_id: string;
  project_id: string;
  reported_count: number;
  fixed_count: number;
};

export type TestCaseDistribution = {
  id: string;
  week_id: string;
  project_id: string;
  automated_count: number;
  pending_auto_count: number;
  not_auto_count: number;
};

export type ReleaseVersion = {
  id: string;
  week_id: string;
  project_id: string;
  version: string;
  date: string;
  status: string;
  critical_issues: string | null;
  changelog: string | null;
};

export type PriorityNote = {
  id: string;
  week_id: string;
  project_id: string;
  priority: 0 | 1 | 2;
  note_text: string;
  author: string | null;
  created_at?: string;
};

export type EditLock = {
  id: string;
  resource_type: string;
  resource_id: string;
  owner_id: string;
  expires_at: string;
};

export type DashboardSelection = {
  selectedWeekId: string | null;
  selectedProjectId: string | null;
};

export type MaintenanceMode =
  | 'weeks'
  | 'projects'
  | 'issues'
  | 'test-cases'
  | 'releases'
  | 'notes';

export type AsyncState<T> = {
  data: T;
  isLoading: boolean;
  error: string | null;
};
