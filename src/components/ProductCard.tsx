import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.availableColors[0] || { name: 'Standard', hex: '#111111' });
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    setIsQuickAdding(true);
    addToCart(product, selectedSize, selectedColor, 1);
    setTimeout(() => setIsQuickAdding(false), 900);
  };

  const getStockBadge = () => {
    if (product.stock === 0) {
      return <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-200">Out of Stock</span>;
    }
    if (product.stock < 10) {
      return <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">Only {product.stock} left</span>;
    }
    return <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">In Stock</span>;
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white border border-[#EBE5D9] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#D5CDBD] cursor-pointer"
    >
      {/* Visual Slot */}
      <div className="relative aspect-[4/5] bg-[#F5F2EB] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-[#121212] text-white text-[11px] font-bold px-2 py-0.5 tracking-wider uppercase">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C5A880] text-[#121212] text-[10px] font-bold px-2 py-0.5 tracking-widest uppercase">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#262626] hover:text-red-500 transition-colors shadow-sm cursor-pointer"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        <div className={`absolute inset-x-3 bottom-3 z-10 transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="w-full bg-[#FAF8F5]/95 hover:bg-white text-[#121212] text-xs font-semibold py-2.5 flex items-center justify-center gap-2 shadow-sm border border-[#D5CDBD]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Inspect Details</span>
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          {/* Category & Stock Tag */}
          <div className="flex items-center justify-between gap-2 text-xs text-[#737373] mb-1">
            <span className="uppercase tracking-wider text-[11px] font-medium">{product.category}</span>
            {getStockBadge()}
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-semibold text-[#171717] font-heading group-hover:text-[#8C6D44] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Price with Tabular Numerals */}
          <div className="flex items-baseline gap-2 mt-1.5 font-medium">
            <span className="text-base font-bold text-[#121212] font-mono tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#8E877D] line-through font-mono tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Colors & Sizes interactive selectors */}
        <div className="space-y-2 pt-2 border-t border-[#F2ECE1]">
          {/* Colors swatch */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#737373] mr-1">Colour:</span>
            {product.availableColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  selectedColor.name === color.name ? 'ring-2 ring-[#121212] ring-offset-1 scale-110' : 'border-[#CCCCCC]'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>

          {/* Size picker chips */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] text-[#737373] mr-1">Size:</span>
            {product.availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`text-[10px] px-2 py-0.5 border font-mono transition-colors cursor-pointer ${
                  selectedSize === size
                    ? 'bg-[#171717] text-white border-[#171717] font-bold'
                    : 'bg-[#F9F7F2] text-[#404040] border-[#E5DECF] hover:border-[#171717]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
          className={`w-full mt-2 py-2.5 px-3 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            product.stock === 0
              ? 'bg-[#E5E0D8] text-[#8E877D] cursor-not-allowed'
              : isQuickAdding
              ? 'bg-[#2E7D32] text-white'
              : 'bg-[#171717] text-white hover:bg-[#2B2B2B] active:scale-98'
          }`}
        >
          {isQuickAdding ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Bag</span>
            </>
          ) : product.stock === 0 ? (
            <span>Sold Out</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
