import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { X, Plus, Sparkles, Image as ImageIcon, Check, Upload, Camera } from 'lucide-react';

interface QuickPreset {
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  gender: 'Women' | 'Ladies' | 'Girls';
  image: string;
  description: string;
  sizes: string;
  colors: string;
}

const PRESETS: QuickPreset[] = [
  {
    name: "Fluid Layered Beige Midi Wrap Dress",
    category: "Women's Dresses",
    price: 3699,
    originalPrice: 4999,
    gender: "Women",
    image: "/src/assets/images/womens_collection_editorial_1794323733103.jpg",
    description: "Crafted from sand-washed Bemberg cupro with an asymmetric draped overlay and custom waist tie.",
    sizes: "XS, S, M, L",
    colors: "Golden Sand:#D7C7B0, Ivory Pebble:#EDE8DF"
  },
  {
    name: "Draped Asymmetrical Silk-Blend Top",
    category: "Tops & Blouses",
    price: 1899,
    originalPrice: 2499,
    gender: "Women",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    description: "Luminous silk-modal bias cut camisole with gold-toned adjustable sliders.",
    sizes: "XS, S, M, L",
    colors: "Champagne Cream:#F3EBDD, Liquid Noir:#141414"
  },
  {
    name: "High-Rise Sculpt Wide-Leg Cream Denim",
    category: "Jeans & Trousers",
    price: 2799,
    originalPrice: 3599,
    gender: "Ladies",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    description: "12oz unbleached organic cotton denim with 11-inch contour high-rise waist.",
    sizes: "26, 28, 30, 32",
    colors: "Natural Ecru:#EDE8DD, Deep Indigo:#1C2740"
  },
  {
    name: "Pastel Lavender Co-Ord Crop & Wide Pant Set",
    category: "Co-ords & Sets",
    price: 3299,
    originalPrice: 4299,
    gender: "Girls",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    description: "Effortless lightweight linen-viscose blend two-piece lounge and daywear set.",
    sizes: "S, M, L",
    colors: "Pastel Lavender:#D8CCE6, Soft Sage:#C9D6C7"
  },
  {
    name: "Handcrafted Vegetable-Tanned Leather Tote",
    category: "Handbags & Accessories",
    price: 2899,
    originalPrice: 3899,
    gender: "Women",
    image: "/src/assets/images/accessories_collection_1794323733805.jpg",
    description: "Full-grain leather tote with brass hardware, laptop divider and artisanal hand-burnished edges.",
    sizes: "Standard",
    colors: "Saddle Tan:#A26A42, Espresso:#2D2018"
  }
];

