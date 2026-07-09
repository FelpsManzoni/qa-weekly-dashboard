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
  calendar_year: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

export type WeekDraft = Omit<Week, 'id'> & {
  id: string | null;
};

export const RELEASE_STATUSES = ['Approved', 'Failed', 'Conditionally Approved', 'Blocked'] as const;
export type ReleaseStatus = (typeof RELEASE_STATUSES)[number];

export type Project = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  lead_qa_user_id: string | null;
  lead_qa_name: string | null;
  client: string | null;
  main_technology_scope: string | null;
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
  status: ReleaseStatus;
  issue_count_a: number;
  issue_count_b: number;
  issue_count_c: number;
  release_notes: string | null;
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

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
};

export type DashboardSelection = {
  selectedWeekId: string | null;
  selectedProjectId: string | null;
};

export type ProjectDataPayload = {
  issueMetric: IssueMetric | null;
  testCase: TestCaseDistribution | null;
  releases: ReleaseVersion[];
  notes: PriorityNote[];
};

export type ProjectDataRequest = {
  project_id: string;
  week_id?: string | null;
  week_start_date?: string | null;
};

export type AppSection = 'dashboard' | 'projects' | 'project-data';

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
