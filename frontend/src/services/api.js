const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  } catch {
    // localStorage unavailable
  }
};

let refreshPromise = null;

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Session expired');
        const token = data.data?.token || data.data?.accessToken;
        if (!token) throw new Error('No token returned');
        setAuthToken(token);
        return token;
      })
      .catch((err) => {
        setAuthToken(null);
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

const AUTH_SKIP_REFRESH = ['/auth/login', '/auth/refresh'];

export const apiFetch = async (endpoint, options = {}, retried = false) => {
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (!options.headers || !options.headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json();

    if (
      res.status === 401 &&
      !retried &&
      !AUTH_SKIP_REFRESH.some((path) => endpoint.startsWith(path))
    ) {
      try {
        await refreshAccessToken();
        return apiFetch(endpoint, options, true);
      } catch {
        setAuthToken(null);
        throw new Error(data.message || 'Session expired. Please log in again.');
      }
    }

    if (res.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }

    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
};
