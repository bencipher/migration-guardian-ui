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
      detectedType = explicitType === 'auto' ? 'django' : explicitType as MigrationType;
    }
  } else {
    detectedType = explicitType === 'auto' ? 'sql' : explicitType as MigrationType;
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
  id: 'rev_001',
  decision: 'block',
  risk_level: 'high',
  analysis_scope: 'full',
  summary:
    'The migration will fail against the current source data because existing rows violate the proposed constraints.',
  migration: {
    source_type: 'sql',
    detected_type: 'sql',
    filename: '20260909_enforce_shipment_constraints.sql',
    file_size: 1420,
  },
  issues: [
    {
      title: 'Existing rows violate NOT NULL constraint',
      severity: 'high',
      status: 'verified',
      evidence: {
        provenance: 'source_database',
        message: '317 rows have dispatched_at IS NULL.',
      },
      impact: 'SET NOT NULL will fail before the migration completes.',
      action: 'Backfill or remove NULL values before deploying.',
    },
    {
      title: 'Existing rows violate weight constraint',
      severity: 'high',
      status: 'verified',
      evidence: {
        provenance: 'source_database',
        message: '14 rows have weight_grams <= 0.',
      },
      impact: 'The CHECK constraint cannot be validated against the current data.',
      action: 'Correct invalid weight values before deployment.',
    },
    {
      title: 'Potential blocking table validation',
      severity: 'medium',
      status: 'unverified',
      evidence: {
        provenance: 'static',
        message: 'The migration applies multiple constraints to the shipments table.',
      },
      impact: 'Constraint validation may affect production traffic.',
      action: 'Plan deployment during lower traffic or use an online-safe validation strategy.',
    },
  ],
  verified_checks: [
    { message: '317 NULL dispatched_at rows found', provenance: 'source_database' },
    { message: '14 non-positive weight rows found', provenance: 'source_database' },
    { message: 'Candidate failed in sandbox with SQLSTATE 23502', provenance: 'sandbox' },
    { message: 'Source inspection ran read-only', provenance: 'source_database' },
  ],
  unverified_checks: [
    { message: 'Lock duration under production traffic', provenance: 'unverified' },
  ],
  next_steps: [
    'Backfill dispatched_at for existing NULL rows.',
    'Correct non-positive weight values.',
    'Re-run Migration Guardian before deployment.',
    'Schedule deployment during a low-traffic window.',
  ],
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

const djangoAssessment: Assessment = {
  id: 'rev_002',
  decision: 'review_required',
  risk_level: 'medium',
  analysis_scope: 'static_only',
  summary:
    'The Django migration contains custom Python behavior that cannot be safely executed from an uploaded artifact.',
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
  issues: [
    {
      title: 'Custom RunPython operation requires trusted project context',
      severity: 'medium',
      status: 'unverified',
      evidence: {
        provenance: 'static',
        message: 'RunPython(backfill_shipments) was detected.',
      },
      impact: 'Its runtime behavior cannot be fully verified from an untrusted uploaded artifact.',
      action: 'Run Migration Guardian locally inside the trusted Django project.',
    },
  ],
  verified_checks: [
    { message: 'Django migration structure parsed successfully', provenance: 'static' },
    { message: 'Uploaded Python was not executed', provenance: 'static' },
  ],
  unverified_checks: [
    { message: 'Runtime behavior of backfill_shipments', provenance: 'unverified' },
    { message: 'Complete Django migration graph', provenance: 'unverified' },
    { message: 'Application behavior during deployment', provenance: 'unverified' },
  ],
  missing_context: [
    'Django project',
    'installed apps',
    'migration graph',
    'project runtime',
  ],
  next_steps: [
    'Run Migration Guardian locally from the trusted Django project.',
    'Repeat the review after full project-aware migration resolution.',
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
    return { ...djangoAssessment, id: `rev_${Date.now()}`, timestamp: new Date().toISOString() };
  }

  return { ...sqlAssessment, id: `rev_${Date.now()}`, timestamp: new Date().toISOString() };
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
    migration_name: '20260828_drop_legacy_table.sql',
    type: 'sql',
    decision: 'approve_with_conditions',
    risk_level: 'medium',
    database_name: 'app_staging',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 6.7,
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
    return { ...djangoAssessment, id: review.id, timestamp: review.timestamp };
  }
  return { ...sqlAssessment, id: review.id, timestamp: review.timestamp };
}

const MOCK_USER: User = {
  email: 'engineer@migrationguardian.io',
  name: 'Platform Engineer',
};

export async function signIn(email: string, password: string): Promise<User> {
  await delay(900);
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  return { ...MOCK_USER, email: email || MOCK_USER.email };
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
