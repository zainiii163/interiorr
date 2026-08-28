/** Normalize API/media paths for use in img src (relative uploads, absolute URLs). */
export function resolveMediaUrl(url) {
  const value = url?.trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  if (value.startsWith('/')) return value;
  return `/${value}`;
}
