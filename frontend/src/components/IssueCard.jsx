import { Link } from 'react-router';
import StatusBadge from './StatusBadge';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
}

function IssueCard({ issue, distance }) {
  return (
    <Link
      to={`/issues/${issue.id}`}
      className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {issue.image_url ? (
        <div className="w-full aspect-[16/9] overflow-hidden">
          <img
            src={issue.image_url}
            alt={issue.type}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full aspect-[16/9] bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 text-sm">
          No photo
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-stone-900 dark:text-stone-100">
            {issue.type.replace('_', ' ')}
          </h3>
          <StatusBadge status={issue.status} />
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2 mb-4">
          {issue.description}
        </p>
        <p className="text-xs text-stone-400">
          {issue.reported_by ? `Reported by ${issue.reported_by} · ` : ''}
          {formatDate(issue.created_at)}
          {distance !== undefined && (
            <span className="text-stone-900 dark:text-white font-medium"> · {formatDistance(distance)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}

export default IssueCard;
