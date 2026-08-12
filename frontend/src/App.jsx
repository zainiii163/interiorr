import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import DesignStyles from './pages/DesignStyles';
import StyleDetail from './pages/StyleDetail';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Consultation from './pages/Consultation';
import Careers from './pages/Careers';
import ClientPortal from './pages/ClientPortal';
import PaymentSuccess from './pages/PaymentSuccess';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminLeads from './pages/AdminLeads';
import LeadDetailAdmin from './pages/LeadDetailAdmin';
import AdminServices from './pages/AdminServices';
import AdminProjects from './pages/AdminProjects';
import AdminQuotes from './pages/AdminQuotes';
import AdminSettings from './pages/AdminSettings';
import AdminReviews from './pages/AdminReviews';
import AdminPartners from './pages/AdminPartners';
import AdminDesignStyles from './pages/AdminDesignStyles';
import AdminUsers from './pages/AdminUsers';
import AdminTrustPillars from './pages/AdminTrustPillars';
import AdminJobApplications from './pages/AdminJobApplications';
import AdminJobOpenings from './pages/AdminJobOpenings';
import AdminNavigation from './pages/AdminNavigation';
import NotFound from './pages/NotFound';

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
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/book-consultation" element={<Navigate to="/consultation" replace />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="leads/:id" element={<LeadDetailAdmin />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="quotes" element={<AdminQuotes />} />
              <Route path="design-styles" element={<AdminDesignStyles />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="trust-pillars" element={<AdminTrustPillars />} />
              <Route path="applications" element={<AdminJobApplications />} />
              <Route path="job-openings" element={<AdminJobOpenings />} />
              <Route path="navigation" element={<AdminNavigation />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="*" element={<NotFound admin />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </SiteProvider>
  );
}

export default App;
