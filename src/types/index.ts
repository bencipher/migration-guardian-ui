export type MigrationType = 'sql' | 'django' | 'alembic';
export type MigrationTypeSelection = MigrationType | 'auto';
export type ReviewStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type Decision = 'block' | 'approve_with_conditions' | 'approve' | 'review_required';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Provenance = 'source_database' | 'sandbox' | 'static' | 'unverified';
export type AnalysisScope = 'full' | 'static_only';

export interface ApiErrorDetail {
  code: string;
  message: string;
}

export interface Warning {
  code: string;
  message: string;
}

export interface ConnectionResult {
  status: 'ok';
  database: 'postgresql';
  read_only_compatible: boolean;
  inspected_tables: number;
  warnings: Warning[];
}

export interface MigrationMetadata {
  dependencies?: string[];
  operations?: string[];
  revision?: string;
  down_revision?: string;
  app?: string;
}

export interface MigrationInfo {
  source_type: MigrationTypeSelection;
  detected_type: MigrationType;
  filename: string;
  file_size?: number;
  metadata?: MigrationMetadata;
}

export interface Issue {
  title: string;
  severity: Severity;
  evidence: string[];
  impact: string;
  action: string;
}

export interface Diagnostics {
  framework: string;
  provider: string;
  model: string;
  duration_seconds: number;
  tool_calls: number;
  sandbox_sqlstate?: string;
}

export interface Assessment {
  review_id: string;
  status: ReviewStatus;
  decision: Decision | null;
  risk_level: RiskLevel | null;
  summary: string | null;
  issues: Issue[];
  verified_checks: string[];
  next_steps: string[];
  warnings: Warning[];
  error: ApiErrorDetail | null;
  migration?: MigrationInfo;
  analysis_scope?: AnalysisScope;
  unverified_checks?: string[];
  missing_context?: string[];
  diagnostics?: Diagnostics;
  timestamp?: string;
  duration_seconds?: number;
}

export type ReviewHistoryItem = Assessment;

export interface ReviewSubmission {
  review_id: string;
  status: 'queued';
}

export interface FileUploadResult {
  file: File;
  filename: string;
  file_size: number;
}

export interface User {
  email: string;
  name: string;
}

export interface WaitlistResult {
  success: boolean;
  message: string;
}

export interface DemoRequestResult {
  success: boolean;
  message: string;
}
