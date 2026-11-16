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
      className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {issue.image_url ? (
        <img
          src={issue.image_url}
          alt={issue.type}
          className="w-full aspect-[16/9] object-cover"
        />
      ) : (
        <div className="w-full aspect-[16/9] bg-stone-200 flex items-center justify-center text-stone-400 text-sm">
          No photo
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-stone-900">
            {issue.type.replace('_', ' ')}
          </h3>
          <StatusBadge status={issue.status} />
        </div>
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4">
          {issue.description}
        </p>
        <p className="text-xs text-stone-400">
          {issue.reported_by ? `Reported by ${issue.reported_by} · ` : ''}
          {formatDate(issue.created_at)}
          {distance !== undefined && (
            <span className="text-stone-900 font-medium"> · {formatDistance(distance)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}

export default IssueCard;
