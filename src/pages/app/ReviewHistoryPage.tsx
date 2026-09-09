import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Database, Filter, ArrowRight } from 'lucide-react';
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

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function ReviewHistoryPage() {
  const [reviews, setReviews] = useState<ReviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Decision | 'all'>('all');

  useEffect(() => {
    getReviews().then((r) => {
      setReviews(r);
      setLoading(false);
    });
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
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-8 h-8 text-ink-300 mx-auto mb-3" />
          <p className="text-sm text-ink-500">No reviews match this filter.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((review) => (
            <Link key={review.id} to={`/app/reviews/${review.id}`}>
              <Card className="p-4 hover:shadow-md hover:border-ink-300 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-ink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate font-mono">{review.migration_name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-ink-400 uppercase">{review.type}</span>
                      <span className="text-xs text-ink-400 flex items-center gap-1">
                        <Database className="w-3 h-3" /> {review.database_name}
                      </span>
                      <span className="text-xs text-ink-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {relativeTime(review.timestamp)}
                      </span>
                      <span className="text-xs text-ink-400">{review.duration_seconds}s</span>
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
