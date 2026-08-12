import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { apiFetch } from '../services/api';

function FooterNavLink({ item }) {
  const isExternal = item.path.startsWith('http://') || item.path.startsWith('https://');
  const className = 'hover:text-[#C4795A] transition font-medium';

  if (isExternal || item.openInNewTab) {
    return (
      <a href={item.path} target="_blank" rel="noreferrer" className={className}>{item.label}</a>
    );
  }
  return <Link to={item.path} className={className}>{item.label}</Link>;
}

export default function Footer() {
  const { settings } = useSite();
  const [services, setServices] = useState([]);
  const [footerLinks, setFooterLinks] = useState([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/services?limit=5'),
      apiFetch('/navigation?placement=footer'),
    ]).then(([servRes, navRes]) => {
      if (servRes.success) setServices(servRes.data.slice(0, 5));
      if (navRes.success) setFooterLinks(navRes.data);
    }).catch(() => {});
  }, []);

  const brandInitial = settings.companyName?.charAt(0) || 'A';
  const social = settings.socialMedia || settings.socialLinks || {};

  return (
    <footer className="bg-gradient-to-b from-stone-950 to-[#0f0e0e] text-stone-300 pt-20 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-stone-800/80">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#C4795A] to-[#5C7A6B] flex items-center justify-center text-white font-serif font-bold text-xl shadow-xl ring-2 ring-white/20">
                {brandInitial}
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-white">{settings.companyName}</span>
            </div>
            {settings.tagline && <p className="text-base text-stone-400 leading-relaxed">{settings.tagline}</p>}
            <div className="flex space-x-4 pt-2">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:text-[#C4795A] hover:bg-stone-800 transition shadow-lg">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:text-[#C4795A] hover:bg-stone-800 transition shadow-lg">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:text-[#C4795A] hover:bg-stone-800 transition shadow-lg">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-base text-stone-400">
              {footerLinks.length > 0 ? footerLinks.map((item) => (
                <li key={item._id}><FooterNavLink item={item} /></li>
              )) : (
                <li><Link to="/" className="hover:text-[#C4795A] transition font-medium">Home</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-6">Specialist Services</h3>
            <ul className="space-y-3 text-base text-stone-400">
              {services.length > 0 ? services.map((s) => (
                <li key={s._id}>
                  <Link to={`/services/${s.slug}`} className="hover:text-[#C4795A] transition font-medium">{s.name}</Link>
                </li>
              )) : (
                <li><Link to="/services" className="hover:text-[#C4795A] transition font-medium">View All Services</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-6">Contact</h3>
            <ul className="space-y-4 text-base text-stone-400">
              {settings.address && (
                <li className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-[#C4795A] shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-[#C4795A] shrink-0" />
                  <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`} className="hover:text-[#C4795A] transition">{settings.phone}</a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-[#C4795A] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-[#C4795A] transition">{settings.email}</a>
                </li>
              )}
              {settings.businessHours && (
                <li className="flex items-center space-x-4">
                  <Clock className="w-6 h-6 text-[#5C7A6B] shrink-0" />
                  <span>{settings.businessHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between text-sm text-stone-500">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 sm:mt-0">
            <Link to="/admin/login" className="hover:text-stone-300 transition font-medium">Staff Portal</Link>
            <Link to="/contact" className="hover:text-stone-300 transition font-medium">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
