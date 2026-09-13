import { useState, useRef, useCallback, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  Zap,
  Clock3,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Field, Select } from '@/components/ui/Form';
import { ApiRequestError, pollReview, submitReviewFile, testConnection } from '@/services/api';
import type { Assessment, ConnectionResult, FileUploadResult, MigrationTypeSelection } from '@/types';

type ConnState = 'idle' | 'testing' | 'connected' | 'failed';
type AnalysisState = 'idle' | 'running' | 'failed';

function messageFor(error: unknown): string {
  return error instanceof Error ? error.message : 'The request could not be completed.';
}

export default function NewReviewPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [connUrl, setConnUrl] = useState('');
  const [sourceSchema, setSourceSchema] = useState('public');
  const [connState, setConnState] = useState<ConnState>('idle');
  const [connResult, setConnResult] = useState<ConnectionResult | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [migrationType, setMigrationType] = useState<MigrationTypeSelection>('auto');
  const [uploadResult, setUploadResult] = useState<FileUploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [review, setReview] = useState<Assessment | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const canRun = connState === 'connected' && uploadResult !== null && analysisState !== 'running';

  const handleTestConnection = async () => {
    setConnState('testing');
    setConnResult(null);
    setConnectionError(null);
    try {
      const result = await testConnection(connUrl, sourceSchema);
      setConnResult(result);
      setConnState('connected');
    } catch (error) {
      setConnectionError(messageFor(error));
      setConnState('failed');
    }
  };

  const processFile = useCallback((file: File) => {
    setUploadError(null);
    if (!/\.(sql|py)$/i.test(file.name)) {
      setUploadResult(null);
      setUploadError('Choose a .sql or .py migration file.');
      return;
    }

    setUploadResult({ file, filename: file.name, file_size: file.size });
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRun = async () => {
    if (!uploadResult) return;

    setAnalysisState('running');
    setAnalysisError(null);
    setReview(null);
    try {
      const submitted = await submitReviewFile(
        uploadResult.file,
        migrationType,
        connUrl,
        sourceSchema,
      );
      const completed = await pollReview(submitted.review_id, setReview);
      navigate(`/app/reviews/${completed.review_id}`, { state: { assessment: completed } });
    } catch (error) {
      const message = messageFor(error);
      setAnalysisError(message);
      setAnalysisState('failed');
      if (error instanceof ApiRequestError && error.status === 408 && review) {
        navigate(`/app/reviews/${review.review_id}`);
      }
    }
  };

  const stage = review?.status === 'processing' ? 'Processing review in Migration Guardian…' : 'Review is queued…';

  return (
    <div className="container-app py-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900 mb-1">New Migration Review</h1>
      <p className="text-sm text-ink-500 mb-8">Evaluate a candidate migration against your current PostgreSQL state.</p>

      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">1</span>
          <h2 className="text-base font-semibold text-ink-900">Source database</h2>
        </div>
        <Card className="p-6">
          <p className="text-sm text-ink-500 mb-4">Migration Guardian inspects this database in read-only mode. Candidate migrations are never executed here.</p>
          <Field label="PostgreSQL connection URL" htmlFor="connUrl" hint="Treated as sensitive. Use read-only credentials.">
            <Input id="connUrl" type="text" placeholder="postgresql://readonly_user:••••••••@db.example.com:5432/app" value={connUrl} onChange={(event) => setConnUrl(event.target.value)} className="font-mono text-xs" disabled={connState === 'testing'} />
          </Field>
          <div className="mt-4 max-w-xs">
            <Field label="Source schema" htmlFor="sourceSchema" hint="Defaults to public.">
              <Input id="sourceSchema" value={sourceSchema} onChange={(event) => setSourceSchema(event.target.value)} className="font-mono text-xs" disabled={connState === 'testing'} />
            </Field>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="md" onClick={handleTestConnection} loading={connState === 'testing'} disabled={!connUrl || !sourceSchema}>
              <Database className="w-4 h-4" /> Test Connection
            </Button>
          </div>

          {connState === 'connected' && connResult && (
            <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg animate-slide-up">
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-success-600" /><span className="text-sm font-semibold text-success-800">Connected</span></div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <dt className="text-ink-500">Database</dt><dd className="text-ink-700 font-mono">{connResult.database}</dd>
                <dt className="text-ink-500">Schema</dt><dd className="text-ink-700 font-mono">{sourceSchema}</dd>
                <dt className="text-ink-500">Tables inspected</dt><dd className="text-ink-700">{connResult.inspected_tables}</dd>
                <dt className="text-ink-500">Access</dt><dd className="text-ink-700">{connResult.read_only_compatible ? 'Read-only compatible' : 'Not read-only compatible'}</dd>
              </dl>
              {connResult.warnings.map((warning) => <p key={warning.code} className="mt-2 text-xs text-warning-700">{warning.message}</p>)}
            </div>
          )}
          {connState === 'failed' && connectionError && (
            <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg animate-slide-up"><div className="flex items-center gap-2 mb-1"><XCircle className="w-4 h-4 text-danger-600" /><span className="text-sm font-semibold text-danger-800">Connection failed</span></div><p className="text-xs text-danger-700">{connectionError}</p></div>
          )}
        </Card>
      </section>

      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">2</span><h2 className="text-base font-semibold text-ink-900">Candidate migration</h2></div>
        <Card className="p-6">
          <p className="text-sm text-ink-500 mb-4">Upload the migration you want Migration Guardian to evaluate.</p>
          <Field label="Migration type" htmlFor="mType">
            <Select id="mType" value={migrationType} onChange={(event) => setMigrationType(event.target.value as MigrationTypeSelection)} className="max-w-xs">
              <option value="auto">Auto detect</option><option value="sql">Raw SQL</option><option value="django">Django</option><option value="alembic">Alembic</option>
            </Select>
          </Field>
          <div className="mt-4">
            <div onDrop={handleDrop} onDragOver={(event) => { event.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-brand-500 bg-brand-50' : 'border-ink-300 hover:border-ink-400 hover:bg-ink-50'}`}>
              <input ref={fileInputRef} type="file" accept=".sql,.py" className="hidden" onChange={handleFileSelect} />
              <Upload className={`w-8 h-8 mx-auto mb-3 ${dragOver ? 'text-brand-500' : 'text-ink-400'}`} />
              <p className="text-sm font-medium text-ink-700">Drop your migration file here</p><p className="text-xs text-ink-400 mt-1">or choose a file</p><p className="text-xs text-ink-400 mt-3">Supports .sql and .py</p>
            </div>
          </div>
          {uploadResult && <div className="mt-4 p-4 bg-ink-50 border border-ink-200 rounded-lg animate-slide-up"><div className="flex items-start gap-3"><div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-ink-200 flex items-center justify-center"><FileText className="w-5 h-5 text-ink-500" /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-ink-900 font-mono truncate">{uploadResult.filename}</p><p className="text-xs text-ink-400 mt-0.5">{(uploadResult.file_size / 1024).toFixed(1)} KB</p><p className="text-xs text-ink-500 mt-2">The API will {migrationType === 'auto' ? 'detect its migration type' : `process it as ${migrationType}`} when the review starts.</p></div></div></div>}
          {uploadError && <p className="mt-3 text-xs text-danger-700">{uploadError}</p>}
        </Card>
      </section>

      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">3</span><h2 className="text-base font-semibold text-ink-900">Assessment</h2></div>
        <Card className="p-6">
          {analysisState === 'idle' && <><div className="flex items-center gap-2 mb-4"><Lock className="w-4 h-4 text-ink-400" /><p className="text-sm text-ink-500">{canRun ? 'Ready to run. Migration Guardian will inspect your source database and evaluate the uploaded migration in an isolated sandbox.' : 'Complete the steps above before running.'}</p></div><Button variant="primary" size="lg" onClick={handleRun} disabled={!canRun}><Zap className="w-4 h-4" /> Run Migration Guardian</Button></>}
          {analysisState === 'running' && <div className="space-y-3"><div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-brand-600" /><span className="text-sm font-medium text-ink-900">{stage}</span></div><div className="flex items-center gap-2 text-xs text-ink-500"><Clock3 className="w-4 h-4" /> Live status is polled from the API every two seconds.</div></div>}
          {analysisState === 'failed' && <div className="space-y-3"><div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-danger-600" /><span className="text-sm font-medium text-danger-800">Review could not be started or tracked</span></div><p className="text-sm text-danger-700">{analysisError}</p><Button variant="outline" size="sm" onClick={() => setAnalysisState('idle')}>Try again</Button></div>}
        </Card>
      </section>
    </div>
  );
}
