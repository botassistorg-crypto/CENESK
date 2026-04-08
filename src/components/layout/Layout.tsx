import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import CartDrawer from './CartDrawer';
import { Toaster } from 'sonner';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-[#111111] bg-[#F5F1EB]">
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <main className="flex-grow pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
