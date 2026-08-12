import { Routes, Route } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';

import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import ProjectsPage from '../pages/public/ProjectsPage';
import ProjectDetailPage from '../pages/public/ProjectDetailPage';
import DesignStylesPage from '../pages/public/DesignStylesPage';
import ReviewsPage from '../pages/public/ReviewsPage';
import ContactPage from '../pages/public/ContactPage';
import BookConsultationPage from '../pages/public/BookConsultationPage';
import NotFoundPage from '../pages/public/NotFoundPage';

export default function PublicRoutes() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/design-styles" element={<DesignStylesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book-consultation" element={<BookConsultationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageLayout>
  );
}