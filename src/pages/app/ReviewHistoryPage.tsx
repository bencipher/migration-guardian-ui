import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Filter, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DecisionBadge, RiskBadge } from '@/components/ui/StatusBadges';
import { getReviews } from '@/services/api';
import type { ReviewHistoryItem, Decision } from '@/types';

const filterOptions: { label: string; value: Decision | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Blocked', value: 'block' },
  { label: 'Approved with conditions', value: 'approve_with_conditions' },
  { label: 'Approved', value: 'approve' },
  { label: 'Review required', value: 'review_required' },
];

export default function ReviewHistoryPage() {
  const [reviews, setReviews] = useState<ReviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Decision | 'all'>('all');

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : 'Unable to load reviews.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.decision === filter);

  return (
    <div className="container-app py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Review History</h1>
          <p className="mt-1.5 text-sm text-ink-500">All migration assessments in your workspace.</p>
        </div>
        <Link to="/app/reviews/new">
          <Button variant="primary" size="md">New Review</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-4 h-4 text-ink-400" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === opt.value
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'text-ink-600 hover:bg-ink-50 border border-transparent'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl shimmer-bg" />
          ))}
        </div>
      ) : loadError ? (
        <Card className="p-12 text-center"><p className="text-sm text-danger-700">{loadError}</p></Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-8 h-8 text-ink-300 mx-auto mb-3" />
          <p className="text-sm text-ink-500">No reviews match this filter.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((review) => (
            <Link key={review.review_id} to={`/app/reviews/${review.review_id}`}>
              <Card className="p-4 hover:shadow-md hover:border-ink-300 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-ink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate font-mono">Review {review.review_id}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-ink-400 uppercase">{review.status}</span>
                      {review.summary && <span className="text-xs text-ink-400 truncate">{review.summary}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <RiskBadge risk={review.risk_level} />
                    <DecisionBadge decision={review.decision} />
                    <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-ink-600 transition-colors" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
