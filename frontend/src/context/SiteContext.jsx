import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { ENV_SITE_DEFAULTS } from '../utils/constants';
import { DEFAULT_PAGE_COPY } from '../utils/pageCopy';

const SiteContext = createContext();

const emptySettings = {
  ...ENV_SITE_DEFAULTS,
  statistics: {},
  pageCopy: { ...DEFAULT_PAGE_COPY },
  heroTrustBadges: [...(ENV_SITE_DEFAULTS.heroTrustBadges || [])],
  aboutBullets: [...(ENV_SITE_DEFAULTS.aboutBullets || [])],
  certifications: [...(ENV_SITE_DEFAULTS.certifications || [])],
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
    heroTitle: apiData.heroTitle || ENV_SITE_DEFAULTS.heroTitle,
    heroSubtitle: apiData.heroSubtitle || ENV_SITE_DEFAULTS.heroSubtitle,
    heroDescription: apiData.heroDescription || ENV_SITE_DEFAULTS.heroDescription,
    heroBadge: apiData.heroBadge || ENV_SITE_DEFAULTS.heroBadge,
    heroTrustBadges: apiData.heroTrustBadges?.length
      ? apiData.heroTrustBadges
      : ENV_SITE_DEFAULTS.heroTrustBadges,
    aboutTitle: apiData.aboutTitle || ENV_SITE_DEFAULTS.aboutTitle,
    aboutSubtitle: apiData.aboutSubtitle || ENV_SITE_DEFAULTS.aboutSubtitle,
    aboutBody: apiData.aboutBody || ENV_SITE_DEFAULTS.aboutBody,
    aboutBullets: apiData.aboutBullets?.length ? apiData.aboutBullets : ENV_SITE_DEFAULTS.aboutBullets,
    mission: apiData.mission || ENV_SITE_DEFAULTS.mission,
    vision: apiData.vision || ENV_SITE_DEFAULTS.vision,
    finalCtaTitle: apiData.finalCtaTitle || ENV_SITE_DEFAULTS.finalCtaTitle,
    finalCtaBody: apiData.finalCtaBody || ENV_SITE_DEFAULTS.finalCtaBody,
    ctaBandTitle: apiData.ctaBandTitle || ENV_SITE_DEFAULTS.ctaBandTitle,
    ctaBandBody: apiData.ctaBandBody || ENV_SITE_DEFAULTS.ctaBandBody,
    businessHours: apiData.businessHours || ENV_SITE_DEFAULTS.businessHours,
    seo: { ...ENV_SITE_DEFAULTS.seo, ...(apiData.seo || {}) },
    pageCopy: { ...DEFAULT_PAGE_COPY, ...(apiData.pageCopy || {}) },
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
