import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Search, Heart, Shield, Menu, X, Plus, Download, User, LogOut } from 'lucide-react';
import { ProductCategory } from '../types';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    setSelectedCategory,
    cartCount,
    setIsCartDrawerOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    setIsAddProductModalOpen,
    setShowNetlifyGuide,
    setShowInstallModal,
    currentUser,
    logoutCustomer,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleNavCategory = (cat: ProductCategory | 'All') => {
    setSelectedCategory(cat);
    setActivePage('catalog');
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#171717] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#2B2B2B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium flex-wrap justify-center sm:justify-start">
            <span className="tracking-widest text-[#D4C3A3]">SANGM'S WOMEN'S BOUTIQUE</span>
            <span className="text-[#888888]" aria-hidden="true">·</span>
            <a href="tel:+919799896438" className="hover:text-white transition-colors underline">
              +91 97998 96438
            </a>
            <span className="text-[#888888]" aria-hidden="true">·</span>
            <a href="mailto:homelander69.brrbrrpatapim@gmail.com" className="hover:text-white transition-colors underline hidden md:inline">
              homelander69.brrbrrpatapim@gmail.com
            </a>
            <span className="text-[#888888] hidden md:inline" aria-hidden="true">·</span>
            <span>Todinagar, Sikar</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#CCCCCC]">
            {/* Customer Account Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 text-[#E8DEC8] hover:text-white font-semibold cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Hi, {currentUser.fullName.split(' ')[0]}</span>
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-[#171717] shadow-xl border border-[#E5DECF] py-2 z-50 animate-in fade-in duration-100">
                    <div className="px-3 py-1.5 border-b border-[#F0EAE1] text-[11px]">
                      <div className="font-bold text-[#121212] truncate">{currentUser.fullName}</div>
                      <div className="text-[#737373] truncate font-mono">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        logoutCustomer();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <span className="text-[#555555]">/</span>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-[#C5A880] hover:text-white font-semibold cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            <span className="text-[#555555]" aria-hidden="true">|</span>

            {/* Install App Link */}
            <button
              onClick={() => setShowInstallModal(true)}
              className="flex items-center gap-1 text-[#C5A880] hover:text-white font-semibold cursor-pointer"
              title="Install SANGM'S app on this device"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>

            <span className="text-[#555555]" aria-hidden="true">|</span>

            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center gap-1 text-[#E8DEC8] hover:text-white font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Product</span>
            </button>

            <span className="text-[#555555]" aria-hidden="true">|</span>

            <button
              onClick={() => {
                setActivePage('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Brand Logo / Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActivePage('home');
                setSelectedCategory('All');
              }}
              className="text-2xl sm:text-3xl font-extrabold tracking-widest text-[#121212] font-heading whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
            >
              SANGM'S
            </button>
          </div>

          {/* Navigation Links for Women, Ladies & Girls */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#404040]">
            <button
              onClick={() => {
                setActivePage('home');
                setSelectedCategory('All');
              }}
              className={`whitespace-nowrap transition-colors cursor-pointer hover:text-[#121212] ${
                activePage === 'home' ? 'text-[#121212] font-semibold border-b-2 border-[#121212] pb-0.5' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavCategory('All')}
              className={`whitespace-nowrap transition-colors cursor-pointer hover:text-[#121212] ${
                activePage === 'catalog' ? 'text-[#121212] font-semibold border-b-2 border-[#121212] pb-0.5' : ''
              }`}
            >
              All Women's Wear
            </button>
            <button
              onClick={() => handleNavCategory("Women's Dresses")}
              className="whitespace-nowrap transition-colors cursor-pointer hover:text-[#121212]"
            >
              Dresses & Gowns
            </button>
            <button
              onClick={() => handleNavCategory("Tops & Blouses")}
              className="whitespace-nowrap transition-colors cursor-pointer hover:text-[#121212]"
            >
              Tops & Blouses
            </button>
            <button
              onClick={() => handleNavCategory("Co-ords & Sets")}
              className="whitespace-nowrap transition-colors cursor-pointer hover:text-[#121212]"
            >
              Co-ords & Sets
            </button>
            <button
              onClick={() => handleNavCategory("Handbags & Accessories")}
              className="whitespace-nowrap transition-colors cursor-pointer hover:text-[#121212]"
            >
              Handbags
            </button>
          </nav>

          {/* Interactive Zone */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            
            {/* Install App Button */}
            <button
              onClick={() => setShowInstallModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#121212] hover:bg-[#2B2B2B] text-white text-xs font-semibold px-3 py-2 transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95"
              title="Install SANGM'S on this device"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Install App</span>
            </button>

            {/* Quick "+ Add Product" button in header */}
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#EFEBE1] text-[#121212] border border-[#D5CDBD] text-xs font-semibold px-3 py-2 transition-colors cursor-pointer whitespace-nowrap"
              title="Add a new women's product to store"
            >
              <Plus className="w-3.5 h-3.5 text-[#8C6D44]" />
              <span>Add Product</span>
            </button>

            {/* Search Input / Toggle */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-white border border-[#D5CDBD] rounded-md px-3 py-1.5 shadow-sm">
                  <Search className="w-4 h-4 text-[#737373] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setActivePage('catalog');
                      }
                    }}
                    placeholder="Search dresses, tops, sets..."
                    className="w-32 sm:w-48 text-xs bg-transparent outline-none text-[#171717]"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="text-[#888888] hover:text-[#171717] ml-1"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-[#404040] hover:text-[#121212] transition-colors cursor-pointer"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Account Icon Button */}
            <button
              onClick={() => {
                if (currentUser) {
                  setShowUserDropdown(!showUserDropdown);
                } else {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }
              }}
              className="p-2 text-[#404040] hover:text-[#121212] transition-colors cursor-pointer relative"
              aria-label="Customer Account"
              title={currentUser ? `Account: ${currentUser.fullName}` : 'Register or Sign In'}
            >
              <User className={`w-5 h-5 ${currentUser ? 'text-black' : ''}`} />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            {/* Wishlist indicator */}
            <button
              onClick={() => {
                setActivePage('catalog');
              }}
              className="relative p-2 text-[#404040] hover:text-[#121212] transition-colors cursor-pointer hidden md:block"
              aria-label="Wishlist"
              title={`${wishlist.length} saved items`}
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#121212] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button (Primary Action) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-[#FAF8F5] hover:bg-[#EFEBE1] text-[#121212] border border-[#D5CDBD] text-xs font-semibold px-3 py-2 transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-5 h-5 bg-[#121212] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#262626] hover:text-black cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-b border-[#E8E2D5] px-6 py-5 space-y-4 shadow-lg animate-in fade-in duration-150">
            {/* User Account Mobile Section */}
            <div className="p-3 bg-white border border-[#E5DECF] flex items-center justify-between">
              {currentUser ? (
                <div>
                  <div className="text-xs font-bold text-[#121212]">{currentUser.fullName}</div>
                  <div className="text-[11px] text-[#737373]">{currentUser.email}</div>
                  <button
                    onClick={() => {
                      logoutCustomer();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-600 text-[11px] font-semibold mt-1 cursor-pointer underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full justify-between">
                  <span className="text-xs text-[#737373]">New Customer?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 border border-[#D5CDBD] bg-[#FAF8F5]"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalMode('register');
                        setIsAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs font-bold px-3 py-1.5 bg-[#121212] text-white"
                    >
                      Register
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 font-medium text-sm text-[#262626]">
              {/* Install on Device CTA */}
              <button
                onClick={() => {
                  setShowInstallModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#121212] text-white py-3 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-[#C5A880]" />
                <span>Install SANGM'S on this Device</span>
              </button>

              <button
                onClick={() => {
                  setIsAddProductModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#FAF8F5] border border-[#DDD3C2] text-[#121212] py-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#8C6D44]" />
                <span>+ Add New Product</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('home');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-black border-b border-[#F0EAE1]"
              >
                Home
              </button>
              <button
                onClick={() => handleNavCategory('All')}
                className="block w-full text-left py-2 hover:text-black border-b border-[#F0EAE1]"
              >
                Complete Women's Catalogue
              </button>
              <button
                onClick={() => handleNavCategory("Women's Dresses")}
                className="block w-full text-left py-2 hover:text-black border-b border-[#F0EAE1]"
              >
                Dresses & Gowns
              </button>
              <button
                onClick={() => handleNavCategory("Tops & Blouses")}
                className="block w-full text-left py-2 hover:text-black border-b border-[#F0EAE1]"
              >
                Tops & Blouses
              </button>
              <button
                onClick={() => handleNavCategory("Co-ords & Sets")}
                className="block w-full text-left py-2 hover:text-black border-b border-[#F0EAE1]"
              >
                Co-ords & Sets
              </button>
              <button
                onClick={() => handleNavCategory("Handbags & Accessories")}
                className="block w-full text-left py-2 hover:text-black border-b border-[#F0EAE1]"
              >
                Handbags & Accessories
              </button>

              <button
                onClick={() => {
                  setActivePage('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full text-left py-2.5 text-[#171717] font-semibold bg-[#F5F2EB] px-3 mt-2"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C5A880]" />
                  <span>Admin Portal</span>
                </span>
                <span className="text-xs text-[#8C6D44]">Management</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
