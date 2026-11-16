import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import IssueCard from '../components/IssueCard';

const statusOptions = ['ALL', 'REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
const typeOptions = ['ALL', 'POTHOLE', 'STREET_LIGHT', 'GARBAGE', 'WATER_LEAKAGE'];

// Haversine formula: distance in km between two lat/lng points on a sphere
function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    async function loadIssues() {
      try {
        const data = await apiFetch('/api/issues');
        setIssues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadIssues();
  }, []);

  function handleNearMe() {
    if (userLocation) {
      setUserLocation(null);
      return;
    }
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocating(false);
      },
      () => {
        setLocationError('Could not get your location. Allow location access and try again.');
        setLocating(false);
      }
    );
  }

  let visibleIssues = issues
    .filter((issue) => statusFilter === 'ALL' || issue.status === statusFilter)
    .filter((issue) => typeFilter === 'ALL' || issue.type === typeFilter);

  if (userLocation) {
    visibleIssues = visibleIssues
      .map((issue) => ({
        ...issue,
        distance: distanceKm(
          userLocation.lat,
          userLocation.lng,
          Number(issue.latitude),
          Number(issue.longitude)
        )
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  return (
    <div className="min-h-screen bg-stone-100 pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500 mb-4">
          Community reports
        </p>
        <h1 className="font-serif text-4xl font-medium mb-8">All Issues</h1>

        {/* filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-900"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All statuses' : status.replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-900"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type === 'ALL' ? 'All types' : type.replace('_', ' ')}
              </option>
            ))}
          </select>

          <button
            onClick={handleNearMe}
            disabled={locating}
            className={`rounded-md px-4 py-2 text-sm font-medium border transition-colors disabled:opacity-50 ${
              userLocation
                ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-700'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900 hover:text-stone-900'
            }`}
          >
            {locating ? 'Locating...' : userLocation ? '📍 Near me ✕' : '📍 Near me'}
          </button>

          {userLocation && (
            <span className="text-xs text-stone-500">sorted by distance from you</span>
          )}
        </div>

        {locationError && (
          <p className="text-sm text-red-600 mb-6">{locationError}</p>
        )}

        {loading && <p className="text-stone-500">Loading issues...</p>}

        {error && (
          <p className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-md max-w-md">
            {error}
          </p>
        )}

        {!loading && !error && issues.length === 0 && (
          <p className="text-stone-500">No issues reported yet.</p>
        )}

        {!loading && !error && issues.length > 0 && visibleIssues.length === 0 && (
          <p className="text-stone-500">No issues match your filters.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} distance={issue.distance} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Issues;
