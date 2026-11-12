import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building,
  CreditCard,
  Smartphone,
  X,
  RefreshCw,
  Clock,
  ArrowRight,
  Shield
} from 'lucide-react';

interface CardOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txnId: string) => void;
  amount: number;
  cardBrand: string;
  cardLast4: string;
  bankName: string;
  customerPhone: string;
}

export const CardOtpModal: React.FC<CardOtpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  cardBrand,
  cardLast4,
  bankName,
  customerPhone
}) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState('749201');

  useEffect(() => {
    if (isOpen) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(code);
      setOtp('');
      setError(null);
      setTimer(60);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    if (otp.trim() !== generatedOtp && otp.trim() !== '749201' && otp.trim() !== '123456') {
      setError('Invalid OTP code. Please enter the verification OTP sent to your phone.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess(`TXN_CARD_${Date.now()}`);
    }, 900);
  };

  const handleResend = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setTimer(60);
    setError(null);
  };

  const cleanPhone = customerPhone.replace(/[\s-+]/g, '').slice(-10);
  const maskedPhone = cleanPhone ? `••••••${cleanPhone.slice(-4)}` : '••••••9438';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5DECF] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Bank 3D Secure Header */}
        <div className="bg-[#171717] text-white p-4 flex items-center justify-between border-b border-[#333]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide uppercase text-[#E8DEC8]">
                {bankName || 'Verified by Visa / RuPay Secure'}
              </div>
              <div className="text-[10px] text-[#A3A3A3] font-mono">
                3D Secure 2.0 Payment Gateway
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#999999] hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transaction Summary strip */}
        <div className="bg-[#FAF8F5] border-b border-[#E8E2D5] px-5 py-3 text-xs flex items-center justify-between">
          <div>
            <span className="text-[#737373] block text-[11px]">Merchant</span>
            <span className="font-bold text-[#121212]">SANGM'S Boutique Sikar</span>
          </div>
          <div className="text-right">
            <span className="text-[#737373] block text-[11px]">Total Amount</span>
            <span className="font-mono font-extrabold text-[#121212] text-sm">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Card and Phone information */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#555] bg-[#F5F2EB] p-2.5 border border-[#E5DECF]">
            <div className="flex items-center gap-1.5 font-medium">
              <CreditCard className="w-4 h-4 text-[#8C6D44]" />
              <span>{cardBrand} Ending in •••• {cardLast4 || '4821'}</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5">
              Secure
            </span>
          </div>

          {/* Simulated SMS notification banner */}
          <div className="bg-[#FFFDF5] border border-[#E8DEC8] p-3 text-xs text-[#786438] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#4F3F19]">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#C5A880]" />
                SMS OTP sent to +91 {maskedPhone}
              </span>
              <button
                type="button"
                onClick={() => setOtp(generatedOtp)}
                className="text-[10px] text-[#8C6D44] underline font-mono cursor-pointer hover:text-black"
              >
                Auto-Fill OTP
              </button>
            </div>
            <p className="text-[11px] leading-relaxed">
              Use code <strong className="font-mono text-black font-extrabold">{generatedOtp}</strong> to authenticate this transaction.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#262626] mb-1.5">
                Enter 6-Digit One Time Password (OTP) *
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-center text-lg tracking-[0.4em] font-mono py-2.5 outline-none focus:border-[#121212] transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-[#737373] pt-1">
              <span>
                {timer > 0 ? (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    Resend OTP in <strong>{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#8C6D44] hover:underline font-semibold cursor-pointer"
                  >
                    Resend New OTP
                  </button>
                )}
              </span>
              <span className="text-[10px] text-[#888]">256-bit SSL Encrypted</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white border border-[#D5CDBD] text-[#121212] py-2.5 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 bg-[#121212] hover:bg-[#2B2B2B] text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Authorize Pay</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};

interface NetBankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txnId: string, bankName: string) => void;
  amount: number;
  bankName: string;
}

export const NetBankingModal: React.FC<NetBankingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  bankName
}) => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [userId, setUserId] = useState('user9829');
  const [password, setPassword] = useState('password123');
  const [otp, setOtp] = useState('981240');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('login');
      setIsProcessing(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError('Enter your User ID and Net Banking password');
      return;
    }
    setIsProcessing(true);
    setError(null);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Enter the high security transaction OTP');
      return;
    }
    setIsProcessing(true);
    setError(null);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(`TXN_NB_${Date.now()}`, bankName || 'State Bank of India');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5DECF] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Bank Portal Header */}
        <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide uppercase text-white">
                {bankName || 'State Bank of India'} Internet Banking
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Official Indian Retail Net Banking Gateway
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-[#FAF8F5] border-b border-[#E8E2D5] px-5 py-3 text-xs flex items-center justify-between">
          <div>
            <span className="text-[#737373] block text-[11px]">Payee</span>
            <span className="font-bold text-[#121212]">SANGM'S Boutique Sikar</span>
          </div>
          <div className="text-right">
            <span className="text-[#737373] block text-[11px]">Payable Amount</span>
            <span className="font-mono font-extrabold text-[#121212] text-sm">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="p-5">
          {step === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="bg-blue-50/60 border border-blue-200 p-2.5 text-xs text-blue-900 rounded-xs flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Log in to your <strong>{bankName}</strong> account to authorize this direct merchant debit of ₹{amount.toLocaleString('en-IN')}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#262626] mb-1">
                  Customer ID / Net Banking Username *
                </label>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3 py-2 outline-none focus:border-[#121212] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#262626] mb-1">
                  IPIN / Login Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-xs px-3 py-2 outline-none focus:border-[#121212] font-mono"
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white border border-[#D5CDBD] text-[#121212] py-2.5 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900 rounded-xs flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Net Banking session authenticated. An authorization OTP of <strong>981240</strong> has been dispatched to your bank-registered mobile number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#262626] mb-1.5">
                  High Security Transaction OTP *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] text-center text-lg tracking-[0.4em] font-mono py-2 outline-none focus:border-[#121212]"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="flex-1 bg-white border border-[#D5CDBD] text-[#121212] py-2.5 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Completing Payment...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay ₹{amount.toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
