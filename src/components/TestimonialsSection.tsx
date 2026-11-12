import React from 'react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';

interface Testimonial {
  name: string;
  location: string;
  role: string;
  quote: string;
  productBought: string;
  rating: number;
}

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Pooja Kashyap',
    location: 'Jaipur, Rajasthan',
    role: 'Creative Director',
    quote: 'The sand-washed beige wrap dress draped like water straight out of the box. Arrived within 24 hours from the Sikar hub. SANGM’S is redefining contemporary Indian luxury minimalism for women.',
    productBought: 'Fluid Layered Beige Midi Wrap Dress',
    rating: 5
  },
  {
    name: 'Ananya Shekhawat',
    location: 'Sikar, Rajasthan',
    role: 'Fashion Stylist',
    quote: 'The cut of their silk-blend tops and tailored trousers is immaculate. Breathable fabrics that hold their shape through long days in Rajasthan. I love having an atelier in Todinagar.',
    productBought: 'Draped Asymmetrical Silk Top',
    rating: 5
  },
  {
    name: 'Rhea Sen',
    location: 'South Delhi, New Delhi',
    role: 'College Student & Creator',
    quote: 'The pastel co-ord set is my absolute staple. Super comfortable, chic aesthetic, and the packaging felt like unboxing a bespoke luxury parcel. Zero hassle Cash on Delivery.',
    productBought: 'Pastel Lavender Co-Ord Set',
    rating: 5
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8E877D] font-semibold mb-2">
              <span>CUSTOMER EXPERIENCES</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-[#C5A880]">
                <Sparkles className="w-3 h-3" />
                Sample Customer Reviews
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121212] font-heading tracking-tight">
              Endorsed by Wearers Across India
            </h2>
          </div>
          <p className="text-xs text-[#737373] max-w-sm">
            Honest feedback from patrons who value heavyweight textiles, natural dyes, and tailored comfort.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SAMPLE_TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5DECF] p-7 flex flex-col justify-between shadow-xs hover:border-[#D5CDBD] transition-all"
            >
              <div className="space-y-4">
                {/* Rating & Sample Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-[#8C6D44] bg-[#FAF6EE] px-2 py-0.5 border border-[#E8DEC8]">
                    Verified Buyer
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs text-[#2B2B2B] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-5 border-t border-[#F0EAE1] mt-6 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-[#121212] font-heading">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-[#737373]">
                    {t.role} · {t.location}
                  </div>
                  <div className="text-[10px] text-[#8C6D44] font-medium mt-1">
                    Purchased: {t.productBought}
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