export const AddProductModal: React.FC = () => {
  const { isAddProductModalOpen, setIsAddProductModalOpen, categories, addProduct, setActivePage } = useStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>("Women's Dresses");
  const [gender, setGender] = useState<'Women' | 'Ladies' | 'Girls'>('Women');
  const [price, setPrice] = useState<number>(2499);
  const [originalPrice, setOriginalPrice] = useState<number>(3299);
  const [stock, setStock] = useState<number>(20);
  const [sizes, setSizes] = useState('XS, S, M, L');
  const [colors, setColors] = useState('Cream:#FAF6EE, Black:#111111');
  const [image, setImage] = useState('/src/assets/images/womens_collection_editorial_1794323733103.jpg');
  const [description, setDescription] = useState('Designed for effortless elegance in Todinagar, Sikar. Tailored using premium breathable fabrics.');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAddProductModalOpen) return null;

  const applyPreset = (preset: QuickPreset) => {
    setName(preset.name);
    setCategory(preset.category);
    setGender(preset.gender);
    setPrice(preset.price);
    setOriginalPrice(preset.originalPrice);
    setImage(preset.image);
    setDescription(preset.description);
    setSizes(preset.sizes);
    setColors(preset.colors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Parse sizes
    const parsedSizes = sizes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Parse colors
    const parsedColors = colors
      .split(',')
      .map(pair => {
        const [cName, cHex] = pair.split(':').map(s => s.trim());
        return { name: cName || 'Standard', hex: cHex || '#111111' };
      })
      .filter(c => c.name);

    const discountVal =
      originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    addProduct({
      name: name.trim(),
      category,
      gender,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent: discountVal,
      description: description.trim(),
      features: ['Tailored for Women, Ladies & Girls', 'Crafted in Sikar, Rajasthan', 'Natural comfortable weave'],
      fabricCare: 'Gentle hand wash in cold water or dry clean. Low iron.',
      image: image.trim(),
      availableSizes: parsedSizes.length > 0 ? parsedSizes : ['Free Size'],
      availableColors: parsedColors.length > 0 ? parsedColors : [{ name: 'Cream', hex: '#FAF6EE' }],
      stock: Number(stock),
      isNewArrival: true,
      isBestSeller: true
    });

    setIsAddProductModalOpen(false);
    setActivePage('catalog');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-2xl border border-[#E5DECF] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#121212] font-heading">
                Add Women's Apparel / Product
              </h2>
              <p className="text-xs text-[#737373]">
                Dedicated to Women, Ladies & Girls Collections · Todinagar Atelier
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddProductModalOpen(false)}
            className="p-1.5 text-[#737373] hover:text-black rounded-full hover:bg-[#F5F2EB] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Presets */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6D44] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Women's Fashion Presets (Optional quick-fill):</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="whitespace-nowrap bg-[#FAF8F5] hover:bg-[#EFEBE1] text-[#121212] border border-[#DDD3C2] px-3 py-1.5 text-[11px] font-medium transition-colors cursor-pointer"
              >
                + {p.name.split(' ').slice(0, 3).join(' ')}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-semibold text-[#262626] mb-1">
              Product Name / Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fluid Layered Beige Midi Wrap Dress"
              className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3.5 py-2.5 outline-none focus:border-[#121212] font-medium text-[#121212]"
            />
          </div>

          {/* Category & Demographic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Women's Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2.5 outline-none font-medium text-[#121212] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Audience / Department *
              </label>
              <div className="flex gap-2">
                {(['Women', 'Ladies', 'Girls'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2 text-xs font-semibold border transition-colors cursor-pointer ${
                      gender === g
                        ? 'bg-[#121212] text-white border-[#121212]'
                        : 'bg-[#FAF8F5] text-[#555555] border-[#D5CDBD] hover:border-black'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#262626] mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#262626] mb-1">MRP / Original (₹)</label>
              <input
                type="number"
                min="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#262626] mb-1">Stock Units *</label>
              <input
                type="number"
                required
                min="1"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
              />
            </div>
          </div>

          {/* Sizes & Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Available Sizes (comma separated)
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="XS, S, M, L, XL"
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Available Colours (Name:Hex)
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="Beige:#D7C7B0, Noir:#111111"
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono"
              />
            </div>
          </div>

          {/* Product Photograph with Device Upload Button */}
          <div>
            <label className="block font-semibold text-[#262626] mb-1.5">
              Product Photograph *
            </label>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Upload Action Area */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#FAF8F5] border border-[#D5CDBD]">
              {/* Image Preview Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-28 sm:w-28 sm:h-32 bg-[#EFEBE1] border border-[#DDD3C2] relative flex items-center justify-center overflow-hidden shrink-0 cursor-pointer group shadow-xs"
                title="Click to change or upload image from device"
              >
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Product preview"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-semibold transition-opacity">
                      Change Photo
                    </div>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#8C8273]" />
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-semibold text-[#121212] block">
                    Upload Photograph from Your Device
                  </span>
                  <p className="text-[11px] text-[#737373] mt-0.5 leading-relaxed">
                    Select a photo directly from your phone gallery, camera, or computer file storage (JPG, PNG, WEBP).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Primary "Upload Image from Device" Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Upload className="w-4 h-4 text-[#C5A880]" />
                    <span>Choose Image from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="bg-white border border-[#D5CDBD] hover:bg-[#FAF8F5] text-[#262626] px-3 py-2 text-xs font-medium cursor-pointer"
                  >
                    {showUrlInput ? 'Hide URL Input' : 'Or Paste Image URL'}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional URL Input if toggled */}
            {showUrlInput && (
              <div className="mt-2 animate-in fade-in">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste direct image link (https://...)"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none font-mono text-[11px]"
                />
              </div>
            )}

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-2 mt-2 text-[11px] text-[#737373] flex-wrap">
              <span className="font-medium text-[#404040]">Sample Presets:</span>
              <button
                type="button"
                onClick={() => setImage('/src/assets/images/womens_collection_editorial_1794323733103.jpg')}
                className="underline text-[#8C6D44] cursor-pointer"
              >
                Editorial Dress
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setImage('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80')}
                className="underline text-[#8C6D44] cursor-pointer"
              >
                Silk Top
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setImage('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80')}
                className="underline text-[#8C6D44] cursor-pointer"
              >
                Girls Co-ord
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setImage('/src/assets/images/accessories_collection_1794323733805.jpg')}
                className="underline text-[#8C6D44] cursor-pointer"
              >
                Leather Handbag
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[#262626] mb-1">
              Description & Craftsmanship Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-3 py-2 outline-none text-[#121212]"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(false)}
              className="px-5 py-2.5 border border-[#D5CDBD] text-[#555555] hover:text-black font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-7 py-2.5 font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Women's Store</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
