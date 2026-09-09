export type MigrationType = 'sql' | 'django' | 'alembic';
export type MigrationTypeSelection = MigrationType | 'auto';

export type Decision = 'block' | 'approve_with_conditions' | 'approve' | 'review_required';
export type RiskLevel = 'high' | 'medium' | 'low';
export type Severity = 'high' | 'medium' | 'low';
export type Provenance = 'source_database' | 'sandbox' | 'static' | 'unverified';
export type AnalysisScope = 'full' | 'static_only';

export interface ConnectionResult {
  connected: boolean;
  database?: string;
  schema?: string;
  postgres_version?: string;
  read_only_verified?: boolean;
  error?: string;
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
  status: 'verified' | 'unverified';
  evidence: {
    provenance: Provenance;
    message: string;
  };
  impact: string;
  action: string;
}

export interface VerifiedCheck {
  message: string;
  provenance: Provenance;
}

export interface UnverifiedCheck {
  message: string;
  provenance: Provenance;
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
  id: string;
  decision: Decision;
  risk_level: RiskLevel;
  analysis_scope: AnalysisScope;
  summary: string;
  migration: MigrationInfo;
  issues: Issue[];
  verified_checks: VerifiedCheck[];
  unverified_checks: UnverifiedCheck[];
  next_steps: string[];
  missing_context?: string[];
  diagnostics: Diagnostics;
  timestamp: string;
  duration_seconds: number;
}

export interface ReviewHistoryItem {
  id: string;
  migration_name: string;
  type: MigrationType;
  decision: Decision;
  risk_level: RiskLevel;
  database_name: string;
  timestamp: string;
  duration_seconds: number;
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

export interface FileUploadResult {
  filename: string;
  file_size: number;
  detected_type: MigrationType;
  metadata?: MigrationMetadata;
}
