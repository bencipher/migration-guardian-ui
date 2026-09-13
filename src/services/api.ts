import type {
  Assessment,
  ConnectionResult,
  DemoRequestResult,
  FileUploadResult,
  MigrationType,
  MigrationTypeSelection,
  ReviewHistoryItem,
  User,
  WaitlistResult,
} from '@/types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function testConnection(connectionUrl: string): Promise<ConnectionResult> {
  await delay(1400);

  if (!connectionUrl || !connectionUrl.startsWith('postgresql://')) {
    return {
      connected: false,
      error: 'Invalid connection URL format. Expected postgresql://...',
    };
  }

  if (connectionUrl.includes('wrong') || connectionUrl.includes('fail')) {
    return {
      connected: false,
      error: 'Authentication failed — verify the username and password.',
    };
  }

  if (connectionUrl.includes('down') || connectionUrl.includes('unreachable')) {
    return {
      connected: false,
      error: 'Database unreachable — the host could not be reached.',
    };
  }

  return {
    connected: true,
    database: 'app_production',
    schema: 'public',
    postgres_version: '16.3',
    read_only_verified: true,
  };
}

export async function detectMigrationType(
  filename: string,
  content: string,
  explicitType: MigrationTypeSelection,
): Promise<FileUploadResult> {
  await delay(600);

  const lower = filename.toLowerCase();
  const ext = lower.split('.').pop() || '';
  let detectedType: MigrationType;

  if (ext === 'sql') {
    detectedType = 'sql';
  } else if (ext === 'py') {
    if (content.includes('from django.db') || content.includes('migrations.')) {
      detectedType = 'django';
    } else if (content.includes('from alembic') || content.includes('revision =') || content.includes('down_revision')) {
      detectedType = 'alembic';
    } else {
      detectedType = explicitType === 'auto' ? 'django' : (explicitType as MigrationType);
    }
  } else {
    detectedType = explicitType === 'auto' ? 'sql' : (explicitType as MigrationType);
  }

  const result: FileUploadResult = {
    filename,
    file_size: content.length,
    detected_type: detectedType,
  };

  if (detectedType === 'django') {
    result.metadata = {
      app: 'orders',
      dependencies: ['orders.0041_previous'],
      operations: ['RunPython', 'AlterField', 'AddConstraint'],
    };
  } else if (detectedType === 'alembic') {
    result.metadata = {
      revision: 'a1b2c3d4',
      down_revision: 'e5f6g7h8',
      operations: ['add_column', 'create_index'],
    };
  }

  return result;
}

const sqlAssessment: Assessment = {
  review_id: 'rev_001',
  status: 'completed',
  decision: 'block',
  risk_level: 'high',
  summary:
    'The migration will fail against the current source data because existing rows violate the proposed constraints.',
  issues: [
    {
      title: 'Existing rows violate NOT NULL constraint',
      severity: 'high',
      evidence: [
        'The migration adds a SET NOT NULL on the dispatched_at column.',
        'A source inspection found 317 rows where dispatched_at IS NULL.',
      ],
      impact: 'SET NOT NULL will fail before the migration completes.',
      action: 'Backfill or remove NULL values before deploying.',
    },
    {
      title: 'Existing rows violate weight constraint',
      severity: 'high',
      evidence: [
        'The migration adds a CHECK constraint requiring weight_grams > 0.',
        'A source inspection found 14 rows where weight_grams <= 0.',
      ],
      impact: 'The CHECK constraint cannot be validated against the current data.',
      action: 'Correct invalid weight values before deployment.',
    },
    {
      title: 'Potential blocking table validation',
      severity: 'medium',
      evidence: [
        'The migration applies multiple constraints to the shipments table.',
        'Production table size and write volume are unknown.',
      ],
      impact: 'Constraint validation may affect production traffic.',
      action: 'Plan deployment during lower traffic or use an online-safe validation strategy.',
    },
  ],
  verified_checks: [
    '317 NULL dispatched_at rows found in source database',
    '14 non-positive weight rows found in source database',
    'Candidate failed in sandbox with SQLSTATE 23502',
    'Source inspection ran read-only',
  ],
  next_steps: [
    'Backfill dispatched_at for existing NULL rows.',
    'Correct non-positive weight values.',
    'Re-run Migration Guardian before deployment.',
    'Schedule deployment during a low-traffic window.',
  ],
  warnings: [],
  error: null,
  migration: {
    source_type: 'sql',
    detected_type: 'sql',
    filename: '20260909_enforce_shipment_constraints.sql',
    file_size: 1420,
  },
  analysis_scope: 'full',
  diagnostics: {
    framework: 'strands',
    provider: 'openai',
    model: 'gpt-5.6-sol',
    duration_seconds: 8.4,
    tool_calls: 4,
    sandbox_sqlstate: '23502',
  },
  timestamp: new Date().toISOString(),
  duration_seconds: 8.4,
};

