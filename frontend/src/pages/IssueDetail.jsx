import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import EmployeePanel from '../components/EmployeePanel';

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function IssueDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadIssue() {
      try {
        const [issueData, historyData] = await Promise.all([
          apiFetch(`/api/issues/${id}`),
          apiFetch(`/api/issues/${id}/history`)
        ]);
        setIssue(issueData);
        setHistory(historyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadIssue();
  }, [id, reloadKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pt-28 px-6">
        <p className="text-stone-500 dark:text-stone-400 max-w-4xl mx-auto">Loading issue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pt-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 text-sm px-4 py-3 rounded-md max-w-md mb-6">
            {error}
          </p>
          <Link to="/issues" className="text-stone-900 dark:text-white underline underline-offset-4 text-sm">
            Back to all issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto fade-up">
        <Link to="/issues" className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
          ← All issues
        </Link>

        <div className="flex items-center justify-between mt-4 mb-2">
          <h1 className="font-serif text-4xl font-medium">
            {issue.type.replace('_', ' ')}
          </h1>
          <StatusBadge status={issue.status} />
        </div>
        <p className="text-xs text-stone-400 mb-8">
          Issue #{issue.id} · Reported {formatDateTime(issue.created_at)}
        </p>

        {user && user.role === 'EMPLOYEE' && issue.assigned_to === user.id && (
          <EmployeePanel issue={issue} onUpdated={() => setReloadKey((k) => k + 1)} />
        )}

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 mb-6">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 mb-3">
            Description
          </h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{issue.description}</p>
          <a
            href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-sm text-stone-900 dark:text-white underline underline-offset-4 hover:text-stone-600 dark:hover:text-stone-300"
          >
            View location on map
          </a>
        </div>

        {(issue.image_url || issue.resolved_image_url) && (
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {issue.image_url && (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 mb-3">
                  Reported photo
                </h2>
                <img
                  src={issue.image_url}
                  alt="Issue as reported"
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
              </div>
            )}
            {issue.resolved_image_url && (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 mb-3">
                  After resolution
                </h2>
                <img
                  src={issue.resolved_image_url}
                  alt="Issue after resolution"
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 mb-5">
            Timeline
          </h2>
          <ol className="space-y-5">
            <li className="flex gap-4">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Reported</p>
                <p className="text-xs text-stone-400">{formatDateTime(issue.created_at)}</p>
              </div>
            </li>
            {history.map((entry, index) => (
              <li key={index} className="flex gap-4">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-stone-900 dark:bg-stone-200 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {entry.status.replace('_', ' ')}
                    <span className="font-normal text-stone-500 dark:text-stone-400"> — by {entry.updated_by}</span>
                  </p>
                  {entry.comment && (
                    <p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">{entry.comment}</p>
                  )}
                  <p className="text-xs text-stone-400 mt-0.5">{formatDateTime(entry.created_at)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default IssueDetail;
