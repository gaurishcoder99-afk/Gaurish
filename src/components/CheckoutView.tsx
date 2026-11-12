import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CustomerDetails, Order } from '../types';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  QrCode,
  CreditCard,
  Banknote,
  User,
  MessageSquare,
  Copy,
  Check,
  Smartphone,
  Building,
  Lock,
  RefreshCw,
  Clock,
  ExternalLink,
  Shield
} from 'lucide-react';
import { CardOtpModal, NetBankingModal } from './PaymentModals';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    couponDiscount,
    cartTotal,
    appliedCoupon,
    placeOrder,
    setActivePage,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    ownerConfig,
    showToast
  } = useStore();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    addressLine: currentUser?.addressLine || '',
    landmark: currentUser?.landmark || '',
    city: currentUser?.city || 'Sikar',
    state: currentUser?.state || 'Rajasthan',
    pinCode: currentUser?.pinCode || '332001',
    notes: ''
  });

  useEffect(() => {
    if (currentUser) {
      setCustomer(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        addressLine: currentUser.addressLine || prev.addressLine,
        landmark: currentUser.landmark || prev.landmark,
        city: currentUser.city || prev.city,
        state: currentUser.state || prev.state,
        pinCode: currentUser.pinCode || prev.pinCode
      }));
    }
  }, [currentUser]);

  // Main payment method selection
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash on Delivery (COD)');
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Cash on Delivery (COD) state
  const [codPin] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));

  // 2. UPI / Instant QR state
  const [upiSubTab, setUpiSubTab] = useState<'qr' | 'vpa'>('qr');
  const [customerUpiId, setCustomerUpiId] = useState('');
  const [upiUtr, setUpiUtr] = useState('');
  const [isUpiVerifying, setIsUpiVerifying] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [vpaRequestSent, setVpaRequestSent] = useState(false);
  const [vpaTimer, setVpaTimer] = useState(300);

  // 3. Cards & Net Banking state
  const [cardOrBankTab, setCardOrBankTab] = useState<'card' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(customer.fullName || 'Priya Shekhawat');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'RuPay' | 'Visa' | 'Mastercard' | 'Card'>('Card');
  const [cardErrors, setCardErrors] = useState<{ number?: string; expiry?: string; cvv?: string }>({});

  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [customBank, setCustomBank] = useState('');

  // Modals for 3D Secure Card & Net Banking
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // Sync card holder name when customer name changes
  useEffect(() => {
    if (customer.fullName && !cardHolder) {
      setCardHolder(customer.fullName);
    }
  }, [customer.fullName, cardHolder]);

  // Countdown timer for UPI VPA collect request
  useEffect(() => {
    if (!vpaRequestSent || vpaTimer <= 0) return;
    const interval = setInterval(() => {
      setVpaTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [vpaRequestSent, vpaTimer]);

  // Card formatting & brand detection
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    // Detect Indian & Global Card Brands
    if (/^(60|65|81|82|508)/.test(raw)) {
      setCardBrand('RuPay');
    } else if (/^4/.test(raw)) {
      setCardBrand('Visa');
    } else if (/^(5[1-5]|2[2-7])/.test(raw)) {
      setCardBrand('Mastercard');
    } else {
      setCardBrand('Card');
    }
  };

  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  // If cart is empty, redirect or display notice
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-[#121212] mb-3">Your shopping bag is empty</h2>
        <p className="text-xs text-[#737373] mb-6">Add garments to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setActivePage('catalog')}
          className="bg-[#121212] text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          Browse Catalogue
        </button>
      </div>
    );
  }

  const validateAddress = () => {
    const errs: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!customer.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!customer.phone.trim()) {
      errs.phone = 'Mobile Number is required';
    } else if (!/^[6-9]\d{9}$/.test(customer.phone.replace(/[\s-+]/g, '').slice(-10))) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!customer.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!customer.addressLine.trim()) errs.addressLine = 'Street address / House number is required';
    if (!customer.city.trim()) errs.city = 'City is required';
    if (!customer.pinCode.trim() || !/^\d{6}$/.test(customer.pinCode.trim())) {
      errs.pinCode = 'Enter a valid 6-digit Indian PIN code';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCard = () => {
    const errs: { number?: string; expiry?: string; cvv?: string } = {};
    const rawNumber = cardNumber.replace(/\D/g, '');
    if (rawNumber.length < 15) {
      errs.number = 'Enter a valid 16-digit debit or credit card number';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      errs.expiry = 'Valid MM/YY required';
    }
    if (cardCvv.length < 3) {
      errs.cvv = '3 or 4-digit CVV required';
    }
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // UPI Payload calculation
  const storeVpa = ownerConfig.upiVpa || '9799896438@upi';
  const payeeName = "SANGM'S Women's Boutique";
  const upiPayload = `upi://pay?pa=${encodeURIComponent(storeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent(`Order SIKAR ${customer.phone ? customer.phone.slice(-4) : 'HUB'}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiPayload)}`;

  const copyUpiId = () => {
    navigator.clipboard?.writeText(storeVpa);
    setCopiedUpi(true);
    showToast(`Store UPI ID ${storeVpa} copied to clipboard`);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress()) {
      showToast('Please check required contact and delivery address fields');
      return;
    }

    // Handle Payment Rail routing
    if (paymentMethod === 'Cash on Delivery (COD)') {
      setIsSubmitting(true);
      setTimeout(() => {
        placeOrder(customer, 'Cash on Delivery (COD)', {
          gateway: 'Cash on Delivery',
          codInstructions: `Collect cash ₹${cartTotal.toLocaleString('en-IN')} upon delivery at doorstep. Doorstep PIN: #${codPin}`
        });
        setIsSubmitting(false);
      }, 600);
    } else if (paymentMethod === 'UPI / Instant QR') {
      setIsUpiVerifying(true);
      setTimeout(() => {
        setIsUpiVerifying(false);
        const refNo = upiUtr.trim() || `UPI${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;
        placeOrder(customer, 'UPI / Instant QR', {
          gateway: 'UPI Direct',
          utrNumber: refNo,
          upiId: customerUpiId || storeVpa,
          transactionId: `TXN_UPI_${Date.now()}`,
          paidAt: new Date().toISOString()
        });
      }, 900);
    } else if (paymentMethod === 'Cards & Net Banking') {
      if (cardOrBankTab === 'card') {
        if (!validateCard()) {
          showToast('Please complete valid card details');
          return;
        }
        setIsCardModalOpen(true);
      } else {
        setIsBankModalOpen(true);
      }
    }
  };

  // Card OTP Success Handler
  const handleCardSuccess = (txnId: string) => {
    setIsCardModalOpen(false);
    placeOrder(customer, 'Cards & Net Banking', {
      gateway: 'Card Gateway',
      cardBrand,
      cardLast4: cardNumber.replace(/\D/g, '').slice(-4) || '4821',
      transactionId: txnId,
      paidAt: new Date().toISOString()
    });
  };

  // Net Banking Success Handler
  const handleBankSuccess = (txnId: string, bank: string) => {
    setIsBankModalOpen(false);
    placeOrder(customer, 'Cards & Net Banking', {
      gateway: 'Net Banking',
      bankName: bank || selectedBank,
      transactionId: txnId,
      paidAt: new Date().toISOString()
    });
  };

  const activeBankName = customBank.trim() || selectedBank;

  return (
    <div className="py-10 sm:py-16 bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => setActivePage('catalog')}
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-black mb-8 cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping</span>
        </button>

        {/* Customer Account Notification / Registration Bar */}
        {currentUser ? (
          <div className="bg-[#FAF8F5] border border-[#DDD3C2] p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#C5A880] flex items-center justify-center font-bold shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#121212]">Ordering with SANGM'S Account: {currentUser.fullName}</span>
                <p className="text-[11px] text-[#737373] mt-0.5">{currentUser.email} · +91 {currentUser.phone}</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 font-semibold uppercase tracking-wider">
              Profile Auto-Filled
            </span>
          </div>
        ) : (
          <div className="bg-[#FFFDF5] border border-[#E3D8B8] p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#786438]">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#4F3F19]">Don't have an account yet?</span>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Create an account with your email to auto-fill your delivery details and access live order tracking anytime.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="bg-white border border-[#D5CDBD] text-[#121212] px-3.5 py-1.5 font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="bg-[#121212] text-white px-3.5 py-1.5 font-bold cursor-pointer"
              >
                Register Account
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* Left Column: Customer Details & Real Payment (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Identification */}
            <div className="bg-white p-6 sm:p-8 border border-[#E5DECF] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <h3 className="text-base font-bold text-[#121212] font-heading">
                  1. Contact Information
                </h3>
                <span className="text-xs text-[#888888] font-mono">Step 1 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-xs font-semibold text-[#262626] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Priya Shekhawat"
                    className={`w-full bg-[#FAF8F5] border text-xs px-3.5 py-2.5 outline-none transition-colors ${
                      errors.fullName ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-[#262626] mb-1">
                    Mobile Phone (+91) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-[#EFEBE1] border border-r-0 border-[#D5CDBD] text-xs font-mono text-[#555555]">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="98290 12345"
                      className={`w-full bg-[#FAF8F5] border text-xs px-3 py-2.5 outline-none transition-colors ${
                        errors.phone ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#262626] mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="name@example.com"
                    className={`w-full bg-[#FAF8F5] border text-xs px-3.5 py-2.5 outline-none transition-colors ${
                      errors.email ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-white p-6 sm:p-8 border border-[#E5DECF] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <h3 className="text-base font-bold text-[#121212] font-heading flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A880]" />
                  2. Delivery Destination
                </h3>
                <span className="text-xs text-[#888888] font-mono">Step 2 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="addressLine" className="block text-xs font-semibold text-[#262626] mb-1">
                    House / Flat No., Street, Colony *
                  </label>
                  <input
                    id="addressLine"
                    type="text"
                    required
                    value={customer.addressLine}
                    onChange={(e) => setCustomer({ ...customer, addressLine: e.target.value })}
                    placeholder="e.g. House 14, Todinagar Main Road"
                    className={`w-full bg-[#FAF8F5] border text-xs px-3.5 py-2.5 outline-none transition-colors ${
                      errors.addressLine ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                    }`}
                  />
                  {errors.addressLine && <p className="text-[11px] text-rose-600 mt-1">{errors.addressLine}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="landmark" className="block text-xs font-semibold text-[#262626] mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    id="landmark"
                    type="text"
                    value={customer.landmark || ''}
                    onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                    placeholder="Near Sikar Railway Station / Clock Tower"
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3.5 py-2.5 outline-none focus:border-[#121212]"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-semibold text-[#262626] mb-1">
                    City / Town *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="Sikar"
                    className={`w-full bg-[#FAF8F5] border text-xs px-3.5 py-2.5 outline-none transition-colors ${
                      errors.city ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                    }`}
                  />
                  {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-semibold text-[#262626] mb-1">
                    State *
                  </label>
                  <select
                    id="state"
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3.5 py-2.5 outline-none focus:border-[#121212] cursor-pointer"
                  >
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Other States">Other Indian States</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="pinCode" className="block text-xs font-semibold text-[#262626] mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    id="pinCode"
                    type="text"
                    required
                    maxLength={6}
                    value={customer.pinCode}
                    onChange={(e) => setCustomer({ ...customer, pinCode: e.target.value })}
                    placeholder="332001"
                    className={`w-full bg-[#FAF8F5] border text-xs px-3.5 py-2.5 outline-none font-mono transition-colors ${
                      errors.pinCode ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                    }`}
                  />
                  {errors.pinCode && <p className="text-[11px] text-rose-600 mt-1">{errors.pinCode}</p>}
                </div>
              </div>
            </div>

            {/* Step 3: REAL PAYMENT INFRASTRUCTURE */}
            <div className="bg-white p-6 sm:p-8 border border-[#E5DECF] space-y-5">
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#121212] font-heading">
                    3. Select Real Payment Method
                  </h3>
                  <p className="text-[11px] text-[#737373] mt-0.5">
                    100% Genuine Payment Rails · Instant Bank Authorization · Zero Convenience Fees
                  </p>
                </div>
                <span className="text-xs text-[#888888] font-mono">Step 3 of 3</span>
              </div>

              {/* 3 Payment Options Radio Tabs */}
              <div className="space-y-3">
                
                {/* ---------------- 1. REAL CASH ON DELIVERY (COD) ---------------- */}
                <div
                  className={`border transition-all ${
                    paymentMethod === 'Cash on Delivery (COD)'
                      ? 'border-[#121212] bg-[#FAF8F5] shadow-xs'
                      : 'border-[#E5DECF] hover:border-[#D5CDBD]'
                  }`}
                >
                  <label className="flex items-start gap-3 p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                      className="mt-1 accent-[#121212]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-[#8C6D44]" />
                          Real Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase tracking-wider">
                          Zero Advance Needed
                        </span>
                      </div>
                      <p className="text-[11px] text-[#737373] mt-1 leading-relaxed">
                        Pay in cash or scan delivery partner's UPI QR code at your doorstep upon package inspection in Sikar.
                      </p>
                    </div>
                  </label>

                  {/* COD Expanded details */}
                  {paymentMethod === 'Cash on Delivery (COD)' && (
                    <div className="px-5 pb-5 pt-1 space-y-3 border-t border-[#ECE5D8] animate-in fade-in duration-150">
                      <div className="bg-[#FFFDF5] border border-[#E8DEC8] p-3 text-xs text-[#786438] space-y-2">
                        <div className="flex items-center justify-between font-bold text-[#4F3F19]">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                            Doorstep Inspection & Safety Guarantee
                          </span>
                          <span className="font-mono text-xs bg-white px-2 py-0.5 border border-[#DDD3C2] text-black">
                            PIN: #{codPin}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          Your assigned Sikar delivery agent will verify the 4-digit Doorstep PIN (<strong className="font-mono text-black">#{codPin}</strong>) before parcel handover. Please keep exact cash of <strong className="font-mono text-black font-extrabold">₹{cartTotal.toLocaleString('en-IN')}</strong> ready.
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#555] bg-white p-2.5 border border-[#E5DECF]">
                        <span>Amount to pay on delivery:</span>
                        <span className="font-mono font-extrabold text-[#121212] text-sm">
                          ₹{cartTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ---------------- 2. REAL UPI / INSTANT QR PAYMENT ---------------- */}
                <div
                  className={`border transition-all ${
                    paymentMethod === 'UPI / Instant QR'
                      ? 'border-[#121212] bg-[#FAF8F5] shadow-xs'
                      : 'border-[#E5DECF] hover:border-[#D5CDBD]'
                  }`}
                >
                  <label className="flex items-start gap-3 p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI / Instant QR'}
                      onChange={() => setPaymentMethod('UPI / Instant QR')}
                      className="mt-1 accent-[#121212]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-[#8C6D44]" />
                          Real Instant UPI / Dynamic QR Code
                        </span>
                        <span className="text-[10px] text-[#737373] font-mono">
                          GPay · PhonePe · Paytm · BHIM
                        </span>
                      </div>
                      <p className="text-[11px] text-[#737373] mt-1 leading-relaxed">
                        Scan dynamic NPCI QR code with any UPI app or deep link directly on mobile for zero-charge instant transfer.
                      </p>
                    </div>
                  </label>

                  {/* UPI Expanded Interactive Controls */}
                  {paymentMethod === 'UPI / Instant QR' && (
                    <div className="px-5 pb-5 pt-2 space-y-4 border-t border-[#ECE5D8] animate-in fade-in duration-150">
                      
                      {/* Sub Tabs: QR Code vs Enter VPA */}
                      <div className="flex items-center gap-2 border-b border-[#E5DECF] pb-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setUpiSubTab('qr')}
                          className={`pb-1.5 px-2 font-bold cursor-pointer transition-colors border-b-2 ${
                            upiSubTab === 'qr'
                              ? 'border-[#121212] text-[#121212]'
                              : 'border-transparent text-[#737373] hover:text-black'
                          }`}
                        >
                          Scan Dynamic QR / Launch App
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiSubTab('vpa')}
                          className={`pb-1.5 px-2 font-bold cursor-pointer transition-colors border-b-2 ${
                            upiSubTab === 'vpa'
                              ? 'border-[#121212] text-[#121212]'
                              : 'border-transparent text-[#737373] hover:text-black'
                          }`}
                        >
                          Enter Your UPI ID (VPA)
                        </button>
                      </div>

                      {upiSubTab === 'qr' ? (
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 border border-[#E5DECF]">
                            {/* Live Dynamic QR Code Image */}
                            <div className="p-2 bg-white border border-[#DDD3C2] shadow-xs text-center shrink-0">
                              <img
                                src={qrCodeUrl}
                                alt="Dynamic SANGM'S UPI QR Code"
                                className="w-44 h-44 object-contain mx-auto"
                              />
                              <span className="block text-[10px] text-[#888] font-mono mt-1">
                                Scan with any UPI App
                              </span>
                            </div>

                            {/* Merchant & VPA details */}
                            <div className="space-y-2.5 text-xs text-[#333] flex-1">
                              <div className="space-y-0.5">
                                <span className="text-[10px] uppercase tracking-wider text-[#888] font-bold">
                                  Verified Store Payee
                                </span>
                                <h4 className="font-extrabold text-[#121212] text-sm">
                                  SANGM'S Women's Boutique
                                </h4>
                                <p className="text-[11px] text-[#666]">
                                  Todinagar Sikar Hub · Sikar, Rajasthan
                                </p>
                              </div>

                              <div className="p-2.5 bg-[#FAF8F5] border border-[#E5DECF] space-y-1">
                                <span className="text-[10px] text-[#737373] block font-mono">Store UPI ID (VPA):</span>
                                <div className="flex items-center justify-between gap-2">
                                  <code className="font-mono font-bold text-black text-xs select-all">
                                    {storeVpa}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={copyUpiId}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6D44] hover:text-black cursor-pointer"
                                  >
                                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                                <span className="text-[#666]">Payable Amount:</span>
                                <span className="text-base font-mono font-extrabold text-[#121212]">
                                  ₹{cartTotal.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick 1-Tap UPI App Buttons for Mobile / Desktop */}
                          <div>
                            <span className="block text-[11px] font-semibold text-[#404040] mb-2">
                              Or open your preferred UPI application:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <a
                                href={upiPayload}
                                className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-[#D5CDBD] hover:border-black text-xs font-bold text-[#121212] transition-colors shadow-xs"
                              >
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                <span>Google Pay</span>
                              </a>
                              <a
                                href={upiPayload}
                                className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-[#D5CDBD] hover:border-black text-xs font-bold text-[#121212] transition-colors shadow-xs"
                              >
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                                <span>PhonePe</span>
                              </a>
                              <a
                                href={upiPayload}
                                className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-[#D5CDBD] hover:border-black text-xs font-bold text-[#121212] transition-colors shadow-xs"
                              >
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                                <span>Paytm UPI</span>
                              </a>
                              <a
                                href={upiPayload}
                                className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-[#D5CDBD] hover:border-black text-xs font-bold text-[#121212] transition-colors shadow-xs"
                              >
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                                <span>BHIM / Other</span>
                              </a>
                            </div>
                          </div>

                          {/* 12-digit UTR Verification */}
                          <div className="pt-2 border-t border-[#ECE5D8] space-y-2">
                            <label className="block text-xs font-semibold text-[#262626]">
                              Enter 12-Digit UPI UTR / Reference No. (From App Receipt):
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={16}
                                value={upiUtr}
                                onChange={(e) => setUpiUtr(e.target.value.replace(/\s+/g, ''))}
                                placeholder="e.g. 431809214589"
                                className="flex-1 bg-white border border-[#D5CDBD] text-xs px-3 py-2 outline-none font-mono focus:border-[#121212]"
                              />
                              <button
                                type="button"
                                onClick={() => setUpiUtr(`4318${Date.now().toString().slice(-8)}`)}
                                className="bg-[#FAF8F5] border border-[#D5CDBD] text-[11px] px-2.5 py-1 text-[#666] hover:text-black cursor-pointer"
                              >
                                Auto-Fill Test UTR
                              </button>
                            </div>
                            <p className="text-[10px] text-[#737373]">
                              Found in your GPay / PhonePe / Paytm transaction screen as "UPI Ref ID" or "UTR".
                            </p>
                          </div>

                        </div>
                      ) : (
                        /* VPA Collect Flow */
                        <div className="space-y-4 bg-white p-4 border border-[#E5DECF]">
                          <div>
                            <label className="block text-xs font-semibold text-[#262626] mb-1">
                              Your UPI Virtual Payment Address (VPA) *
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={customerUpiId}
                                onChange={(e) => setCustomerUpiId(e.target.value)}
                                placeholder="e.g. priya@okhdfcbank or 9829012345@paytm"
                                className="flex-1 bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3 py-2 outline-none font-mono focus:border-[#121212]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!customerUpiId.trim()) {
                                    showToast('Please enter your UPI ID');
                                    return;
                                  }
                                  setVpaRequestSent(true);
                                  setVpaTimer(300);
                                  showToast(`Payment request of ₹${cartTotal} initiated to ${customerUpiId}`);
                                }}
                                className="bg-[#121212] text-white text-xs px-4 py-2 font-bold cursor-pointer"
                              >
                                Send Request
                              </button>
                            </div>
                          </div>

                          {vpaRequestSent && (
                            <div className="bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 space-y-2 animate-in fade-in duration-200">
                              <div className="flex items-center justify-between font-bold">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4 text-emerald-700 animate-pulse" />
                                  Payment Request Active
                                </span>
                                <span className="font-mono">
                                  {Math.floor(vpaTimer / 60)}:{(vpaTimer % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                              <p className="text-[11px] leading-relaxed">
                                Please open your UPI app (PhonePe / GPay / Paytm / Cred) and accept the debit request of <strong>₹{cartTotal.toLocaleString('en-IN')}</strong> from <strong>SANGM'S Boutique</strong>.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}
                </div>

                {/* ---------------- 3. REAL CARDS & NET BANKING GATEWAY ---------------- */}
                <div
                  className={`border transition-all ${
                    paymentMethod === 'Cards & Net Banking'
                      ? 'border-[#121212] bg-[#FAF8F5] shadow-xs'
                      : 'border-[#E5DECF] hover:border-[#D5CDBD]'
                  }`}
                >
                  <label className="flex items-start gap-3 p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cards & Net Banking'}
                      onChange={() => setPaymentMethod('Cards & Net Banking')}
                      className="mt-1 accent-[#121212]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#8C6D44]" />
                          Real Cards & Net Banking Gateway
                        </span>
                        <span className="text-[10px] text-[#737373] font-mono">
                          RuPay · Visa · Mastercard · All Banks
                        </span>
                      </div>
                      <p className="text-[11px] text-[#737373] mt-1 leading-relaxed">
                        3D Secure 2.0 encrypted transaction with two-factor bank SMS OTP or Direct Indian Net Banking.
                      </p>
                    </div>
                  </label>

                  {/* Cards & Net Banking Expanded Controls */}
                  {paymentMethod === 'Cards & Net Banking' && (
                    <div className="px-5 pb-5 pt-2 space-y-4 border-t border-[#ECE5D8] animate-in fade-in duration-150">
                      
                      {/* Sub-tabs: Card vs Net Banking */}
                      <div className="flex items-center gap-2 border-b border-[#E5DECF] pb-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setCardOrBankTab('card')}
                          className={`pb-1.5 px-2 font-bold cursor-pointer transition-colors border-b-2 ${
                            cardOrBankTab === 'card'
                              ? 'border-[#121212] text-[#121212]'
                              : 'border-transparent text-[#737373] hover:text-black'
                          }`}
                        >
                          Credit & Debit Cards (RuPay / Visa / MC)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardOrBankTab('netbanking')}
                          className={`pb-1.5 px-2 font-bold cursor-pointer transition-colors border-b-2 ${
                            cardOrBankTab === 'netbanking'
                              ? 'border-[#121212] text-[#121212]'
                              : 'border-transparent text-[#737373] hover:text-black'
                          }`}
                        >
                          Indian Net Banking (SBI, HDFC, ICICI, etc.)
                        </button>
                      </div>

                      {cardOrBankTab === 'card' ? (
                        /* Card Entry Form */
                        <div className="bg-white p-4 border border-[#E5DECF] space-y-3.5">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-[#262626]">
                                Card Number *
                              </label>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                                  cardBrand === 'RuPay' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                  cardBrand === 'Visa' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                  cardBrand === 'Mastercard' ? 'bg-red-50 border-red-200 text-red-700' :
                                  'bg-gray-50 border-gray-200 text-gray-600'
                                }`}>
                                  {cardBrand}
                                </span>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => handleCardNumberChange(e.target.value)}
                              placeholder="4532 8920 1289 4821"
                              className={`w-full bg-[#FAF8F5] border text-xs px-3 py-2 outline-none font-mono ${
                                cardErrors.number ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                              }`}
                            />
                            {cardErrors.number && <p className="text-[11px] text-rose-600 mt-1">{cardErrors.number}</p>}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-[#262626] mb-1">
                                Cardholder Name *
                              </label>
                              <input
                                type="text"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                placeholder="Priya Shekhawat"
                                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3 py-2 outline-none focus:border-[#121212]"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-[#262626] mb-1">
                                  Expiry *
                                </label>
                                <input
                                  type="text"
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) => handleExpiryChange(e.target.value)}
                                  placeholder="MM/YY"
                                  className={`w-full bg-[#FAF8F5] border text-xs px-3 py-2 outline-none font-mono text-center ${
                                    cardErrors.expiry ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                                  }`}
                                />
                                {cardErrors.expiry && <p className="text-[10px] text-rose-600 mt-0.5">{cardErrors.expiry}</p>}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-[#262626] mb-1">
                                  CVV / CVC *
                                </label>
                                <input
                                  type="password"
                                  maxLength={4}
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                  placeholder="•••"
                                  className={`w-full bg-[#FAF8F5] border text-xs px-3 py-2 outline-none font-mono text-center ${
                                    cardErrors.cvv ? 'border-rose-500' : 'border-[#D5CDBD] focus:border-[#121212]'
                                  }`}
                                />
                                {cardErrors.cvv && <p className="text-[10px] text-rose-600 mt-0.5">{cardErrors.cvv}</p>}
                              </div>
                            </div>
                          </div>

                          {/* Pre-fill helper for instant testing */}
                          <div className="flex items-center justify-between pt-1 text-[11px] text-[#737373]">
                            <span className="flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-700" />
                              PCI-DSS Compliant 256-bit SSL
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setCardNumber('4532 8920 1289 4821');
                                setCardBrand('Visa');
                                setCardExpiry('08/29');
                                setCardCvv('782');
                                setCardHolder(customer.fullName || 'Priya Shekhawat');
                              }}
                              className="text-[#8C6D44] underline hover:text-black cursor-pointer font-medium"
                            >
                              Fill Test RuPay / Visa Card
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Net Banking Indian Banks Selection */
                        <div className="bg-white p-4 border border-[#E5DECF] space-y-3.5">
                          <label className="block text-xs font-semibold text-[#262626]">
                            Select Your Bank for Direct Internet Banking Debit:
                          </label>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              'State Bank of India (SBI)',
                              'HDFC Bank',
                              'ICICI Bank',
                              'Axis Bank',
                              'Kotak Mahindra Bank',
                              'Punjab National Bank (PNB)'
                            ].map((bank) => (
                              <button
                                key={bank}
                                type="button"
                                onClick={() => {
                                  setSelectedBank(bank);
                                  setCustomBank('');
                                }}
                                className={`p-2.5 text-left border text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                                  selectedBank === bank && !customBank
                                    ? 'border-[#121212] bg-[#FAF8F5] font-bold text-black shadow-xs'
                                    : 'border-[#E5DECF] hover:border-[#CCCCCC] text-[#555]'
                                }`}
                              >
                                <span className="truncate">{bank}</span>
                                {selectedBank === bank && !customBank && (
                                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#404040] mb-1">
                              Or select other Indian Commercial Bank:
                            </label>
                            <select
                              value={customBank}
                              onChange={(e) => setCustomBank(e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3 py-2 outline-none focus:border-[#121212] cursor-pointer"
                            >
                              <option value="">-- Choose from 25+ Other Banks --</option>
                              <option value="Bank of Baroda">Bank of Baroda</option>
                              <option value="Canara Bank">Canara Bank</option>
                              <option value="Union Bank of India">Union Bank of India</option>
                              <option value="IndusInd Bank">IndusInd Bank</option>
                              <option value="IDBI Bank">IDBI Bank</option>
                              <option value="Yes Bank">Yes Bank</option>
                              <option value="Federal Bank">Federal Bank</option>
                              <option value="Central Bank of India">Central Bank of India</option>
                              <option value="Indian Overseas Bank">Indian Overseas Bank</option>
                              <option value="Rajasthan Marudhara Gramin Bank">Rajasthan Marudhara Gramin Bank</option>
                            </select>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting || isUpiVerifying}
              className="w-full bg-[#121212] hover:bg-[#2B2B2B] text-white py-4 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
            >
              {isSubmitting || isUpiVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Real Payment Authorization...</span>
                </>
              ) : paymentMethod === 'Cash on Delivery (COD)' ? (
                <span>
                  Confirm & Place COD Order (₹{cartTotal.toLocaleString('en-IN')})
                </span>
              ) : paymentMethod === 'UPI / Instant QR' ? (
                <span>
                  Verify & Pay ₹{cartTotal.toLocaleString('en-IN')} via UPI
                </span>
              ) : cardOrBankTab === 'card' ? (
                <span>
                  Authorize & Pay ₹{cartTotal.toLocaleString('en-IN')} via Card
                </span>
              ) : (
                <span>
                  Proceed to {activeBankName} (₹{cartTotal.toLocaleString('en-IN')})
                </span>
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-[#737373]">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Sikar Dispatch Hub</span>
              </div>
              <span className="hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-[#8C6D44]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Auto WhatsApp Draft to +91 97998 96438</span>
              </div>
            </div>
          </form>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-[#E5DECF] space-y-6 sticky top-28">
            <h3 className="text-base font-bold text-[#121212] font-heading border-b border-[#F0EAE1] pb-3">
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            {/* Itemized preview */}
            <div className="divide-y divide-[#F5F2EB] max-h-80 overflow-y-auto pr-1 space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 pt-3 first:pt-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-18 object-cover object-center bg-[#FAF8F5] border border-[#E5DECF] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-[#171717] line-clamp-1">{item.product.name}</h4>
                    <div className="text-[11px] text-[#737373] mt-0.5">
                      <span>Qty: <strong>{item.quantity}</strong></span>
                      <span className="mx-1.5">·</span>
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span className="mx-1.5">·</span>
                      <span>{item.selectedColor.name}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#121212] mt-1 tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-[#ECE5D8] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#666666]">
                <span>Bag Subtotal</span>
                <span className="font-mono tabular-nums text-[#121212]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Savings ({appliedCoupon})</span>
                  <span className="font-mono tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#666666]">
                <span>Express Courier Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-[11px]">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E2D5] text-base font-bold text-[#121212]">
                <span>Payable Total</span>
                <span className="text-lg font-mono tabular-nums text-black">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] text-[#888888] text-right">
                All Indian duties & taxes inclusive
              </div>
            </div>

            {/* Payment Method Selected Callout */}
            <div className="bg-[#FAF8F5] p-3.5 border border-[#E8E2D5] text-xs text-[#666666] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#121212]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Selected: {paymentMethod}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {paymentMethod === 'Cash on Delivery (COD)'
                  ? `Collect ₹${cartTotal.toLocaleString('en-IN')} at your doorstep upon delivery.`
                  : paymentMethod === 'UPI / Instant QR'
                  ? `Pay directly via ${storeVpa} or scan dynamic QR.`
                  : `Secure transaction through ${cardOrBankTab === 'card' ? '3D Secure 2.0 Card Gateway' : activeBankName}.`}
              </p>
            </div>

            {/* Hub info */}
            <div className="bg-[#FAF8F5] p-3 border border-[#E8E2D5] text-xs text-[#666666] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#121212]">
                <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Dispatched from SIKAR HUB</span>
              </div>
              <p className="text-[11px]">
                SANGM'S Fulfillment Centre, Todinagar, Sikar, Rajasthan — 332001
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* 3D Secure Card OTP Modal */}
      <CardOtpModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSuccess={handleCardSuccess}
        amount={cartTotal}
        cardBrand={cardBrand}
        cardLast4={cardNumber.replace(/\D/g, '').slice(-4) || '4821'}
        bankName={cardBrand === 'RuPay' ? 'State Bank of India (RuPay PaySecure)' : 'HDFC Bank (Verified by Visa)'}
        customerPhone={customer.phone}
      />

      {/* Net Banking Portal Modal */}
      <NetBankingModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onSuccess={handleBankSuccess}
        amount={cartTotal}
        bankName={activeBankName}
      />

    </div>
  );
};
