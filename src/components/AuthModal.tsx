import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, Mail, Lock, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    registerCustomer,
    loginCustomer
  } = useStore();

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Sikar');
  const [regState, setRegState] = useState('Rajasthan');
  const [regPinCode, setRegPinCode] = useState('332001');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setErrorMessage('Please fill in your name, email, and mobile phone.');
      return;
    }

    const res = registerCustomer({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword || 'Sangms@123',
      addressLine: regAddress.trim(),
      city: regCity.trim() || 'Sikar',
      state: regState || 'Rajasthan',
      pinCode: regPinCode.trim() || '332001'
    });

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const res = loginCustomer(loginEmail.trim(), loginPassword);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-md border border-[#E5DECF] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-[#888888] hover:text-black cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center pb-4 border-b border-[#F0EAE1]">
          <span className="text-[10px] uppercase tracking-widest text-[#8E877D] font-bold block">
            TODINAGAR, SIKAR · RAJASTHAN
          </span>
          <h2 className="text-2xl font-bold font-heading text-[#121212] mt-1">
            SANGM'S
          </h2>
          <p className="text-xs text-[#737373] mt-1">
            {authModalMode === 'register'
              ? 'Create your customer account for fast checkout & live order tracking'
              : 'Sign in to access your orders and saved delivery details'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E8E2D5] mt-4 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center ${
              authModalMode === 'register'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'text-[#737373] hover:text-black'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center ${
              authModalMode === 'login'
                ? 'border-b-2 border-[#121212] text-[#121212]'
                : 'text-[#737373] hover:text-black'
            }`}
          >
            Sign In
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMessage}
          </div>
        )}

        {/* REGISTER FORM */}
        {authModalMode === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] pl-9 pr-3 py-2 outline-none focus:border-[#121212]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] pl-9 pr-3 py-2 outline-none focus:border-[#121212] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#262626] mb-1">
                  Mobile Phone (+91) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="98290 12345"
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] pl-9 pr-3 py-2 outline-none focus:border-[#121212] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#262626] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] pl-9 pr-3 py-2 outline-none focus:border-[#121212] font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Delivery Address (Optional for now)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="House / Street, Colony"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] pl-9 pr-3 py-2 outline-none focus:border-[#121212]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-[#262626] mb-1">City</label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-2.5 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#262626] mb-1">State</label>
                <input
                  type="text"
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-2.5 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#262626] mb-1">PIN Code</label>
                <input
                  type="text"
                  value={regPinCode}
                  onChange={(e) => setRegPinCode(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] px-2.5 py-2 outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#121212] hover:bg-[#2B2B2B] text-white py-3 px-4 font-bold uppercase tracking-wider cursor-pointer shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <span>Create SANGM'S Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] pl-9 pr-3 py-2 outline-none focus:border-[#121212] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#262626] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] pl-9 pr-3 py-2 outline-none focus:border-[#121212] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#121212] hover:bg-[#2B2B2B] text-white py-3 px-4 font-bold uppercase tracking-wider cursor-pointer shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-[#737373]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-[#8C6D44] font-semibold underline cursor-pointer"
              >
                Create one now
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
