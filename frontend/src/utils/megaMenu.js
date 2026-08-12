import { apiFetch } from '../services/api';

export async function resolveMegaMenuChildren(item) {
  const source = item.megaMenuSource;

  if (source === 'services') {
    const res = await apiFetch('/services');
    if (!res.success) return item.children || [];
    const items = res.data.map((s) => ({
      _id: s._id,
      label: s.name,
      path: `/services/${s.slug}`,
      image: s.heroImage || '',
      order: s.order || 0,
    }));
    return [
      { _id: 'all-services', label: 'All Services', path: '/services', image: items[0]?.image || '', order: 0 },
      ...items,
    ];
  }

  if (source === 'projects') {
    const res = await apiFetch('/projects?limit=50');
    if (!res.success) return item.children || [];
    const items = res.data.map((p) => ({
      _id: p._id,
      label: p.title,
      path: `/projects/${p.slug}`,
      image: p.coverImage || '',
      order: 0,
    }));
    return [
      { _id: 'all-projects', label: 'All Projects', path: '/projects', image: items[0]?.image || '', order: 0 },
      ...items,
    ];
  }

  if (source === 'design-styles') {
    const res = await apiFetch('/design-styles');
    if (!res.success) return item.children || [];
    const items = res.data.map((s) => ({
      _id: s._id,
      label: s.name,
      path: `/design-styles/${s.slug}`,
      image: s.image || '',
      order: s.order || 0,
    }));
    return [
      { _id: 'all-styles', label: 'All Design Styles', path: '/design-styles', image: items[0]?.image || '', order: 0 },
      ...items,
    ];
  }

  if (source === 'custom') {
    return (item.children || [])
      .filter((c) => c.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  return item.children || [];
}

export function isMegaMenuItem(item) {
  return item.menuType === 'mega' && item.megaMenuSource && item.megaMenuSource !== 'none';
}
