import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { MapPin, Phone, Mail, Shield, ExternalLink, Plus, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategory, setShowNetlifyGuide, setIsAddProductModalOpen, setShowInstallModal } = useStore();

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActivePage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#121212] text-[#E0D9CE] border-t border-[#262626]">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Identity Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-black tracking-widest text-white font-heading">
              SANGM'S
            </h3>
            <p className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
              Wear Your Style. Own Your Identity.
            </p>
            <p className="text-xs text-[#A8A196] leading-relaxed max-w-sm">
              Exclusive online clothing boutique dedicated solely to women, ladies, and girls. Fluid midi dresses, silk blouses, sculpted denim, and artisanal leather accessories dispatched from our atelier in Sikar, Rajasthan.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#CCCCCC]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>Todinagar, Sikar, Rajasthan — 332001, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a
                  href="tel:+919799896438"
                  className="hover:text-white transition-colors"
                >
                  +91 97998 96438 (Call / WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a
                  href="mailto:homelander69.brrbrrpatapim@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  homelander69.brrbrrpatapim@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Women's & Ladies' Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Women & Ladies
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A196]">
              <li>
                <button
                  onClick={() => handleCategoryClick("Women's Dresses")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dresses & Gowns
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("Tops & Blouses")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tops & Blouses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("Jeans & Trousers")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jeans & Trousers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("Kurties & Modern Ethnic")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kurties & Modern Ethnic
                </button>
              </li>
            </ul>
          </div>

          {/* Girls & Accessories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Girls & Accessories
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A196]">
              <li>
                <button
                  onClick={() => handleCategoryClick("Co-ords & Sets")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Co-ords & Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("Skirts")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Skirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("Hoodies & Winterwear")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hoodies & Winterwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("Handbags & Accessories")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Handbags & Leather
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links & Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Atelier & Storefront
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A196]">
              <li>
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[#E8DEC8] font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Product</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Women's Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[#C5A880]"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowInstallModal(true)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[#C5A880] font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install on This Device</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowNetlifyGuide(true)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[#00C7B7]"
                >
                  <span>Netlify Deploy Guide</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Payment Badges & Indian Delivery Trust Bar */}
      <div className="border-t border-[#222222] bg-[#0A0A0A] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[#888888]">Accepted Payment Modes in India:</span>
            <span className="bg-[#1A1A1A] text-white px-2 py-0.5 border border-[#333333] text-[10px] font-mono">UPI / QR</span>
            <span className="bg-[#1A1A1A] text-white px-2 py-0.5 border border-[#333333] text-[10px] font-mono">RuPay</span>
            <span className="bg-[#1A1A1A] text-white px-2 py-0.5 border border-[#333333] text-[10px] font-mono">Visa</span>
            <span className="bg-[#1A1A1A] text-white px-2 py-0.5 border border-[#333333] text-[10px] font-mono">Mastercard</span>
            <span className="bg-[#1A1A1A] text-white px-2 py-0.5 border border-[#333333] text-[10px] font-mono">Cash on Delivery</span>
          </div>

          <div className="text-center sm:text-right text-[11px]">
            © {new Date().getFullYear()} SANGM'S Women's Boutique. Todinagar, Sikar, Rajasthan.
          </div>
        </div>
      </div>
    </footer>
  );
};
