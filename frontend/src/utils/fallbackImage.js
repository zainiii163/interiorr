const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#f5ede8"/><rect x="40" y="40" width="1120" height="720" rx="24" fill="#fff7f2" stroke="#d9b7a4" stroke-width="4"/><text x="600" y="390" text-anchor="middle" font-family="Arial" font-size="28" fill="#8a5a3d">Image Preview</text></svg>';

export const fallbackImage = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

export function imageOrDefault(src) {
  return src && String(src).trim() ? src : fallbackImage;
}