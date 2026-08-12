import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SeoHead() {
  const { settings } = useSite();
  const title = settings.seo?.defaultTitle || settings.companyName;
  const description = settings.seo?.defaultDescription || settings.tagline;
  const ogImage = settings.seo?.ogImage || settings.heroImage || settings.aboutImage;

  useEffect(() => {
    if (title) document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    if (ogImage) upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    if (ogImage) upsertMeta('name', 'twitter:image', ogImage);
  }, [title, description, ogImage]);

  return null;
}
