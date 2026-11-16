import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { apiFetch, apiUpload } from '../api';

const issueTypes = [
  { value: 'POTHOLE', label: 'Pothole' },
  { value: 'STREET_LIGHT', label: 'Street light' },
  { value: 'GARBAGE', label: 'Garbage' },
  { value: 'WATER_LEAKAGE', label: 'Water leakage' }
];

function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState('POTHOLE');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  function handleUseMyLocation() {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(7));
        setLongitude(position.coords.longitude.toFixed(7));
        setLocating(false);
      },
      () => {
        setLocationError('Could not get your location. Allow location access and try again.');
        setLocating(false);
      }
    );
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setPhoto(file || null);
    setPreview(file ? URL.createObjectURL(file) : '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!latitude || !longitude) {
      setError('Please add the location of the issue.');
      return;
    }

    setLoading(true);
    try {
      const created = await apiFetch('/api/issues', {
        method: 'POST',
        body: JSON.stringify({ type, description, latitude, longitude })
      });

      if (photo) {
        const formData = new FormData();
        formData.append('image', photo);
        await apiUpload(`/api/issues/${created.issue_id}/image`, formData);
      }

      navigate(`/issues/${created.issue_id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 pt-28 pb-16 px-6">
      <div className="max-w-xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500 mb-4">
          New report
        </p>
        <h1 className="font-serif text-4xl font-medium mb-8">Report an issue</h1>

        <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-8">
          {error && (
            <p className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-5 rounded-md">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Type of issue
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-stone-300 rounded-md px-4 py-2.5 text-stone-900 bg-white focus:outline-none focus:border-stone-900 transition-colors"
              >
                {issueTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Where exactly is it? How long has it been there? Anything the staff should know."
                className="w-full border border-stone-300 rounded-md px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Location
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="w-full border border-stone-300 rounded-md py-2.5 text-sm font-medium text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors disabled:opacity-50 mb-3"
              >
                {locating ? 'Getting your location...' : '📍 Use my current location'}
              </button>
              {locationError && (
                <p className="text-sm text-red-600 mb-3">{locationError}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Latitude"
                  className="w-full border border-stone-300 rounded-md px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                />
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Longitude"
                  className="w-full border border-stone-300 rounded-md px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Photo <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoChange}
                className="w-full text-sm text-stone-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:bg-stone-900 file:text-white file:text-sm file:font-medium hover:file:bg-stone-700 file:transition-colors file:cursor-pointer"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Selected"
                  className="mt-3 w-full aspect-[16/9] object-cover rounded-lg border border-stone-200"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white text-sm font-medium rounded-md py-3 hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting report...' : 'Submit report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportIssue;
