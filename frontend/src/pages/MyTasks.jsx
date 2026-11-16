import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import IssueCard from '../components/IssueCard';
import SkeletonCard from '../components/SkeletonCard';

function MyTasks() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYEE') return;

    async function loadTasks() {
      try {
        const data = await apiFetch('/api/issues/assigned');
        setIssues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [user]);

  if (!user || user.role !== 'EMPLOYEE') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500 dark:text-stone-400 mb-4">
          Assigned to you
        </p>
        <h1 className="font-serif text-4xl font-medium mb-10">My Tasks</h1>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        )}

        {error && (
          <p className="border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 text-sm px-4 py-3 rounded-md max-w-md">
            {error}
          </p>
        )}

        {!loading && !error && issues.length === 0 && (
          <p className="text-stone-500 dark:text-stone-400">No issues are assigned to you right now.</p>
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

export default MyTasks;
