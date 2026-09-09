import { useState, useRef, useCallback, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Zap,
  FlaskConical,
  ScanLine,
  ShieldCheck,
  FileSearch,
  ChevronRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Field, Select } from '@/components/ui/Form';
import { detectMigrationType, testConnection, analyzeMigration } from '@/services/api';
import type { ConnectionResult, FileUploadResult, MigrationType, MigrationTypeSelection } from '@/types';

type ConnState = 'idle' | 'testing' | 'connected' | 'failed';
type AnalysisState = 'idle' | 'running' | 'done';

const sqlStages = [
  'Inspecting source database',
  'Analyzing migration',
  'Checking current data',
  'Executing candidate in sandbox',
  'Verifying post-migration state',
  'Preparing assessment',
];

const staticStages = [
  'Inspecting migration artifact',
  'Extracting framework metadata',
  'Checking source database',
  'Identifying project-context requirements',
  'Preparing assessment',
];

export default function NewReviewPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Source database
  const [connUrl, setConnUrl] = useState('');
  const [connState, setConnState] = useState<ConnState>('idle');
  const [connResult, setConnResult] = useState<ConnectionResult | null>(null);

  // Migration upload
  const [migrationType, setMigrationType] = useState<MigrationTypeSelection>('auto');
  const [uploadResult, setUploadResult] = useState<FileUploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [typeMismatch, setTypeMismatch] = useState(false);
  const [resolvedType, setResolvedType] = useState<MigrationType | null>(null);

  // Analysis
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [currentStage, setCurrentStage] = useState(0);

  const canRun = connState === 'connected' && uploadResult !== null && resolvedType !== null && analysisState !== 'running';

  const handleTestConnection = async () => {
    setConnState('testing');
    const result = await testConnection(connUrl);
    setConnResult(result);
    setConnState(result.connected ? 'connected' : 'failed');
  };

  const processFile = useCallback(async (file: File) => {
    setUploading(true);
    setTypeMismatch(false);
    const content = await file.text();
    const result = await detectMigrationType(file.name, content, migrationType);
    setUploadResult(result);

    if (migrationType !== 'auto' && migrationType !== result.detected_type) {
      setTypeMismatch(true);
      setResolvedType(null);
    } else {
      setResolvedType(result.detected_type);
    }
    setUploading(false);
  }, [migrationType]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleTypeChange = (type: MigrationTypeSelection) => {
    setMigrationType(type);
    if (uploadResult) {
      if (type !== 'auto' && type !== uploadResult.detected_type) {
        setTypeMismatch(true);
        setResolvedType(null);
      } else {
        setTypeMismatch(false);
        setResolvedType(uploadResult.detected_type);
      }
    }
  };

  const resolveType = (useDetected: boolean) => {
    if (!uploadResult) return;
    if (useDetected) {
      setMigrationType(uploadResult.detected_type);
      setResolvedType(uploadResult.detected_type);
    } else {
      setResolvedType(migrationType as MigrationType);
    }
    setTypeMismatch(false);
  };

  const handleRun = async () => {
    if (!resolvedType || !uploadResult) return;
    setAnalysisState('running');
    setCurrentStage(0);

    const stages = resolvedType === 'sql' ? sqlStages : staticStages;
    const stageDelay = 1400;

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i);
      await new Promise((r) => setTimeout(r, stageDelay));
    }

    const assessment = await analyzeMigration(uploadResult.filename, resolvedType);
    setAnalysisState('done');
    navigate(`/app/reviews/${assessment.id}`, { state: { assessment } });
  };

  const stages = resolvedType === 'sql' ? sqlStages : staticStages;

  return (
    <div className="container-app py-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900 mb-1">New Migration Review</h1>
      <p className="text-sm text-ink-500 mb-8">Evaluate a candidate migration against your current PostgreSQL state.</p>

      {/* Section 1: Source Database */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">1</span>
          <h2 className="text-base font-semibold text-ink-900">Source database</h2>
        </div>
        <Card className="p-6">
          <p className="text-sm text-ink-500 mb-4">
            Migration Guardian inspects this database in read-only mode. Candidate migrations are never executed here.
          </p>
          <Field label="PostgreSQL connection URL" htmlFor="connUrl" hint="Treated as sensitive. Use read-only credentials.">
            <Input
              id="connUrl"
              type="text"
              placeholder="postgresql://readonly_user:••••••••@db.example.com:5432/app"
              value={connUrl}
              onChange={(e) => setConnUrl(e.target.value)}
              className="font-mono text-xs"
              disabled={connState === 'testing'}
            />
          </Field>

          <div className="mt-4">
            <Button
              variant="outline"
              size="md"
              onClick={handleTestConnection}
              loading={connState === 'testing'}
              disabled={!connUrl}
            >
              <Database className="w-4 h-4" /> Test Connection
            </Button>
          </div>

          {connState === 'connected' && connResult?.connected && (
            <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg animate-slide-up">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-success-600" />
                <span className="text-sm font-semibold text-success-800">Connected</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <dt className="text-ink-500">PostgreSQL version</dt>
                <dd className="text-ink-700 font-mono">{connResult.postgres_version}</dd>
                <dt className="text-ink-500">Database</dt>
                <dd className="text-ink-700 font-mono">{connResult.database}</dd>
                <dt className="text-ink-500">Schema</dt>
                <dd className="text-ink-700 font-mono">{connResult.schema}</dd>
                <dt className="text-ink-500">Access</dt>
                <dd className="text-ink-700">Read-only verified</dd>
              </dl>
            </div>
          )}

          {connState === 'failed' && connResult && (
            <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg animate-slide-up">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-danger-600" />
                <span className="text-sm font-semibold text-danger-800">Connection failed</span>
              </div>
              <p className="text-xs text-danger-700">{connResult.error}</p>
            </div>
          )}
        </Card>
      </section>

      {/* Section 2: Candidate Migration */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">2</span>
          <h2 className="text-base font-semibold text-ink-900">Candidate migration</h2>
        </div>
        <Card className="p-6">
          <p className="text-sm text-ink-500 mb-4">Upload the migration you want Migration Guardian to evaluate.</p>

          <Field label="Migration type" htmlFor="mType">
            <Select id="mType" value={migrationType} onChange={(e) => handleTypeChange(e.target.value as MigrationTypeSelection)} className="max-w-xs">
              <option value="auto">Auto detect</option>
              <option value="sql">Raw SQL</option>
              <option value="django">Django</option>
              <option value="alembic">Alembic</option>
            </Select>
          </Field>

          <div className="mt-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-brand-500 bg-brand-50' : 'border-ink-300 hover:border-ink-400 hover:bg-ink-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".sql,.py"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Upload className={`w-8 h-8 mx-auto mb-3 ${dragOver ? 'text-brand-500' : 'text-ink-400'}`} />
              <p className="text-sm font-medium text-ink-700">Drop your migration file here</p>
              <p className="text-xs text-ink-400 mt-1">or choose a file</p>
              <p className="text-xs text-ink-400 mt-3">Supports .sql and .py</p>
            </div>
          </div>

          {uploading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Detecting migration type...
            </div>
          )}

          {uploadResult && !uploading && (
            <div className="mt-4 p-4 bg-ink-50 border border-ink-200 rounded-lg animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-ink-200 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-ink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900 font-mono truncate">{uploadResult.filename}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{(uploadResult.file_size / 1024).toFixed(1)} KB</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-ink-500">Detected:</span>
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-brand-50 text-brand-700 border border-brand-200">
                      {uploadResult.detected_type === 'sql' ? 'PostgreSQL SQL migration' :
                       uploadResult.detected_type === 'django' ? 'Django migration' : 'Alembic revision'}
                    </span>
                  </div>
                  {uploadResult.metadata?.operations && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {uploadResult.metadata.operations.map((op) => (
                        <span key={op} className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-ink-200 text-ink-600">
                          {op}
                        </span>
                      ))}
                    </div>
                  )}
                  {uploadResult.metadata?.dependencies && (
                    <p className="text-xs text-ink-400 mt-2 font-mono">deps: {uploadResult.metadata.dependencies.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {typeMismatch && uploadResult && (
            <div className="mt-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning-600" />
                <span className="text-sm font-semibold text-warning-800">
                  Selected {migrationType === 'alembic' ? 'Alembic' : 'Django'}, but this file appears to be a {uploadResult.detected_type === 'django' ? 'Django' : 'Alembic'} migration.
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => resolveType(true)}>
                  Use {uploadResult.detected_type === 'django' ? 'Django' : 'Alembic'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => resolveType(false)}>
                  Keep {migrationType === 'alembic' ? 'Alembic' : 'Django'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Section 3: Run / Assessment */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">3</span>
          <h2 className="text-base font-semibold text-ink-900">Assessment</h2>
        </div>
        <Card className="p-6">
          {analysisState === 'idle' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-ink-400" />
                <p className="text-sm text-ink-500">
                  {canRun
                    ? 'Ready to run. Migration Guardian will inspect your source database, analyze the migration, and execute it in an isolated sandbox.'
                    : 'Complete the steps above before running.'}
                </p>
              </div>
              <Button variant="primary" size="lg" onClick={handleRun} disabled={!canRun}>
                <Zap className="w-4 h-4" /> Run Migration Guardian
              </Button>
            </>
          )}

          {analysisState === 'running' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span className="text-sm font-medium text-ink-900">Running analysis...</span>
              </div>
              <div className="space-y-2">
                {stages.map((stage, i) => {
                  const isDone = i < currentStage;
                  const isCurrent = i === currentStage;
                  return (
                    <div key={stage} className="flex items-center gap-3 py-1.5">
                      <div className="flex-shrink-0 w-5 h-5">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-success-600" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-ink-200" />
                        )}
                      </div>
                      <span className={`text-sm ${isDone ? 'text-ink-400 line-through' : isCurrent ? 'text-ink-900 font-medium' : 'text-ink-400'}`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
