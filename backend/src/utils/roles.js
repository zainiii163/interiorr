/** Shared staff role permissions for API gates */

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
};

export const ALL_STAFF = [ROLES.ADMIN, ROLES.MANAGER, ROLES.EDITOR];
export const CRM_ROLES = [ROLES.ADMIN, ROLES.MANAGER];
export const CMS_ROLES = [ROLES.ADMIN, ROLES.EDITOR];
export const ANALYTICS_ROLES = [ROLES.ADMIN, ROLES.MANAGER];

export function isCrmRole(role) {
  return CRM_ROLES.includes(role);
}

export function isCmsRole(role) {
  return CMS_ROLES.includes(role) || role === ROLES.MANAGER;
}

export function canViewAnalytics(role) {
  return ANALYTICS_ROLES.includes(role);
}
