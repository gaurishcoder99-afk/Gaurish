import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';
import { Search, ArrowUpDown, X, Sparkles, Filter, Plus, Trash2 } from 'lucide-react';

export const ProductCatalogue: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setIsAddProductModalOpen,
    deleteAllProducts
  } = useStore();

  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount' | 'newest'>('featured');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Women' | 'Ladies' | 'Girls'>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filtered & Sorted list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Gender/Demographic match (Women / Ladies / Girls)
      if (selectedGender !== 'All' && product.gender !== selectedGender) {
        return false;
      }
      // Stock match
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      // Price ceiling
      if (product.price > maxPrice) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      if (sortOption === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, selectedCategory, selectedGender, inStockOnly, maxPrice, searchQuery, sortOption]);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedGender('All');
    setInStockOnly(false);
    setMaxPrice(8000);
    setSearchQuery('');
    setSortOption('featured');
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7]" id="catalogue-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Add Product & Clear All Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8E2D5]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8E877D] font-semibold mb-2">
              <span>SANGM'S WOMEN'S ATELIER</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-[#8C6D44]">
                <Sparkles className="w-3 h-3" />
                Women · Ladies · Girls Exclusive
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121212] font-heading tracking-tight">
              {selectedCategory === 'All' ? "Women's, Ladies & Girls Catalogue" : selectedCategory}
            </h1>
            <p className="text-xs text-[#737373] mt-1 font-mono">
              Showing {filteredProducts.length} of {products.length} products · Currency in Indian Rupees (₹)
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Prominent "+ Add Product" Button */}
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#C5A880]" />
              <span>+ Add Product</span>
            </button>

            {products.length > 0 && (
              <button
                onClick={deleteAllProducts}
                className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Delete all products from catalogue"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All</span>
              </button>
            )}

            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                type="text"
                placeholder="Search dresses, tops, sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#D5CDBD] text-xs py-2 pl-9 pr-7 text-[#171717] outline-none focus:border-[#121212]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888888] hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center bg-white border border-[#D5CDBD] px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#888888] mr-2" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-transparent font-medium text-[#171717] outline-none cursor-pointer"
              >
                <option value="featured">Featured Pieces</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount %</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="py-4 overflow-x-auto scrollbar-none flex items-center gap-2 border-b border-[#E8E2D5]">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`whitespace-nowrap shrink-0 px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#121212] text-white font-semibold'
                : 'bg-white text-[#404040] border border-[#DDD3C2] hover:border-[#121212]'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap shrink-0 px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#121212] text-white font-semibold'
                    : 'bg-white text-[#404040] border border-[#DDD3C2] hover:border-[#121212]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Demographic Selector (Women / Ladies / Girls) */}
        <div className="mt-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[#737373] font-medium">Department:</span>
              {(['All', 'Women', 'Ladies', 'Girls'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                    selectedGender === g
                      ? 'bg-[#E8DEC8] text-[#121212] font-semibold'
                      : 'text-[#555555] hover:text-black'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <span className="text-[#CCCCCC]" aria-hidden="true">|</span>

            <label className="flex items-center gap-2 text-[#404040] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#121212]"
              />
              <span>In Stock Only</span>
            </label>

            <span className="text-[#CCCCCC]" aria-hidden="true">|</span>

            <div className="flex items-center gap-2">
              <span className="text-[#737373]">Max Price:</span>
              <input
                type="range"
                min="500"
                max="8000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 sm:w-32 accent-[#121212]"
              />
              <span className="font-mono font-semibold text-[#121212]">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {(selectedCategory !== 'All' || selectedGender !== 'All' || inStockOnly || searchQuery || maxPrice < 8000) && (
            <button
              onClick={resetAllFilters}
              className="text-[#8C6D44] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid or Clean Empty State */}
        <div className="mt-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Dedicated Empty State with + Add Product CTA */
            <div className="bg-white border border-[#E0D7C6] py-16 px-6 text-center max-w-lg mx-auto my-8 space-y-5 shadow-xs">
              <div className="w-14 h-14 bg-[#FAF8F5] border border-[#DDD3C2] rounded-full flex items-center justify-center mx-auto text-[#8C6D44]">
                <Plus className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#121212] font-heading">
                  {products.length === 0
                    ? "Your Catalogue is Ready for Products"
                    : "No matching garments found"}
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed max-w-sm mx-auto">
                  {products.length === 0
                    ? "All previous products were deleted as requested. Click below to add women's dresses, tops, sets, skirts or accessories."
                    : "Try adjusting your filters or search query to find more items."}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="w-full sm:w-auto bg-[#121212] hover:bg-[#2B2B2B] text-white px-7 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4 text-[#C5A880]" />
                  <span>+ Add Product Now</span>
                </button>

                {products.length > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="w-full sm:w-auto bg-white border border-[#D5CDBD] text-[#121212] px-5 py-3 text-xs font-semibold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
