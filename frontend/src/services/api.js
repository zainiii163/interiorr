const API_BASE = '/api/v1';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};

let refreshPromise = null;

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Session expired');
        const token = data.data?.token || data.data?.accessToken;
        if (!token) throw new Error('No token returned');
        setAuthToken(token);
        return token;
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
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

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

    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${endpoint}]:`, err.message);
    throw err;
  }
};
