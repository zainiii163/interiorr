import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages (loaded eagerly — high traffic)
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import DesignStyles from './pages/DesignStyles';
import StyleDetail from './pages/StyleDetail';
import Materials from './pages/Materials';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Consultation from './pages/Consultation';
import Careers from './pages/Careers';
import Commercial from './pages/Commercial';
import ClientPortal from './pages/ClientPortal';
import PaymentSuccess from './pages/PaymentSuccess';

// Admin Pages (lazy loaded — reduce initial bundle size)
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminLeads = lazy(() => import('./pages/AdminLeads'));
const LeadDetailAdmin = lazy(() => import('./pages/LeadDetailAdmin'));
const AdminServices = lazy(() => import('./pages/AdminServices'));
const AdminProjects = lazy(() => import('./pages/AdminProjects'));
const AdminQuotes = lazy(() => import('./pages/AdminQuotes'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminReviews = lazy(() => import('./pages/AdminReviews'));
const AdminPartners = lazy(() => import('./pages/AdminPartners'));
const AdminDesignStyles = lazy(() => import('./pages/AdminDesignStyles'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminTrustPillars = lazy(() => import('./pages/AdminTrustPillars'));
const AdminJobApplications = lazy(() => import('./pages/AdminJobApplications'));
const AdminJobOpenings = lazy(() => import('./pages/AdminJobOpenings'));
const AdminNavigation = lazy(() => import('./pages/AdminNavigation'));
const AdminMaterials = lazy(() => import('./pages/AdminMaterials'));
const AdminMedia = lazy(() => import('./pages/AdminMedia'));
const AdminFaqs = lazy(() => import('./pages/AdminFaqs'));
const AdminPages = lazy(() => import('./pages/AdminPages'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AdminFallback() {
  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#C4795A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-400 text-xs">Loading admin panel...</p>
      </div>
    </div>
  );
}

function PublicFallback() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-3 border-[#C4795A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/portal/:code" element={<ClientPortal />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />

            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/design-styles" element={<DesignStyles />} />
              <Route path="/design-styles/:slug" element={<StyleDetail />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/book-consultation" element={<Navigate to="/consultation" replace />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/commercial" element={<Commercial />} />
              <Route path="*" element={
                <Suspense fallback={<PublicFallback />}>
                  <NotFound />
                </Suspense>
              } />
            </Route>

            <Route path="/admin/login" element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            } />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
              <Route path="analytics" element={<Suspense fallback={<AdminFallback />}><AdminAnalytics /></Suspense>} />
              <Route path="leads" element={<Suspense fallback={<AdminFallback />}><AdminLeads /></Suspense>} />
              <Route path="leads/:id" element={<Suspense fallback={<AdminFallback />}><LeadDetailAdmin /></Suspense>} />
              <Route path="services" element={<Suspense fallback={<AdminFallback />}><AdminServices /></Suspense>} />
              <Route path="projects" element={<Suspense fallback={<AdminFallback />}><AdminProjects /></Suspense>} />
              <Route path="quotes" element={<Suspense fallback={<AdminFallback />}><AdminQuotes /></Suspense>} />
              <Route path="design-styles" element={<Suspense fallback={<AdminFallback />}><AdminDesignStyles /></Suspense>} />
              <Route path="reviews" element={<Suspense fallback={<AdminFallback />}><AdminReviews /></Suspense>} />
              <Route path="partners" element={<Suspense fallback={<AdminFallback />}><AdminPartners /></Suspense>} />
              <Route path="materials" element={<Suspense fallback={<AdminFallback />}><AdminMaterials /></Suspense>} />
              <Route path="media" element={<Suspense fallback={<AdminFallback />}><AdminMedia /></Suspense>} />
              <Route path="faqs" element={<Suspense fallback={<AdminFallback />}><AdminFaqs /></Suspense>} />
              <Route path="pages" element={<Suspense fallback={<AdminFallback />}><AdminPages /></Suspense>} />
              <Route path="trust-pillars" element={<Suspense fallback={<AdminFallback />}><AdminTrustPillars /></Suspense>} />
              <Route path="applications" element={<Suspense fallback={<AdminFallback />}><AdminJobApplications /></Suspense>} />
              <Route path="job-openings" element={<Suspense fallback={<AdminFallback />}><AdminJobOpenings /></Suspense>} />
              <Route path="navigation" element={<Suspense fallback={<AdminFallback />}><AdminNavigation /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense>} />
              <Route path="users" element={<Suspense fallback={<AdminFallback />}><AdminUsers /></Suspense>} />
              <Route path="*" element={<Suspense fallback={<AdminFallback />}><NotFound admin /></Suspense>} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </SiteProvider>
  );
}

export default App;
