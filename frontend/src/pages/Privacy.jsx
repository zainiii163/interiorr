import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Privacy() {
  const { settings } = useSite();
  const company = settings.companyName;
  const email = settings.email;

  return (
    <div className="page-offset pb-20">
      <section className="bg-stone-900 text-white py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C4795A]/20 text-[#C4795A] mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-stone-400 mt-3 text-sm max-w-xl mx-auto">
            How {company} collects, uses, and protects your personal information.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-stone prose-sm sm:prose-base">
        <div className="space-y-8 text-stone-700 leading-relaxed text-sm sm:text-base">
          <section className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex gap-4">
            <Lock className="w-5 h-5 text-[#C4795A] shrink-0 mt-0.5" />
            <p className="m-0 text-stone-600">
              We treat your project details and contact information with the same care we apply to
              your property. This policy explains what we collect when you use our website or
              request a consultation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900">Information we collect</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-stone-600">
              <li>Name, email, phone number, and property location when you submit a form</li>
              <li>Project notes, service preferences, and consultation details you provide voluntarily</li>
              <li>Basic usage data (pages visited, device type) to improve our website experience</li>
              <li>Payment-related data processed securely through our payment provider when you accept a quote</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900">How we use your information</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-stone-600">
              <li>To respond to consultation requests and prepare quotations</li>
              <li>To coordinate site visits, project updates, and client portal access</li>
              <li>To comply with UAE business and contracting requirements where applicable</li>
              <li>We do not sell, rent, or trade your personal data to marketing companies</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900">Data security</h2>
            <p className="mt-3 text-stone-600">
              Forms are submitted over encrypted HTTPS connections. Access to client records is
              restricted to authorised staff. Quote and payment links use unique access codes so
              only intended recipients can view sensitive project pricing.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900">Your rights</h2>
            <p className="mt-3 text-stone-600">
              You may request access to, correction of, or deletion of your personal data by
              contacting us. We will respond within a reasonable timeframe in line with UAE data
              protection practices.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900">Contact</h2>
            <p className="mt-3 text-stone-600">
              Questions about this policy? Email{' '}
              {email ? (
              <a href={`mailto:${email}`} className="text-[#C4795A] font-semibold hover:underline inline-flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {email}
              </a>
              ) : (
                <Link to="/contact" className="text-[#C4795A] font-semibold hover:underline">contact us</Link>
              )}
            </p>
          </section>

          <p className="text-xs text-stone-500 pt-4 border-t border-stone-200">
            Last updated: {new Date().toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/consultation" className="btn-terracotta px-6 py-3 rounded-xl text-sm font-semibold">
            Book a Consultation
          </Link>
          <Link to="/contact" className="px-6 py-3 rounded-xl text-sm font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 transition">
            Contact Us
          </Link>
        </div>
      </article>
    </div>
  );
}
