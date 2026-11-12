import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ArrowRight, Sparkles, Tag, Flame, Plus } from 'lucide-react';

export const HomeFeaturedSections: React.FC = () => {
  const { products, setActivePage, setSelectedCategory, setIsAddProductModalOpen } = useStore();

  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const specialOffers = products.filter(p => p.isSpecialOffer || (p.discountPercent && p.discountPercent >= 20)).slice(0, 4);

  const handleViewAll = () => {
    setSelectedCategory('All');
    setActivePage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-[#E0D7C6] p-8 sm:p-14 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#DDD3C2] text-[#8C6D44] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#8E877D] font-bold">
              EXCLUSIVE WOMEN · LADIES · GIRLS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121212] font-heading">
              Ready to Showcase Your Women's Collection
            </h2>
            <p className="text-xs text-[#737373] leading-relaxed">
              All previous items were deleted. Use the button below to add your handcrafted dresses, tops, co-ord sets, and skirts.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#121212] hover:bg-[#2B2B2B] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#C5A880]" />
              <span>+ Add Product Now</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-16 sm:space-y-24 py-16 bg-[#FDFBF7]">
      
      {/* 1. New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E8E2D5] pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8E877D] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>WOMEN'S ATELIER SIKAR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121212] font-heading">
                New Arrivals
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C6D44] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
              <button
                onClick={handleViewAll}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#121212] hover:text-[#8C6D44] transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E8E2D5] pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8E877D] font-semibold mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>FAVORITES FOR WOMEN & LADIES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121212] font-heading">
                Best Sellers
              </h2>
            </div>
            <button
              onClick={handleViewAll}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#121212] hover:text-[#8C6D44] transition-colors cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Special Offers Section */}
      {specialOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#171717] text-white p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#2B2B2B]">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 bg-[#C5A880] text-[#121212] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                <Tag className="w-3 h-3" />
                <span>Special Festive Discount</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Festive Archive for Women, Ladies & Girls
              </h3>
              <p className="text-xs text-[#CCCCCC]">
                Discover selected silhouettes with up to 30% reduction and complimentary express courier delivery across India.
              </p>
            </div>

            <button
              onClick={handleViewAll}
              className="bg-[#FAF8F5] hover:bg-[#E8DEC8] text-[#121212] px-7 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              Shop Special Offers
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialOffers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
