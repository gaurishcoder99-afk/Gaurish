import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    shippingFee,
    appliedCoupon,
    couponDiscount,
    cartTotal,
    applyCoupon,
    removeCoupon,
    setActivePage
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const amountNeededForFreeShipping = Math.max(0, 999 - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / 999) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E2DAD0] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E8E2D5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#121212]" />
              <h2 className="text-lg font-bold text-[#121212] font-heading">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-[#555555] hover:text-black rounded-full hover:bg-[#F2ECE1] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#F4EFE6] px-5 py-3 border-b border-[#E5DECF] text-xs">
            <div className="flex items-center justify-between font-medium text-[#404040] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                {shippingFee === 0 || appliedCoupon === 'SIKARFREE' ? (
                  <span className="text-emerald-700 font-semibold">Unlocked Free Express Delivery across India!</span>
                ) : (
                  <span>Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for Free Delivery</span>
                )}
              </span>
            </div>
            <div className="w-full bg-[#E0D7C6] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#121212] h-full transition-all duration-300"
                style={{ width: `${appliedCoupon === 'SIKARFREE' ? 100 : freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EFEBE1] text-[#8C8273] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#121212] font-heading">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-[#737373] max-w-xs mx-auto">
                  Explore our luxury linen, Supima cotton, and selvedge denim collection crafted in Sikar.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActivePage('catalog');
                  }}
                  className="mt-3 inline-block bg-[#121212] text-white text-xs font-semibold px-5 py-2.5 tracking-wider uppercase cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${idx}`}
                  className="flex gap-4 p-3 bg-white border border-[#EBE5D9] shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-22 object-cover object-center bg-[#F2ECE1] border border-[#E5DECF] shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-[#171717] line-clamp-1 pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor.name)}
                          className="text-[#999999] hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#737373] mt-1">
                        <span>Size: <strong className="text-black font-mono">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F2EB]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DDD3C2] bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.name, -1)}
                          className="px-2 py-0.5 text-xs font-bold hover:bg-[#EFEBE1] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono font-bold min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.name, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-0.5 text-xs font-bold hover:bg-[#EFEBE1] disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-bold text-[#121212] font-mono tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#E8E2D5] space-y-4 shadow-lg">
              
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      Coupon <strong>{appliedCoupon}</strong> Applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:underline font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code (e.g. FIRST10)"
                        className="flex-1 bg-[#FDFBF7] border border-[#D5CDBD] text-xs px-3 py-2 outline-none uppercase font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-[#121212] hover:bg-[#2B2B2B] text-white text-xs font-semibold px-4 py-2 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                    <div className="text-[10px] text-[#888888]">
                      Try: <strong>FIRST10</strong> (10% off) or <strong>SIKARFREE</strong> (Free shipping)
                    </div>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-[#F2ECE1] pt-3">
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#121212]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span className="font-mono tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#666666]">
                  <span>Express Shipping</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold uppercase text-[11px]">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-[#E8E2D5] text-sm font-bold text-[#121212]">
                  <span>Total Amount</span>
                  <span className="text-base font-mono tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[10px] text-[#888888] text-right">
                  Includes applicable GST & taxes
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#121212] hover:bg-[#2B2B2B] text-white py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
