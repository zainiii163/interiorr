import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import ImageUploadField from '../components/admin/ImageUploadField';

const emptySettings = {
  companyName: '',
  tagline: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  statistics: {
    yearsExperience: 14,
    completedProjects: 350,
    teamMembers: 45,
    propertyInspections: 820,
    customerRating: 4.9,
  },
};

export default function AdminSettings() {
  const { isAdmin } = useAuth();
  const { refreshSettings } = useSite();
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [integrations, setIntegrations] = useState(null);

  const fetchSettings = async () => {
    try {
      const [res, intRes] = await Promise.all([
        apiFetch('/settings'),
        apiFetch('/integrations/status').catch(() => null),
      ]);
      if (res.success && res.data) {
        setSettings(res.data);
      }
      if (intRes?.success && intRes.data) setIntegrations(intRes.data);
      else if (intRes && !intRes.success && intRes.data) setIntegrations(intRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      statistics: { ...prev.statistics, [field]: Number(value) || 0 },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await apiFetch('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (res.success) {
        setMessage('Settings saved successfully. Public site will reflect these changes.');
        setSettings(res.data);
        await refreshSettings();
      }
    } catch (err) {
      setMessage(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-stone-500 text-sm">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Site Settings</h1>
        <p className="text-xs text-stone-500 mt-1">
          Company info and homepage statistics shown across the public website.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm">
          {message}
        </div>
      )}

      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-sm">
          View only — contact an administrator to change site settings.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              disabled={!isAdmin}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              WhatsApp (digits only)
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm"
            />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-4">Homepage Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              ['yearsExperience', 'Years Experience'],
              ['completedProjects', 'Projects Completed'],
              ['teamMembers', 'Team Members'],
              ['propertyInspections', 'Inspections'],
              ['customerRating', 'Customer Rating'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {label}
                </label>
                <input
                  type="number"
                  step={key === 'customerRating' ? '0.1' : '1'}
                  value={settings.statistics[key]}
                  onChange={(e) => handleStatChange(key, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-4">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['instagram', 'facebook', 'linkedin', 'youtube'].map((key) => (
              <div key={key}>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1 capitalize">{key}</label>
                <input type="url" value={settings.socialMedia?.[key] || ''} onChange={(e) => setSettings((p) => ({ ...p, socialMedia: { ...p.socialMedia, [key]: e.target.value } }))} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-4">Hero Section</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Hero badge text" value={settings.heroBadge || ''} onChange={(e) => handleChange('heroBadge', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <input type="text" placeholder="Hero title" value={settings.heroTitle || ''} onChange={(e) => handleChange('heroTitle', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <input type="text" placeholder="Hero subtitle" value={settings.heroSubtitle || ''} onChange={(e) => handleChange('heroSubtitle', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <textarea placeholder="Hero description" value={settings.heroDescription || ''} onChange={(e) => handleChange('heroDescription', e.target.value)} disabled={!isAdmin} rows={2} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <ImageUploadField
              label="Hero image (upload a real project photo)"
              value={settings.heroImage || ''}
              onChange={(url) => handleChange('heroImage', url)}
            />
            <input type="text" placeholder="Trust badges (comma-separated)" value={(settings.heroTrustBadges || []).join(', ')} onChange={(e) => handleChange('heroTrustBadges', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-4">About Page</h2>
          <div className="space-y-3">
            <input type="text" placeholder="About subtitle" value={settings.aboutSubtitle || ''} onChange={(e) => handleChange('aboutSubtitle', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <input type="text" placeholder="About title" value={settings.aboutTitle || ''} onChange={(e) => handleChange('aboutTitle', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <textarea placeholder="About body" value={settings.aboutBody || ''} onChange={(e) => handleChange('aboutBody', e.target.value)} disabled={!isAdmin} rows={3} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <input type="text" placeholder="About bullets (comma-separated)" value={(settings.aboutBullets || []).join(', ')} onChange={(e) => handleChange('aboutBullets', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <input type="text" placeholder="Certifications (comma-separated)" value={(settings.certifications || []).join(', ')} onChange={(e) => handleChange('certifications', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <ImageUploadField
              label="About image"
              value={settings.aboutImage || ''}
              onChange={(url) => handleChange('aboutImage', url)}
            />
            <textarea placeholder="Mission" value={settings.mission || ''} onChange={(e) => handleChange('mission', e.target.value)} disabled={!isAdmin} rows={2} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <textarea placeholder="Vision" value={settings.vision || ''} onChange={(e) => handleChange('vision', e.target.value)} disabled={!isAdmin} rows={2} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-4">Skills Section (Homepage)</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Skills title" value={settings.skillsTitle || ''} onChange={(e) => handleChange('skillsTitle', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <textarea placeholder="Skills body" value={settings.skillsBody || ''} onChange={(e) => handleChange('skillsBody', e.target.value)} disabled={!isAdmin} rows={2} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <textarea
              placeholder="Skills (one per line: Label:85)"
              value={(settings.skills || []).map((s) => `${s.label}:${s.value}`).join('\n')}
              onChange={(e) => handleChange('skills', e.target.value.split('\n').filter(Boolean).map((line) => {
                const [label, val] = line.split(':');
                return { label: label?.trim(), value: Number(val) || 0 };
              }))}
              disabled={!isAdmin}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50 font-mono"
            />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-4">CTA Sections & Contact</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Business hours" value={settings.businessHours || ''} onChange={(e) => handleChange('businessHours', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <input type="text" placeholder="Map embed URL" value={settings.mapEmbedUrl || ''} onChange={(e) => handleChange('mapEmbedUrl', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <input type="text" placeholder="CTA band title" value={settings.ctaBandTitle || ''} onChange={(e) => handleChange('ctaBandTitle', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <textarea placeholder="CTA band body" value={settings.ctaBandBody || ''} onChange={(e) => handleChange('ctaBandBody', e.target.value)} disabled={!isAdmin} rows={2} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <ImageUploadField
              label="CTA band image"
              value={settings.ctaBandImage || ''}
              onChange={(url) => handleChange('ctaBandImage', url)}
            />
            <input type="text" placeholder="Final CTA title" value={settings.finalCtaTitle || ''} onChange={(e) => handleChange('finalCtaTitle', e.target.value)} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <textarea placeholder="Final CTA body" value={settings.finalCtaBody || ''} onChange={(e) => handleChange('finalCtaBody', e.target.value)} disabled={!isAdmin} rows={2} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-4">SEO</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Default page title" value={settings.seo?.defaultTitle || ''} onChange={(e) => setSettings((p) => ({ ...p, seo: { ...p.seo, defaultTitle: e.target.value } }))} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <textarea placeholder="Default meta description" value={settings.seo?.defaultDescription || ''} onChange={(e) => setSettings((p) => ({ ...p, seo: { ...p.seo, defaultDescription: e.target.value } }))} disabled={!isAdmin} rows={2} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
            <input type="text" placeholder="OG image URL" value={settings.seo?.ogImage || ''} onChange={(e) => setSettings((p) => ({ ...p, seo: { ...p.seo, ogImage: e.target.value } }))} disabled={!isAdmin} className="w-full px-4 py-3 rounded-xl border text-sm disabled:bg-stone-50" />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-4">Google Reviews Sync</h2>
          <p className="text-xs text-stone-500 mb-4">
            Configure Google Places API to sync real reviews. Without keys, the Sync button imports curated demo reviews.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Google Place ID
              </label>
              <input
                type="text"
                value={settings.googlePlaceId || ''}
                onChange={(e) => handleChange('googlePlaceId', e.target.value)}
                disabled={!isAdmin}
                placeholder="ChIJ..."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Google Places API Key
                {settings.googleApiKeyConfigured && !settings.googleApiKey && (
                  <span className="ml-2 font-normal normal-case text-emerald-600">
                    (configured — leave blank to keep)
                  </span>
                )}
              </label>
              <input
                type="password"
                value={settings.googleApiKey || ''}
                onChange={(e) => handleChange('googleApiKey', e.target.value)}
                disabled={!isAdmin}
                placeholder={
                  settings.googleApiKeyConfigured
                    ? '•••••••• (enter new key to replace)'
                    : 'AIza...'
                }
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="autoSyncGoogle"
                checked={settings.autoSyncGoogleReviews ?? true}
                onChange={(e) => handleChange('autoSyncGoogleReviews', e.target.checked)}
                disabled={!isAdmin}
                className="rounded"
              />
              <label htmlFor="autoSyncGoogle" className="text-xs text-stone-600">
                Enable automatic Google reviews sync
              </label>
            </div>
            {settings.lastGoogleSyncAt && (
              <p className="sm:col-span-2 text-xs text-stone-400">
                Last synced: {new Date(settings.lastGoogleSyncAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {integrations && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-stone-900 mb-2">Integration Health</h2>
            <p className="text-xs text-stone-500 mb-4">
              Live status from backend environment (SMTP, Stripe, Cloudinary, Google Places).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(integrations)
                .filter(([key]) => key !== 'mongodb')
                .map(([key, item]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-xl border text-xs ${
                      item.configured
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="font-bold">
                      {item.configured ? 'Ready' : 'Needs setup'} · {item.label}
                    </div>
                    <div className="mt-1 opacity-80">{item.hint}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          {isAdmin && (
            <>
              <button
                type="submit"
                disabled={saving}
                className="btn-terracotta px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
              <button
                type="button"
                onClick={fetchSettings}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-stone-300 text-stone-700 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
