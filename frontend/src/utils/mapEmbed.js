/** OpenStreetMap embed — Al Murar, Deira, Dubai (works without Google API key). */
export const DEFAULT_MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=55.3050%2C25.2650%2C55.3450%2C25.2850&layer=mapnik&marker=25.275%2C55.325';

/** Legacy Google URL format that no longer loads in iframes. */
export const LEGACY_BROKEN_MAP_URL =
  'https://maps.google.com/maps?q=Al+Murar+Deira+Dubai+UAE&output=embed';

export function googleMapsSearchUrl(address) {
  const query = address?.trim() || 'Al Murar, Deira, Dubai, UAE';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
