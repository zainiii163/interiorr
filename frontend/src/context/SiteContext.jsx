import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const SiteContext = createContext();

const emptySettings = {
  companyName: '',
  tagline: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  businessHours: '',
  statistics: {},
  seo: {},
  socialMedia: {},
  heroTrustBadges: [],
  aboutBullets: [],
  skills: [],
};

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(emptySettings);
  const [loaded, setLoaded] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await apiFetch('/settings');
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (e) {
      console.error('Failed to load site settings:', e);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteContext.Provider value={{ settings, loaded, refreshSettings: fetchSettings }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
