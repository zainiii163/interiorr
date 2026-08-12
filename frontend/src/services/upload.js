import { getAuthToken, refreshAccessToken } from './api';

const API_BASE = '/api/v1';

async function postUpload(headers, body, retried = false) {
  const res = await fetch(`${API_BASE}/uploads/image`, {
    method: 'POST',
    headers,
    body,
    credentials: 'include',
  });

  const data = await res.json();

  if (res.status === 401 && !retried) {
    await refreshAccessToken();
    const token = getAuthToken();
    const retryHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    return postUpload(retryHeaders, body, true);
  }

  if (!res.ok) {
    throw new Error(data.message || 'Upload failed');
  }
  return data.data?.url;
}

export async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append('image', file);

  const token = getAuthToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  return postUpload(headers, formData);
}
