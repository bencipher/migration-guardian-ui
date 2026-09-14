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

const REVIEW_CACHE_STORAGE_KEY = 'migration-guardian.review-cache.v1';
const REVIEW_LIST_CACHE_STORAGE_KEY = 'migration-guardian.review-list-cache.v1';
const MAX_CACHED_REVIEWS = 50;
const reviewCache = new Map<string, Assessment>();
const reviewListCache: Assessment[] = [];
let hasCachedReviewList = false;

function hydrateReviewCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = window.localStorage.getItem(REVIEW_CACHE_STORAGE_KEY);
    if (!stored) return;

    const reviews: unknown = JSON.parse(stored);
    if (!Array.isArray(reviews)) return;

    reviews.filter(isAssessment).slice(-MAX_CACHED_REVIEWS).forEach((review) => {
      reviewCache.set(review.review_id, review);
    });
  } catch {
    // A review cache must never prevent the application from starting.
  }
}

function persistReviewCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const reviews = Array.from(reviewCache.values()).slice(-MAX_CACHED_REVIEWS);
    window.localStorage.setItem(REVIEW_CACHE_STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // Storage can be unavailable or full; the in-memory cache still works.
  }
}

function hydrateReviewListCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = window.localStorage.getItem(REVIEW_LIST_CACHE_STORAGE_KEY);
    if (!stored) return;

    const reviews: unknown = JSON.parse(stored);
    if (!Array.isArray(reviews)) return;

    const cachedReviews = reviews.filter(isAssessment).slice(0, MAX_CACHED_REVIEWS);
    reviewListCache.push(...cachedReviews);
    cachedReviews.forEach((review) => reviewCache.set(review.review_id, review));
    hasCachedReviewList = true;
  } catch {
    // A review-list cache must never prevent the application from starting.
  }
}

function persistReviewListCache(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      REVIEW_LIST_CACHE_STORAGE_KEY,
      JSON.stringify(reviewListCache.slice(0, MAX_CACHED_REVIEWS)),
    );
  } catch {
    // Storage can be unavailable or full; the in-memory cache still works.
  }
}

hydrateReviewCache();
hydrateReviewListCache();

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

export async function getReviews(
  { bypassCache = false }: { bypassCache?: boolean } = {},
): Promise<Assessment[]> {
  const cached = getCachedReviews();
  if (cached && !bypassCache) return cached;

  const reviews = (await request<ReviewListResponse>('/api/v1/reviews')).reviews;
  setCachedReviews(reviews);
  return reviews;
}

export function getCachedReviews(): Assessment[] | undefined {
  return hasCachedReviewList ? [...reviewListCache] : undefined;
}

function setCachedReviews(reviews: Assessment[]): void {
  reviewListCache.splice(0, reviewListCache.length, ...reviews.slice(0, MAX_CACHED_REVIEWS));
  hasCachedReviewList = true;
  reviews.forEach((review) => reviewCache.set(review.review_id, review));
  persistReviewCache();
  persistReviewListCache();
}

export function getCachedReview(reviewId: string): Assessment | undefined {
  return reviewCache.get(reviewId);
}

export function cacheReview(review: Assessment): void {
  reviewCache.set(review.review_id, review);
  const listIndex = reviewListCache.findIndex((cachedReview) => cachedReview.review_id === review.review_id);
  if (listIndex >= 0) {
    reviewListCache[listIndex] = review;
    persistReviewListCache();
  }
  persistReviewCache();
}

export function addReviewToCachedList(review: Assessment): void {
  cacheReview(review);
  if (!hasCachedReviewList) return;

  const existingIndex = reviewListCache.findIndex((cachedReview) => cachedReview.review_id === review.review_id);
  if (existingIndex >= 0) reviewListCache.splice(existingIndex, 1);
  reviewListCache.unshift(review);
  reviewListCache.splice(MAX_CACHED_REVIEWS);
  persistReviewListCache();
}

export async function getReview(
  reviewId: string,
  { bypassCache = false }: { bypassCache?: boolean } = {},
): Promise<Assessment> {
  const cached = getCachedReview(reviewId);
  if (cached && !bypassCache) return cached;

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}/api/v1/reviews/${encodeURIComponent(reviewId)}`);
  } catch {
    throw new ApiRequestError('Unable to reach the Migration Guardian API.', 0);
  }

  const payload = await responsePayload(response);
  if (isAssessment(payload) && (response.ok || payload.status === 'failed')) {
    cacheReview(payload);
    return payload;
  }
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
    let review: Assessment;
    try {
      review = await getReview(reviewId, { bypassCache: true });
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        continue;
      }
      throw error;
    }
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
  return request<WaitlistResult>('/api/v1/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, first_name: firstName }),
  });
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
  return request<DemoRequestResult>('/api/v1/contact-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: data.fullName,
      email: data.email,
      company: data.company,
      role: data.role,
      team_size: data.teamSize,
      migration_tooling: data.tooling,
      message: data.message,
    }),
  });
}
