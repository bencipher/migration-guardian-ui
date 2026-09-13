import type {
  Assessment,
  ConnectionResult,
  DemoRequestResult,
  MigrationTypeSelection,
  ReviewSubmission,
  User,
  WaitlistResult,
} from '@/types';

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}

interface ReviewListResponse {
  reviews: Assessment[];
}

export class ApiRequestError extends Error {
  constructor(message: string, public readonly status: number, public readonly code?: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

function apiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new ApiRequestError('VITE_API_BASE_URL is not configured.', 0);
  }
  return baseUrl.replace(/\/$/, '');
}

function errorFromPayload(payload: unknown, status: number): ApiRequestError {
  const error = (payload as ApiErrorResponse | null)?.error;
  return new ApiRequestError(
    error?.message || `Migration Guardian API request failed (${status}).`,
    status,
    error?.code,
  );
}

async function responsePayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, init);
  } catch {
    throw new ApiRequestError('Unable to reach the Migration Guardian API.', 0);
  }

  const payload = await responsePayload(response);
  if (!response.ok) throw errorFromPayload(payload, response.status);
  return payload as T;
}

export async function testConnection(
  sourceDatabaseUrl: string,
  sourceSchema: string,
): Promise<ConnectionResult> {
  return request<ConnectionResult>('/api/v1/connections/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_database_url: sourceDatabaseUrl,
      source_schema: sourceSchema,
    }),
  });
}

export async function submitReviewFile(
  file: File,
  migrationSource: MigrationTypeSelection,
  sourceDatabaseUrl: string,
  sourceSchema: string,
): Promise<ReviewSubmission> {
  const form = new FormData();
  form.append('migration_file', file, file.name);
  form.append('migration_source', migrationSource);
  form.append('source_database_url', sourceDatabaseUrl);
  form.append('source_schema', sourceSchema);

  return request<ReviewSubmission>('/api/v1/reviews/file', {
    method: 'POST',
    body: form,
  });
}

export async function getReviews(): Promise<Assessment[]> {
  return (await request<ReviewListResponse>('/api/v1/reviews')).reviews;
}

export async function getReview(reviewId: string): Promise<Assessment> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}/api/v1/reviews/${encodeURIComponent(reviewId)}`);
  } catch {
    throw new ApiRequestError('Unable to reach the Migration Guardian API.', 0);
  }

  const payload = await responsePayload(response);
  if (isAssessment(payload) && (response.ok || payload.status === 'failed')) return payload;
  throw errorFromPayload(payload, response.status);
}

export async function pollReview(
  reviewId: string,
  onUpdate: (review: Assessment) => void,
  intervalMs = 2_000,
  timeoutMs = 300_000,
): Promise<Assessment> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const review = await getReview(reviewId);
    onUpdate(review);
    if (review.status === 'completed' || review.status === 'failed') return review;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new ApiRequestError('The review is still running. Open it from Review History to continue tracking it.', 408);
}

function isAssessment(value: unknown): value is Assessment {
  return typeof value === 'object' && value !== null && 'review_id' in value && 'status' in value;
}

const MOCK_USER: User = {
  email: 'mig_admin',
  name: 'Migration Admin',
};

const VALID_USERNAME = 'mig_admin';
const VALID_PASSWORD = 'Guardian';

export async function signIn(username: string, password: string): Promise<User> {
  if (!username || !password) throw new Error('Username and password are required.');
  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) throw new Error('Invalid username or password.');
  return { ...MOCK_USER };
}

export async function signOut(): Promise<void> {}

export async function joinWaitlist(email: string, firstName?: string): Promise<WaitlistResult> {
  void firstName;
  if (!email || !email.includes('@')) return { success: false, message: 'Please enter a valid work email.' };
  return { success: true, message: "You're on the list. We'll keep you updated." };
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
  if (!data.email || !data.email.includes('@')) return { success: false, message: 'Please enter a valid work email.' };
  if (!data.fullName || !data.company) return { success: false, message: 'Name and company are required.' };
  return { success: true, message: 'Thanks — your request has been received.' };
}
