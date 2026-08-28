import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { ENV_SITE_DEFAULTS } from '../utils/constants';

const SiteContext = createContext();

const emptySettings = {
  ...ENV_SITE_DEFAULTS,
  businessHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
  statistics: {},
  seo: {},
  heroTrustBadges: [],
  aboutBullets: [],
  skills: [],
};

function mergeSettings(apiData = {}) {
  const social = apiData.socialMedia || apiData.socialLinks || {};
  return {
    ...emptySettings,
    ...apiData,
    companyName: apiData.companyName || ENV_SITE_DEFAULTS.companyName,
    phone: apiData.phone || ENV_SITE_DEFAULTS.phone,
    whatsapp: apiData.whatsapp || ENV_SITE_DEFAULTS.whatsapp,
    email: apiData.email || ENV_SITE_DEFAULTS.email,
    address: apiData.address || ENV_SITE_DEFAULTS.address,
    logoUrl: apiData.logoUrl || ENV_SITE_DEFAULTS.logoUrl,
    socialMedia: { ...ENV_SITE_DEFAULTS.socialMedia, ...social },
    socialLinks: { ...ENV_SITE_DEFAULTS.socialLinks, ...social },
  };
}

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(emptySettings);
  const [loaded, setLoaded] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await apiFetch('/settings');
      if (res.success && res.data) {
        setSettings(mergeSettings(res.data));
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
