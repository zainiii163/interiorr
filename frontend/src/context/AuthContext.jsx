import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiFetch, setAuthToken, getAuthToken, refreshAccessToken } from '../services/api';
import { canAccessPath, roleLabel } from '../utils/roles';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);

  const loadUser = async () => {
    const res = await apiFetch('/auth/me');
    if (res.success) setUser(res.data);
  };

  const scheduleTokenRefresh = () => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(async () => {
      if (!getAuthToken()) return;
      try {
        await refreshAccessToken();
      } catch {
        setAuthToken(null);
        setUser(null);
      }
    }, 12 * 60 * 1000);
  };

  useEffect(() => {
    const checkUser = async () => {
      let token = getAuthToken();

      if (!token) {
        try {
          token = await refreshAccessToken();
        } catch {
          setLoading(false);
          return;
        }
      }

      try {
        await loadUser();
        scheduleTokenRefresh();
      } catch {
        try {
          await refreshAccessToken();
          await loadUser();
          scheduleTokenRefresh();
        } catch {
          setAuthToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, []);

  const login = async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = res.data?.token || res.data?.accessToken;
    if (res.success && token) {
      setAuthToken(token);
      setUser(res.data.user);
      scheduleTokenRefresh();
    }
    return res;
  };

  const logout = async () => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    setAuthToken(null);
    setUser(null);
  };

  const role = user?.role;
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isEditor = role === 'editor';
  const canManageCrm = isAdmin || isManager;
  const canManageCms = isAdmin || isEditor;
  const canViewAnalytics = isAdmin || isManager;
  const canAccess = (pathname) => (role ? canAccessPath(role, pathname) : false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        role,
        roleLabel: roleLabel(role),
        isAdmin,
        isManager,
        isEditor,
        canManageCrm,
        canManageCms,
        canViewAnalytics,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
