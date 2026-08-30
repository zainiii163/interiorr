const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export const getCustomerToken = () => {
  try {
    return localStorage.getItem('customerToken');
  } catch {
    return null;
  }
};

export const setCustomerToken = (token) => {
  try {
    if (token) localStorage.setItem('customerToken', token);
    else localStorage.removeItem('customerToken');
  } catch {
    // localStorage unavailable
  }
};

const CUSTOMER_AUTH_SKIP = ['/customers/auth/login', '/customers/auth/refresh', '/customers/auth/signup'];

let refreshPromise = null;

export async function refreshCustomerToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/customers/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Session expired');
        const token = data.data?.token || data.data?.accessToken;
        if (!token) throw new Error('No token returned');
        setCustomerToken(token);
        return token;
      })
      .catch((err) => {
        setCustomerToken(null);
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export const customerFetch = async (endpoint, options = {}, retried = false) => {
  const token = getCustomerToken();
  const headers = { ...(options.headers || {}) };

  if (!options.headers || !options.headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : { message: (await res.text()).slice(0, 200) };

    if (
      res.status === 401 &&
      !retried &&
      !CUSTOMER_AUTH_SKIP.some((path) => endpoint.startsWith(path))
    ) {
      try {
        await refreshCustomerToken();
        return customerFetch(endpoint, options, true);
      } catch {
        setCustomerToken(null);
        throw new Error(data.message || 'Session expired. Please log in again.');
      }
    }

    if (res.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }

    if (!res.ok) throw new Error(data.message || 'API request failed');
    return data;
  } catch (err) {
    console.error(`Customer API Error [${endpoint}]:`, err.message);
    throw err;
  }
};
