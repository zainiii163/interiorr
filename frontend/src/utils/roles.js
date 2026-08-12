/** Frontend staff role helpers — keep in sync with backend/src/utils/roles.js */

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
};

/** Path prefixes allowed per role (first matching wins for nested paths) */
export const ROLE_PATHS = {
  admin: [
    '/admin/dashboard',
    '/admin/analytics',
    '/admin/leads',
    '/admin/quotes',
    '/admin/job-openings',
    '/admin/applications',
    '/admin/services',
    '/admin/projects',
    '/admin/design-styles',
    '/admin/materials',
    '/admin/media',
    '/admin/trust-pillars',
    '/admin/reviews',
    '/admin/partners',
    '/admin/navigation',
    '/admin/settings',
    '/admin/users',
  ],
  manager: [
    '/admin/dashboard',
    '/admin/analytics',
    '/admin/leads',
    '/admin/quotes',
    '/admin/job-openings',
    '/admin/applications',
    '/admin/projects',
    '/admin/reviews',
  ],
  editor: [
    '/admin/dashboard',
    '/admin/services',
    '/admin/projects',
    '/admin/design-styles',
    '/admin/materials',
    '/admin/media',
    '/admin/trust-pillars',
    '/admin/reviews',
    '/admin/partners',
    '/admin/navigation',
  ],
};

export function canAccessPath(role, pathname) {
  const paths = ROLE_PATHS[role] || ROLE_PATHS.editor;
  return paths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function roleLabel(role) {
  if (role === 'admin') return 'Administrator';
  if (role === 'manager') return 'Sales Manager';
  if (role === 'editor') return 'Content Editor';
  return role || 'Staff';
}
