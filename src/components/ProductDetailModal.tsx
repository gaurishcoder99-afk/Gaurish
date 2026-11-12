import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, Check, Ruler, MapPin } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, toggleWishlist, isInWishlist } = useStore();

  if (!selectedProduct) return null;

  const [selectedSize, setSelectedSize] = useState<string>(selectedProduct.availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(selectedProduct.availableColors[0] || { name: 'Standard', hex: '#111111' });
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(selectedProduct.id);

  const handleAddToCart = () => {
    if (selectedProduct.stock === 0) return;
    setIsAdded(true);
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FAF8F5] w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-[#E0D7C6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#121212] transition-colors shadow-sm cursor-pointer"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Product Gallery */}
          <div className="bg-[#EFEBE1] p-6 sm:p-10 flex flex-col justify-center items-center relative min-h-[380px] md:min-h-[500px]">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full max-h-[460px] object-cover object-center shadow-md border border-[#E5DECF]"
              referrerPolicy="no-referrer"
            />
            {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 && (
              <div className="absolute top-6 left-6 bg-[#121212] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                {selectedProduct.discountPercent}% Discount
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Category & Origin */}
              <div className="flex items-center justify-between text-xs text-[#737373] uppercase tracking-wider">
                <span>{selectedProduct.category} · {selectedProduct.gender}</span>
                <span className="flex items-center gap-1 text-[#8C6D44] font-medium">
                  <MapPin className="w-3 h-3" /> Sikar Hub
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121212] font-heading leading-tight">
                {selectedProduct.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(selectedProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-[#D0C8B8]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-[#121212] font-mono">{selectedProduct.rating.toFixed(1)}</span>
                <span className="text-[#888888]">({selectedProduct.reviewCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1 border-b border-[#ECE5D8] pb-4">
                <span className="text-3xl font-bold text-[#121212] font-mono tabular-nums">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-base text-[#8E877D] line-through font-mono tabular-nums">
                    ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {selectedProduct.discountPercent && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Save ₹{(selectedProduct.originalPrice! - selectedProduct.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-[#262626] mb-2">
                  <span>Colour: <strong className="font-semibold text-black">{selectedColor.name}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProduct.availableColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                        selectedColor.name === color.name ? 'ring-2 ring-[#121212] ring-offset-2' : 'border-[#CCCCCC]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={color.name}
                    >
                      {selectedColor.name === color.name && (
                        <Check className={`w-3.5 h-3.5 ${color.hex === '#FFFFFF' || color.hex === '#F7F5F0' || color.hex === '#FAF6EE' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-[#262626] mb-2">
                  <span>Size: <strong className="font-semibold text-black">{selectedSize}</strong></span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="flex items-center gap-1 text-[#8C6D44] hover:underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedProduct.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 py-2 px-3 text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#121212] text-white border-[#121212]'
                          : 'bg-white text-[#262626] border-[#D6CEC0] hover:border-[#121212]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Size Guide Info Dropdown */}
                {showSizeGuide && (
                  <div className="mt-3 p-3 bg-white border border-[#DDD3C2] text-xs text-[#525252] space-y-1">
                    <p className="font-semibold text-[#171717]">SANGM'S Women's Tailored Fit Guide (in inches):</p>
                    <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                      <div>XS: Bust 32, Waist 25, Hip 35</div>
                      <div>S: Bust 34, Waist 27, Hip 37</div>
                      <div>M: Bust 36, Waist 29, Hip 39</div>
                      <div>L: Bust 38, Waist 31, Hip 41</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Status & Quantity */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#737373]">Stock Availability:</span>
                  {selectedProduct.stock > 0 ? (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      {selectedProduct.stock} Units in Todinagar Stock
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-200">
                      Sold Out
                    </span>
                  )}
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#D5CDBD] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || selectedProduct.stock === 0}
                    className="px-3 py-1.5 text-sm font-semibold hover:bg-[#F2ECE1] disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-mono font-bold min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    disabled={quantity >= selectedProduct.stock || selectedProduct.stock === 0}
                    className="px-3 py-1.5 text-sm font-semibold hover:bg-[#F2ECE1] disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedProduct.stock === 0}
                  className={`flex-1 py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    selectedProduct.stock === 0
                      ? 'bg-[#E0DAD0] text-[#8E877D] cursor-not-allowed'
                      : isAdded
                      ? 'bg-[#2E7D32] text-white'
                      : 'bg-[#121212] text-white hover:bg-[#2B2B2B] active:scale-98'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag (₹{(selectedProduct.price * quantity).toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-3.5 border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-[#D5CDBD] bg-white text-[#262626] hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-[#E8E2D5] pt-4 space-y-3">
              <div className="flex border-b border-[#E8E2D5] text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 mr-6 transition-colors cursor-pointer ${
                    activeTab === 'details' ? 'border-b-2 border-[#121212] text-[#121212]' : 'text-[#737373]'
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-2 mr-6 transition-colors cursor-pointer ${
                    activeTab === 'care' ? 'border-b-2 border-[#121212] text-[#121212]' : 'text-[#737373]'
                  }`}
                >
                  Fabric & Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'shipping' ? 'border-b-2 border-[#121212] text-[#121212]' : 'text-[#737373]'
                  }`}
                >
                  Delivery from Sikar
                </button>
              </div>

              <div className="text-xs text-[#525252] leading-relaxed min-h-[70px]">
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p>{selectedProduct.description}</p>
                    <ul className="list-disc list-inside space-y-1 text-[#404040]">
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-2">
                    <p className="font-medium text-[#121212]">Garment Care Protocol:</p>
                    <p>{selectedProduct.fabricCare || "Machine wash gentle in cold water. Iron on reverse. Air dry in shade to maintain fiber integrity."}</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5 font-medium text-[#121212]">
                      <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                      Direct Dispatch from Todinagar, Sikar Warehouse
                    </p>
                    <p>Free express delivery across Rajasthan in 24–48 hours; all other Indian metro cities in 3–4 days. Cash on Delivery (COD) accepted with zero advance surcharge.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
