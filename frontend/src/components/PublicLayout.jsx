import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import HelpFloat from './HelpFloat';
import SeoHead from './SeoHead';

export default function PublicLayout() {
  return (
    <>
      <SeoHead />
      <Navbar />
      <main className="flex-grow min-w-0 overflow-x-clip">
        <Outlet />
      </main>
      <Footer />
      <HelpFloat />
      <WhatsAppFloat />
    </>
  );
}
