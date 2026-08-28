import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useSite } from '../context/SiteContext';
import { DEFAULT_PAGE_COPY } from '../utils/pageCopy';
import ImageUploadField from '../components/admin/ImageUploadField';

const TABS = [
  { id: 'home', label: 'Homepage' },
  { id: 'services', label: 'Services' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'consultation', label: 'Consultation' },
  { id: 'pages', label: 'Other Pages' },
];

function Field({ label, value, onChange, textarea, rows = 3 }) {
  const cls = 'w-full px-3 py-2 border border-stone-300 rounded-xl text-sm';
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">{label}</label>
      {textarea ? (
        <textarea rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

function linesToList(text) {
  return String(text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function pairsToObjects(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split('|');
      return { title: title?.trim() || '', body: rest.join('|').trim() };
    });
}

function objectsToPairs(items) {
  return (items || []).map((item) => `${item.title || ''}|${item.body || ''}${item.link ? `|${item.link}` : ''}`).join('\n');
}

function cardsFromText(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, body, link] = line.split('|').map((s) => s?.trim() || '');
      return { title, body, ...(link ? { link } : {}) };
    });
}

export default function AdminPages() {
  const { refreshSettings } = useSite();
  const [tab, setTab] = useState('home');
  const [copy, setCopy] = useState(DEFAULT_PAGE_COPY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiFetch('/settings')
      .then((res) => {
        if (res.success) {
          setCopy({ ...DEFAULT_PAGE_COPY, ...(res.data.pageCopy || {}) });
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const set = (field, value) => setCopy((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await apiFetch('/page-copy', {
        method: 'PUT',
        body: JSON.stringify({ pageCopy: copy }),
      });
      if (res.success) {
        setMessage('Page copy saved. Public pages will update immediately.');
        setCopy({ ...DEFAULT_PAGE_COPY, ...(res.data.pageCopy || {}) });
        await refreshSettings();
      }
    } catch (err) {
      setMessage(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 break-words">Page Copy</h1>
        <p className="text-xs text-stone-500 mt-1">
          Headlines, hero text, and section copy that used to be hardcoded on the website.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm">{message}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              tab === item.id ? 'bg-[#C4795A] text-white' : 'bg-white border border-stone-200 text-stone-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        {tab === 'home' && (
          <>
            <Field label="Partners label" value={copy.homePartnersLabel} onChange={(v) => set('homePartnersLabel', v)} />
            <Field label="Partners line" value={copy.homePartnersBody} onChange={(v) => set('homePartnersBody', v)} />
            <Field label="Stats badge" value={copy.homeStatsBadge} onChange={(v) => set('homeStatsBadge', v)} />
            <Field label="Stats title" value={copy.homeStatsTitle} onChange={(v) => set('homeStatsTitle', v)} />
            <Field label="Stats body" value={copy.homeStatsBody} onChange={(v) => set('homeStatsBody', v)} textarea />
            <Field label="Services badge" value={copy.homeServicesBadge} onChange={(v) => set('homeServicesBadge', v)} />
            <Field label="Services title" value={copy.homeServicesTitle} onChange={(v) => set('homeServicesTitle', v)} />
            <Field label="Services body" value={copy.homeServicesBody} onChange={(v) => set('homeServicesBody', v)} textarea />
            <Field label="Reviews title" value={copy.homeReviewsTitle} onChange={(v) => set('homeReviewsTitle', v)} />
            <Field label="Materials badge" value={copy.homeMaterialsBadge} onChange={(v) => set('homeMaterialsBadge', v)} />
            <Field label="Materials title" value={copy.homeMaterialsTitle} onChange={(v) => set('homeMaterialsTitle', v)} />
            <Field label="Materials body" value={copy.homeMaterialsBody} onChange={(v) => set('homeMaterialsBody', v)} textarea />
            <Field label="Consultation badge" value={copy.homeConsultBadge} onChange={(v) => set('homeConsultBadge', v)} />
            <Field label="Consultation title" value={copy.homeConsultTitle} onChange={(v) => set('homeConsultTitle', v)} />
            <Field label="Consultation body" value={copy.homeConsultBody} onChange={(v) => set('homeConsultBody', v)} textarea />
            <Field
              label="Consultation bullets (one per line)"
              value={(copy.homeConsultBullets || []).join('\n')}
              onChange={(v) => set('homeConsultBullets', linesToList(v))}
              textarea
              rows={4}
            />
            <Field label="Expertise badge" value={copy.homeExpertiseBadge} onChange={(v) => set('homeExpertiseBadge', v)} />
            <Field label="Expertise title" value={copy.homeExpertiseTitle} onChange={(v) => set('homeExpertiseTitle', v)} />
            <Field label="Expertise body" value={copy.homeExpertiseBody} onChange={(v) => set('homeExpertiseBody', v)} textarea />
            <Field label="Promise badge" value={copy.homePromiseBadge} onChange={(v) => set('homePromiseBadge', v)} />
            <Field label="Promise title" value={copy.homePromiseTitle} onChange={(v) => set('homePromiseTitle', v)} />
            <Field label="Promise body" value={copy.homePromiseBody} onChange={(v) => set('homePromiseBody', v)} textarea />
            <Field label="Process badge" value={copy.homeProcessBadge} onChange={(v) => set('homeProcessBadge', v)} />
            <Field label="Process title" value={copy.homeProcessTitle} onChange={(v) => set('homeProcessTitle', v)} />
            <Field label="Process body" value={copy.homeProcessBody} onChange={(v) => set('homeProcessBody', v)} textarea />
            <Field label="Portfolio title" value={copy.homePortfolioTitle} onChange={(v) => set('homePortfolioTitle', v)} />
            <Field label="Portfolio body" value={copy.homePortfolioBody} onChange={(v) => set('homePortfolioBody', v)} textarea />
            <Field label="Video badge" value={copy.homeVideoBadge} onChange={(v) => set('homeVideoBadge', v)} />
            <Field label="Video title" value={copy.homeVideoTitle} onChange={(v) => set('homeVideoTitle', v)} />
            <Field label="Video body" value={copy.homeVideoBody} onChange={(v) => set('homeVideoBody', v)} textarea />
            <Field label="Styles badge" value={copy.homeStylesBadge} onChange={(v) => set('homeStylesBadge', v)} />
            <Field label="Styles title" value={copy.homeStylesTitle} onChange={(v) => set('homeStylesTitle', v)} />
            <Field label="Styles body" value={copy.homeStylesBody} onChange={(v) => set('homeStylesBody', v)} textarea />
            <Field label="Home CTA — Commercial" value={copy.homeCtaCommercial} onChange={(v) => set('homeCtaCommercial', v)} />
            <Field label="Home CTA — Careers" value={copy.homeCtaCareers} onChange={(v) => set('homeCtaCareers', v)} />
          </>
        )}

        {tab === 'services' && (
          <>
            <Field label="Hero badge" value={copy.servicesHeroBadge} onChange={(v) => set('servicesHeroBadge', v)} />
            <Field label="Hero title" value={copy.servicesHeroTitle} onChange={(v) => set('servicesHeroTitle', v)} />
            <Field label="Hero body" value={copy.servicesHeroBody} onChange={(v) => set('servicesHeroBody', v)} textarea />
          </>
        )}

        {tab === 'commercial' && (
          <>
            <Field label="Hero badge" value={copy.commercialHeroBadge} onChange={(v) => set('commercialHeroBadge', v)} />
            <Field label="Hero title" value={copy.commercialHeroTitle} onChange={(v) => set('commercialHeroTitle', v)} />
            <Field label="Hero subtitle" value={copy.commercialHeroSubtitle} onChange={(v) => set('commercialHeroSubtitle', v)} textarea />
            <ImageUploadField
              label="Commercial hero image (upload your project photo)"
              value={copy.commercialHeroImage}
              onChange={(url) => set('commercialHeroImage', url)}
            />
            <Field label="Spaces section title" value={copy.commercialSpacesTitle} onChange={(v) => set('commercialSpacesTitle', v)} />
            <Field
              label="Spaces (one per line: Title|Description)"
              value={objectsToPairs(copy.commercialSpaces)}
              onChange={(v) => set('commercialSpaces', pairsToObjects(v))}
              textarea
              rows={5}
            />
            <Field label="FAQ section title" value={copy.commercialFaqTitle} onChange={(v) => set('commercialFaqTitle', v)} />
            <Field label="CTA title" value={copy.commercialCtaTitle} onChange={(v) => set('commercialCtaTitle', v)} />
            <Field label="CTA body" value={copy.commercialCtaBody} onChange={(v) => set('commercialCtaBody', v)} textarea />
          </>
        )}

        {tab === 'consultation' && (
          <>
            <Field label="Badge" value={copy.consultBadge} onChange={(v) => set('consultBadge', v)} />
            <Field label="Title" value={copy.consultTitle} onChange={(v) => set('consultTitle', v)} />
            <Field label="Subtitle" value={copy.consultSubtitle} onChange={(v) => set('consultSubtitle', v)} textarea />
            <Field label="Sidebar next-step title" value={copy.consultNextTitle} onChange={(v) => set('consultNextTitle', v)} />
            <Field label="Sidebar next-step body" value={copy.consultNextBody} onChange={(v) => set('consultNextBody', v)} textarea />
            <Field
              label="Sidebar cards (one per line: Title|Body|optional /path)"
              value={objectsToPairs(copy.consultCards)}
              onChange={(v) => set('consultCards', cardsFromText(v))}
              textarea
              rows={4}
            />
          </>
        )}

        {tab === 'pages' && (
          <>
            <Field label="Projects badge" value={copy.projectsHeroBadge} onChange={(v) => set('projectsHeroBadge', v)} />
            <Field label="Projects title" value={copy.projectsHeroTitle} onChange={(v) => set('projectsHeroTitle', v)} />
            <Field label="Projects body" value={copy.projectsHeroBody} onChange={(v) => set('projectsHeroBody', v)} textarea />
            <Field label="Reviews title" value={copy.reviewsHeroTitle} onChange={(v) => set('reviewsHeroTitle', v)} />
            <Field label="Reviews body" value={copy.reviewsHeroBody} onChange={(v) => set('reviewsHeroBody', v)} textarea />
            <Field label="Styles page badge" value={copy.stylesHeroBadge} onChange={(v) => set('stylesHeroBadge', v)} />
            <Field label="Styles page title" value={copy.stylesHeroTitle} onChange={(v) => set('stylesHeroTitle', v)} />
            <Field label="Styles page body" value={copy.stylesHeroBody} onChange={(v) => set('stylesHeroBody', v)} textarea />
            <Field label="Footer trust — licensed" value={copy.footerTrustLicensed} onChange={(v) => set('footerTrustLicensed', v)} />
            <Field label="Footer trust — secure" value={copy.footerTrustSecure} onChange={(v) => set('footerTrustSecure', v)} />
            <Field label="Footer trust — clients" value={copy.footerTrustClients} onChange={(v) => set('footerTrustClients', v)} textarea />
          </>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-terracotta px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save page copy'}
        </button>
      </form>
    </div>
  );
}
