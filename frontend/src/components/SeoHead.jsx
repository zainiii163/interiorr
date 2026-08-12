import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

export default function SeoHead() {
  const { settings } = useSite();
  const title = settings.seo?.defaultTitle || settings.companyName;
  const description = settings.seo?.defaultDescription || settings.tagline;

  useEffect(() => {
    if (title) document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    if (description) meta.content = description;
  }, [title, description]);

  return null;
}