const approveWithConditionsAssessment: Assessment = {
  review_id: 'rev_004',
  status: 'completed',
  decision: 'approve_with_conditions',
  risk_level: 'medium',
  summary:
    'The migration executed successfully in the sandbox, but deployment should proceed only after confirming the tag rollout and backfill behavior, validating the new uniqueness rule, and planning for production locking.',
  issues: [
    {
      title: '`mainsite_events.tag` becomes required with no database default',
      severity: 'medium',
      evidence: [
        'The migration adds `tag` as `text DEFAULT \'event\' NOT NULL` and then removes the database default.',
        'The migration executed successfully in the sandbox, so existing sandbox rows were accepted and populated.',
      ],
      impact:
        'After the default is removed, inserts that do not supply a non-NULL `tag` will fail. Compatibility with all application versions, jobs, and fixtures has not been established.',
      action:
        'Ensure every writer supplies a non-NULL `tag` before deployment. For a rolling deployment, retain the default temporarily and remove it in a later migration.',
    },
    {
      title: 'Existing `mainsite_events.tag` values will be backfilled as `event`',
      severity: 'medium',
      evidence: [
        'The migration uses the fixed value `event` when adding `mainsite_events.tag`.',
        'The source table has an estimated 3 rows.',
      ],
      impact:
        'All existing rows will receive the same value, which may not accurately represent their historical meaning.',
      action: 'Confirm `event` is correct for every existing row; if row-specific history matters, use a data-derived backfill.',
    },
    {
      title: '`max_volunteer_needed` will become globally unique',
      severity: 'medium',
      evidence: [
        'The migration adds a UNIQUE constraint to the nullable integer column `mainsite_events.max_volunteer_needed`.',
        'The source check returned no conflicting non-NULL values, and the constraint was created successfully in the sandbox.',
      ],
      impact:
        'Future events cannot share the same non-NULL volunteer limit, while multiple NULL values remain allowed. This may impose unintended business behavior.',
      action:
        'Confirm global uniqueness is intended. Otherwise remove the constraint. Recheck live data for duplicate non-NULL values immediately before deployment and account for concurrent writes.',
    },
    {
      title: 'Migration DDL may block writes',
      severity: 'medium',
      evidence: [
        'The migration performs three `ALTER TABLE` statements and creates a regular UNIQUE constraint.',
        'Sandbox execution completed successfully in about 0.59 seconds.',
      ],
      impact:
        'Production lock duration cannot be inferred from the sandbox because production table size, write volume, PostgreSQL version, and lock conditions are unknown.',
      action:
        'Deploy in a controlled window with bounded lock and statement timeouts, monitor lock acquisition, and prepare a retry or rollback plan. For a large or busy table, consider a staged approach with a concurrently built unique index where supported.',
    },
  ],
  verified_checks: [],
  next_steps: [
    'Confirm all writers provide `tag`, or retain its default during the rollout compatibility window.',
    'Validate that `event` is the correct backfill for all existing rows.',
    'Confirm the uniqueness requirement and run a live duplicate check immediately before deployment.',
    'Assess production table size and traffic, then deploy with lock monitoring, timeouts, and a rollback plan.',
    'Verify the resulting schema after deployment.',
  ],
  warnings: [
    {
      code: 'privileged_source_role',
      message:
        'This database role has elevated privileges. Migration Guardian will use the source connection in read-only mode. A dedicated read-only role is recommended for production use.',
    },
  ],
  error: null,
  migration: {
    source_type: 'sql',
    detected_type: 'sql',
    filename: '0012_add_tag_and_unique_constraint.sql',
    file_size: 890,
  },
  analysis_scope: 'full',
  diagnostics: {
    framework: 'strands',
    provider: 'openai',
    model: 'gpt-5.6-sol',
    duration_seconds: 8.2,
    tool_calls: 5,
  },
  timestamp: new Date().toISOString(),
  duration_seconds: 8.2,
};

