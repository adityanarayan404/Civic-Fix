import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import IssueCard from '../components/IssueCard';

function MyIssues() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    async function loadIssues() {
      try {
        const data = await apiFetch('/api/issues/mine');
        setIssues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadIssues();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-stone-100 pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500 mb-4">
          Your reports
        </p>
        <h1 className="font-serif text-4xl font-medium mb-10">My Issues</h1>

        {loading && <p className="text-stone-500">Loading your issues...</p>}

        {error && (
          <p className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-md max-w-md">
            {error}
          </p>
        )}

        {!loading && !error && issues.length === 0 && (
          <div className="text-stone-500">
            <p className="mb-4">You haven't reported any issues yet.</p>
            <Link
              to="/issues"
              className="text-stone-900 underline underline-offset-4 hover:text-stone-600 text-sm"
            >
              See what others have reported
            </Link>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyIssues;
