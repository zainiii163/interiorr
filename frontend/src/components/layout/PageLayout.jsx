import Header from './Header';
import Footer from './Footer';
import WhatsAppFab from './WhatsAppFab';

export default function PageLayout({ children, showWhatsApp = true }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {showWhatsApp && <WhatsAppFab />}
    </div>
  );
}