const djangoAssessment: Assessment = {
  review_id: 'rev_002',
  status: 'completed',
  decision: 'review_required',
  risk_level: 'medium',
  summary:
    'The Django migration contains custom Python behavior that cannot be safely executed from an uploaded artifact.',
  issues: [
    {
      title: 'Custom RunPython operation requires trusted project context',
      severity: 'medium',
      evidence: [
        'RunPython(backfill_shipments) was detected in the migration file.',
        'The uploaded Python code was statically parsed but not executed.',
      ],
      impact: 'Its runtime behavior cannot be fully verified from an untrusted uploaded artifact.',
      action: 'Run Migration Guardian locally inside the trusted Django project.',
    },
  ],
  verified_checks: [
    'Django migration structure parsed successfully',
    'Uploaded Python was not executed',
  ],
  next_steps: [
    'Run Migration Guardian locally from the trusted Django project.',
    'Repeat the review after full project-aware migration resolution.',
  ],
  warnings: [],
  error: null,
  migration: {
    source_type: 'django',
    detected_type: 'django',
    filename: '0042_enforce_shipment_constraints.py',
    file_size: 2840,
    metadata: {
      app: 'orders',
      dependencies: ['orders.0041_previous'],
      operations: ['RunPython', 'AlterField', 'AddConstraint'],
    },
  },
  analysis_scope: 'static_only',
  unverified_checks: [
    'Runtime behavior of backfill_shipments',
    'Complete Django migration graph',
    'Application behavior during deployment',
  ],
  missing_context: [
    'Django project',
    'installed apps',
    'migration graph',
    'project runtime',
  ],
  diagnostics: {
    framework: 'strands',
    provider: 'openai',
    model: 'gpt-5.6-sol',
    duration_seconds: 3.2,
    tool_calls: 2,
  },
  timestamp: new Date().toISOString(),
  duration_seconds: 3.2,
};

export async function analyzeMigration(
  filename: string,
  detectedType: MigrationType,
): Promise<Assessment> {
  await delay(9000);

  if (detectedType === 'django' || detectedType === 'alembic') {
    return { ...djangoAssessment, review_id: `rev_${Date.now()}`, timestamp: new Date().toISOString() };
  }

  return { ...approveWithConditionsAssessment, review_id: `rev_${Date.now()}`, timestamp: new Date().toISOString() };
}

const mockReviews: ReviewHistoryItem[] = [
  {
    id: 'rev_001',
    migration_name: '20260909_enforce_shipment_constraints.sql',
    type: 'sql',
    decision: 'block',
    risk_level: 'high',
    database_name: 'app_production',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    duration_seconds: 8.4,
  },
  {
    id: 'rev_002',
    migration_name: '0042_add_order_status.py',
    type: 'django',
    decision: 'review_required',
    risk_level: 'medium',
    database_name: 'app_production',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 3.2,
  },
  {
    id: 'rev_003',
    migration_name: '20260901_add_indexes_users.sql',
    type: 'sql',
    decision: 'approve',
    risk_level: 'low',
    database_name: 'app_production',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 5.1,
  },
  {
    id: 'rev_004',
    migration_name: '0012_add_tag_and_unique_constraint.sql',
    type: 'sql',
    decision: 'approve_with_conditions',
    risk_level: 'medium',
    database_name: 'app_staging',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 8.2,
  },
  {
    id: 'rev_005',
    migration_name: '0045_alembic_add_column.py',
    type: 'alembic',
    decision: 'review_required',
    risk_level: 'low',
    database_name: 'app_production',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 2.8,
  },
];

export async function getReviews(): Promise<ReviewHistoryItem[]> {
  await delay(500);
  return [...mockReviews];
}

export async function getReview(id: string): Promise<Assessment | null> {
  await delay(500);
  const review = mockReviews.find((r) => r.id === id);
  if (!review) return null;
  if (review.type === 'django' || review.type === 'alembic') {
    return { ...djangoAssessment, review_id: review.id, timestamp: review.timestamp };
  }
  if (review.decision === 'approve_with_conditions') {
    return { ...approveWithConditionsAssessment, review_id: review.id, timestamp: review.timestamp };
  }
  return { ...sqlAssessment, review_id: review.id, timestamp: review.timestamp };
}

const MOCK_USER: User = {
  email: 'mig_admin',
  name: 'Migration Admin',
};

const VALID_USERNAME = 'mig_admin';
const VALID_PASSWORD = 'Guardian';

export async function signIn(username: string, password: string): Promise<User> {
  await delay(900);
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }
  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    throw new Error('Invalid username or password.');
  }
  return { ...MOCK_USER };
}

export async function signOut(): Promise<void> {
  await delay(200);
}

export async function joinWaitlist(email: string, firstName?: string): Promise<WaitlistResult> {
  await delay(1000);
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid work email.' };
  }
  return {
    success: true,
    message: "You're on the list. We'll keep you updated.",
  };
}

export async function requestDemo(data: {
  fullName: string;
  email: string;
  company: string;
  role: string;
  teamSize?: string;
  message?: string;
  tooling?: string;
}): Promise<DemoRequestResult> {
  await delay(1200);
  if (!data.email || !data.email.includes('@')) {
    return { success: false, message: 'Please enter a valid work email.' };
  }
  if (!data.fullName || !data.company) {
    return { success: false, message: 'Name and company are required.' };
  }
  return {
    success: true,
    message: 'Thanks — your request has been received.',
  };
}
