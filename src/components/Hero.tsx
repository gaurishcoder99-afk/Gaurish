import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, MapPin, ShieldCheck, Truck, RefreshCw, Plus } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActivePage, setSelectedCategory, setIsAddProductModalOpen, products } = useStore();

  return (
    <div className="relative bg-[#0F0F0F] text-[#FAF8F5] overflow-hidden">
      {/* Hero Canvas with Measured Scrim for Legibility */}
      <div className="relative min-h-[580px] lg:min-h-[720px] flex items-center">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/womens_collection_editorial_1794323733103.jpg"
            alt="SANGM'S Women's Editorial Fashion Campaign"
            className="w-full h-full object-cover object-center brightness-90 filter"
            referrerPolicy="no-referrer"
          />
          {/* Graded Dual Scrim to ensure contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent lg:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-2xl space-y-6">
            
            {/* Origin & Women's Focus Kicker */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4C3A3] font-medium flex-wrap">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                Todinagar, Sikar
              </span>
              <span aria-hidden="true" className="text-[#888888]">·</span>
              <span className="font-semibold text-white">FOR WOMEN, LADIES & GIRLS</span>
              <span aria-hidden="true" className="text-[#888888]">·</span>
              <span>Autumn / Festive 2026</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-[1.08] text-balance">
              Wear Your Style.<br />
              <span className="text-[#E8DEC8]">Own Your Identity.</span>
            </h1>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg text-[#E0D9CE] leading-relaxed max-w-xl font-normal">
              An exclusive boutique curated solely for women, ladies, and girls. From fluid silk drape camisoles and sand-washed midi dresses to effortless co-ord sets and artisan leather handbags.
            </p>

            {/* CTA Controls including "+ Add Product" */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setActivePage('catalog');
                }}
                className="inline-flex items-center justify-center gap-3 bg-[#FAF8F5] text-[#121212] hover:bg-[#E8DEC8] px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-lg active:scale-98 whitespace-nowrap"
              >
                <span>Shop Catalogue ({products.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#D4C3A3] text-[#121212] px-6 py-4 text-sm font-bold tracking-wide transition-colors cursor-pointer whitespace-nowrap shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Product</span>
              </button>
            </div>

            {/* Status note */}
            <div className="pt-4 text-xs text-[#A8A196] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>
                {products.length === 0
                  ? "Catalogue is clean & ready for your custom items. Click '+ Add Product' to start building your collection."
                  : `${products.length} women's pieces currently in catalogue. Add more anytime.`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Trust Strip */}
      <div className="bg-[#141414] border-t border-[#262626] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-[#C7BFB3]">
          
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#C5A880] shrink-0" />
            <div>
              <div className="font-semibold text-white">Free Express Shipping</div>
              <div className="text-[#8E877D]">Orders over ₹999 across India</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#C5A880] shrink-0" />
            <div>
              <div className="font-semibold text-white">Women's Atelier Sikar</div>
              <div className="text-[#8E877D]">Dispatched from Todinagar Hub</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0" />
            <div>
              <div className="font-semibold text-white">Tailored Comfort</div>
              <div className="text-[#8E877D]">Natural silks, cupro, linen & denim</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-[#C5A880] shrink-0" />
            <div>
              <div className="font-semibold text-white">Cash on Delivery</div>
              <div className="text-[#8E877D]">Zero advance risk, doorstep delivery</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
