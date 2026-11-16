const API_URL = 'http://localhost:5000';

// For multipart uploads: no Content-Type header, the browser sets it with the boundary
export async function apiUpload(path, formData) {
  const token = localStorage.getItem('token');

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers, body: formData });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}
