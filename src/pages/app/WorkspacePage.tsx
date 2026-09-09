import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, FileText, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DecisionBadge, RiskBadge } from '@/components/ui/StatusBadges';
import { getReviews } from '@/services/api';
import type { ReviewHistoryItem } from '@/types';
import { useAuth } from '@/auth/AuthContext';

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function WorkspacePage() {
  const { user } = useAuth();
  const [recentReviews, setRecentReviews] = useState<ReviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews().then((reviews) => {
      setRecentReviews(reviews.slice(0, 5));
      setLoading(false);
    });
  }, []);

  return (
    <div className="container-app py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Migration Review Workspace</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Evaluate a candidate migration against your current PostgreSQL state.
          </p>
        </div>
        <Link to="/app/reviews/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" /> New Review
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-ink-200 bg-ink-50/50">
          <h2 className="text-sm font-semibold text-ink-900">Start a new migration review</h2>
          <p className="mt-1 text-sm text-ink-500">Connect a database, upload a migration, and run Migration Guardian to get a deployment decision.</p>
        </div>
        <div className="grid sm:grid-cols-3 divide-x divide-ink-200">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">1</span>
              <span className="text-sm font-medium text-ink-900">Source database</span>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed">Connect with read-only credentials. No writes ever.</p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">2</span>
              <span className="text-sm font-medium text-ink-900">Candidate migration</span>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed">Upload a .sql or .py file. Auto-detection included.</p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">3</span>
              <span className="text-sm font-medium text-ink-900">Assessment</span>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed">Get a structured decision with evidence and next steps.</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-ink-200 bg-ink-50/50 flex justify-end">
          <Link to="/app/reviews/new">
            <Button variant="primary" size="md">
              Start Review <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink-900">Recent Reviews</h2>
          <Link to="/app/reviews" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl shimmer-bg" />
            ))}
          </div>
        ) : recentReviews.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-8 h-8 text-ink-300 mx-auto mb-3" />
            <p className="text-sm text-ink-500">No reviews yet. Start your first migration review.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentReviews.map((review) => (
              <Link key={review.id} to={`/app/reviews/${review.id}`}>
                <Card className="p-4 flex items-center gap-4 hover:shadow-md hover:border-ink-300 transition-all cursor-pointer">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-ink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate font-mono">{review.migration_name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-ink-400 uppercase">{review.type}</span>
                      <span className="text-xs text-ink-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {relativeTime(review.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <RiskBadge risk={review.risk_level} />
                    <DecisionBadge decision={review.decision} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
