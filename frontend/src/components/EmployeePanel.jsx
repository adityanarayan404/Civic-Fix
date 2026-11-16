import { useState } from 'react';
import { apiFetch, apiUpload } from '../api';

// Mirrors the backend's nextStatus lookup: the only step an employee can take
const nextAction = {
  ASSIGNED: { status: 'IN_PROGRESS', label: 'Start work' },
  IN_PROGRESS: { status: 'RESOLVED', label: 'Mark as resolved' }
};

function EmployeePanel({ issue, onUpdated }) {
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const action = nextAction[issue.status];
  const canAddAfterPhoto = issue.status === 'RESOLVED' && !issue.resolved_image_url;

  if (!action && !canAddAfterPhoto) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (action) {
        await apiFetch(`/api/issues/${issue.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: action.status, comment })
        });
      }

      if (photo) {
        const formData = new FormData();
        formData.append('image', photo);
        await apiUpload(`/api/issues/${issue.id}/image`, formData);
      }

      setComment('');
      setPhoto(null);
      onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 mb-6">
      <h2 className="text-[11px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 mb-4">
        Staff panel
      </h2>

      {error && (
        <p className="border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 text-sm px-4 py-3 mb-4 rounded-md">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {action && (
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Comment <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder={
                action.status === 'RESOLVED'
                  ? 'What was done to fix it?'
                  : 'Any notes before starting work.'
              }
              className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-md px-4 py-2.5 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-400 transition-colors resize-none"
            />
          </div>
        )}

        {(action?.status === 'RESOLVED' || canAddAfterPhoto) && (
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              After photo <span className="text-stone-400 font-normal">(proof of work)</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setPhoto(e.target.files[0] || null)}
              className="w-full text-sm text-stone-600 dark:text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-stone-900 dark:file:bg-white file:text-white dark:file:text-stone-900 file:text-sm file:font-medium hover:file:bg-stone-700 dark:hover:file:bg-stone-200 file:transition-colors file:cursor-pointer"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-medium rounded-md py-3 hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors disabled:opacity-50"
        >
          {loading
            ? 'Saving...'
            : action
              ? action.label
              : 'Upload after photo'}
        </button>
      </form>
    </div>
  );
}

export default EmployeePanel;
