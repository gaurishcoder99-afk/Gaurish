import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CollectionsBento } from './components/CollectionsBento';
import { HomeFeaturedSections } from './components/HomeFeaturedSections';
import { ProductCatalogue } from './components/ProductCatalogue';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { NetlifyGuideModal } from './components/NetlifyGuideModal';
import { AddProductModal } from './components/AddProductModal';
import { InstallAppModal } from './components/InstallAppModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AuthModal } from './components/AuthModal';
import { Check } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, toast, showInstallModal, setShowInstallModal } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717]">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <Hero />
            <CollectionsBento />
            <HomeFeaturedSections />
            <TestimonialsSection />
            <NewsletterSection />
          </>
        )}

        {activePage === 'catalog' && (
          <ProductCatalogue />
        )}

        {activePage === 'checkout' && (
          <CheckoutView />
        )}

        {activePage === 'order-confirmation' && (
          <OrderConfirmationModal />
        )}

        {activePage === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <AddProductModal />
      <NetlifyGuideModal />
      <InstallAppModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
      <OfflineIndicator />
      <AuthModal />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white text-xs font-medium py-3 px-5 shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 border border-[#333333]">
          <div className="w-5 h-5 rounded-full bg-[#C5A880] text-[#121212] flex items-center justify-center font-bold">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toast}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
