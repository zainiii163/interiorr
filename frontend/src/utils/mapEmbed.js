/**
 * Google Maps embeds — the `output=embed` URL works inside iframes without an API key.
 * Address is geocoded by Google automatically, so no coordinates are required.
 */

/** Al Murar, Deira, Dubai — used as a safe fallback point. */
export const DEFAULT_ADDRESS = 'Office No. 277-18-2, Al Murar, Deira Dubai, United Arab Emirates';

/**
 * Build a Google Maps embed URL (no API key required).
 * Falls back to OpenStreetMap if the address is empty.
 */
export function googleMapsEmbedUrl(address) {
  const query = address?.trim() || DEFAULT_ADDRESS;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

/** Google Maps directions / place search link (opens in Google Maps app). */
export function googleMapsSearchUrl(address) {
  const query = address?.trim() || DEFAULT_ADDRESS;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Default embed URL showcased on the Contact page. */
export const DEFAULT_MAP_EMBED_URL = googleMapsEmbedUrl(DEFAULT_ADDRESS);

/** OpenStreetMap embed fallback (kept in case Google is ever blocked). */
export const OSM_MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=55.3050%2C25.2650%2C55.3450%2C25.2850&layer=mapnik&marker=25.275%2C55.325';