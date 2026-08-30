import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  customerFetch,
  setCustomerToken,
  getCustomerToken,
  refreshCustomerToken,
} from '../services/customerApi';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);

  const loadCustomer = async () => {
    const res = await customerFetch('/customers/auth/me');
    if (res.success) setCustomer(res.data);
  };

  const scheduleRefresh = () => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(async () => {
      if (!getCustomerToken()) return;
      try {
        await refreshCustomerToken();
      } catch {
        setCustomerToken(null);
        setCustomer(null);
      }
    }, 12 * 60 * 1000);
  };

  useEffect(() => {
    const check = async () => {
      let token = getCustomerToken();
      if (!token) {
        try {
          token = await refreshCustomerToken();
        } catch {
          setLoading(false);
          return;
        }
      }
      try {
        await loadCustomer();
        scheduleRefresh();
      } catch {
        try {
          await refreshCustomerToken();
          await loadCustomer();
          scheduleRefresh();
        } catch {
          setCustomerToken(null);
          setCustomer(null);
        }
      } finally {
        setLoading(false);
      }
    };
    check();
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, []);

  const signup = async (payload) => {
    const res = await customerFetch('/customers/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const token = res.data?.token || res.data?.accessToken;
    if (res.success && token) {
      setCustomerToken(token);
      setCustomer(res.data.user);
      scheduleRefresh();
    }
    return res;
  };

  const login = async (email, password) => {
    const res = await customerFetch('/customers/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = res.data?.token || res.data?.accessToken;
    if (res.success && token) {
      setCustomerToken(token);
      setCustomer(res.data.user);
      scheduleRefresh();
    }
    return res;
  };

  const logout = async () => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    try {
      await customerFetch('/customers/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setCustomerToken(null);
    setCustomer(null);
  };

  const refreshCustomer = async () => {
    const res = await customerFetch('/customers/auth/me');
    if (res.success) setCustomer(res.data);
    return res;
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        loading: loading,
        signup,
        login,
        logout,
        refreshCustomer,
        isLoggedIn: Boolean(customer),
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
