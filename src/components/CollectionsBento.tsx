import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Tag, Plus } from 'lucide-react';
import { ProductCategory } from '../types';

export const CollectionsBento: React.FC = () => {
  const { setActivePage, setSelectedCategory, setIsAddProductModalOpen } = useStore();

  const handleSelectCollection = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActivePage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F7F4ED] border-b border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8E877D] font-semibold mb-2">
              SANGM'S WOMEN · LADIES · GIRLS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121212] font-heading tracking-tight">
              Curated Wardrobe Pillars
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#121212] hover:bg-[#2B2B2B] text-white text-xs font-semibold px-4 py-2.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Product</span>
            </button>
          </div>
        </div>

        {/* 3-Column Bento Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Women's Dresses */}
          <div
            onClick={() => handleSelectCollection("Women's Dresses")}
            className="group relative bg-[#121212] text-white overflow-hidden cursor-pointer aspect-[3/4] flex flex-col justify-end p-8 transition-transform duration-300 hover:shadow-xl"
          >
            <img
              src="/src/assets/images/womens_collection_editorial_1794323733103.jpg"
              alt="Women's Contemporary Fashion Collection"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="relative z-10 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D4C3A3]">
                Fluid & Elegant
              </span>
              <h3 className="text-2xl font-bold font-heading text-white">
                Dresses & Gowns
              </h3>
              <p className="text-xs text-[#CCCCCC] line-clamp-2">
                Asymmetric draped wrap dresses, sand-washed cupro, linen midi cuts, and modern evening wear.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#E8DEC8] group-hover:text-white transition-colors">
                <span>Explore Dresses</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: Tops & Co-Ords for Ladies & Girls */}
          <div
            onClick={() => handleSelectCollection("Tops & Blouses")}
            className="group relative bg-[#121212] text-white overflow-hidden cursor-pointer aspect-[3/4] flex flex-col justify-end p-8 transition-transform duration-300 hover:shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
              alt="Tops & Blouses for Ladies and Girls"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="relative z-10 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D4C3A3]">
                Tailored & Effortless
              </span>
              <h3 className="text-2xl font-bold font-heading text-white">
                Tops, Blouses & Co-Ords
              </h3>
              <p className="text-xs text-[#CCCCCC] line-clamp-2">
                Silk-modal camisoles, cotton poplin blouses, knit mocknecks, and matching sets for ladies & girls.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#E8DEC8] group-hover:text-white transition-colors">
                <span>Explore Tops & Sets</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Handbags & Accessories */}
          <div
            onClick={() => handleSelectCollection("Handbags & Accessories")}
            className="group relative bg-[#121212] text-white overflow-hidden cursor-pointer aspect-[3/4] flex flex-col justify-end p-8 transition-transform duration-300 hover:shadow-xl"
          >
            <img
              src="/src/assets/images/accessories_collection_1794323733805.jpg"
              alt="Artisan Handbags & Accessories"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute top-4 right-4 z-10 bg-[#C5A880] text-[#121212] text-[10px] font-bold px-3 py-1 flex items-center gap-1 uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              <span>Handcrafted Leather</span>
            </div>

            <div className="relative z-10 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D4C3A3]">
                Artisanal Accents
              </span>
              <h3 className="text-2xl font-bold font-heading text-white">
                Handbags & Accessories
              </h3>
              <p className="text-xs text-[#CCCCCC] line-clamp-2">
                Full-grain leather totes, minimalist clutches, polarized sunglasses, and artisan jewellery.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#E8DEC8] group-hover:text-white transition-colors">
                <span>Explore Accessories</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
