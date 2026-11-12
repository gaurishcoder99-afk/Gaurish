import React, { useState } from 'react';
import { Mail, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    setIsSubscribed(true);
    showToast('Subscribed! Use code FIRST10 for 10% off your order.');
  };

  return (
    <section className="py-16 sm:py-20 bg-[#171717] text-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#D4C3A3] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>SANGM'S INNER CIRCLE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight max-w-xl mx-auto">
          Private Drops & Archival Releases
        </h2>

        <p className="text-xs sm:text-sm text-[#CCCCCC] max-w-lg mx-auto leading-relaxed">
          Receive notification of seasonal drops, European linen shipments, and limited-edition selvedge cuts. Enjoy <strong>10% off</strong> your inaugural order.
        </p>

        {isSubscribed ? (
          <div className="bg-[#242424] border border-[#3E3E3E] p-5 max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-xs">
              <Check className="w-4 h-4" />
              <span>You're on the SANGM'S Guest List!</span>
            </div>
            <p className="text-xs text-[#CCCCCC]">
              Apply promo code <strong className="text-white font-mono bg-[#111111] px-2 py-0.5 border border-[#444444]">FIRST10</strong> at checkout for 10% off.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <label htmlFor="newsletter-email" className="sr-only">Your Email Address</label>
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-[#262626] border border-[#3D3D3D] text-xs text-white pl-10 pr-4 py-3 outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-[#FAF8F5] hover:bg-[#E8DEC8] text-[#121212] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="text-[11px] text-[#777777]">
          Zero spam. Unsubscribe anytime with 1 click. Dispatched from Todinagar, Sikar.
        </div>

      </div>
    </section>
  );
};
