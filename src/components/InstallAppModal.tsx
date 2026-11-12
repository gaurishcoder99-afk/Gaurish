import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { X, Download, Smartphone, Monitor, CheckCircle2, Share2, PlusSquare, Sparkles, ShieldCheck } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isMobile, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg border border-[#E5DECF] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#737373] hover:text-black rounded-full hover:bg-[#F2ECE1] transition-colors cursor-pointer"
          aria-label="Close install modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand App Icon & Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative w-20 h-20 mx-auto rounded-2xl bg-[#121212] p-2 shadow-lg flex items-center justify-center border border-[#C5A880]/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full">
              <circle cx="256" cy="256" r="172" fill="none" stroke="#C5A880" strokeWidth="2" strokeOpacity="0.8" />
              <text x="256" y="295" fontFamily="'Outfit', sans-serif" fontSize="190" fontWeight="800" fill="#FAF8F5" textAnchor="middle">S</text>
              <text x="256" y="375" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="30" fontWeight="700" fill="#C5A880" textAnchor="middle" letterSpacing="6">SANGM'S</text>
            </svg>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#C5A880] text-[#121212] flex items-center justify-center shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#121212] font-heading">
              Install SANGM'S on This Device
            </h2>
            <p className="text-xs text-[#737373] mt-1">
              Todinagar, Sikar · Women's, Ladies' & Girls' Fashion Boutique
            </p>
          </div>
        </div>

        {/* If Already Installed */}
        {isInstalled ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>SANGM'S App is Already Installed on This Device!</span>
            </div>
            <p className="text-xs text-[#555555]">
              You can launch it directly from your device's home screen or applications menu anytime.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-[#121212] text-white px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            {/* Primary Native 1-Click Install Button when browser supports it */}
            {isInstallable ? (
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-[#121212] hover:bg-[#2B2B2B] text-white py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#C5A880]" />
                  <span>Install SANGM'S App Now</span>
                </button>
                <p className="text-[11px] text-center text-[#737373]">
                  1-Click installation. Adds the icon directly to your home screen or desktop.
                </p>
              </div>
            ) : null}

            {/* Platform-Specific Step-by-Step Instructions */}
            <div className="space-y-4 pt-2 border-t border-[#F0EAE1]">
              
              {/* iOS / iPhone / iPad instructions */}
              {isIOS ? (
                <div className="bg-[#FAF8F5] border border-[#E5DECF] p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#121212]">
                    <Smartphone className="w-4 h-4 text-[#8C6D44]" />
                    <span>How to Install on iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-[#404040] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#121212]">1.</span>
                      <span>Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> at the bottom or top of your Safari browser bar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#121212]">2.</span>
                      <span>Scroll down in the share sheet and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-[#121212]" />.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#121212]">3.</span>
                      <span>Tap <strong>Add</strong> in the top right corner. The SANGM'S boutique icon will appear on your home screen!</span>
                    </li>
                  </ol>
                </div>
              ) : isAndroid ? (
                /* Android instructions */
                <div className="bg-[#FAF8F5] border border-[#E5DECF] p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#121212]">
                    <Smartphone className="w-4 h-4 text-[#8C6D44]" />
                    <span>How to Install on Android (Chrome / Edge / Samsung):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-[#404040] leading-relaxed">
                    <li>Tap the browser menu (<strong>three dots ⋮</strong> in the top right corner).</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>Confirm <strong>Install</strong>. SANGM'S will be added as a standalone mobile app!</li>
                  </ol>
                </div>
              ) : (
                /* Desktop (Windows / Mac / Chromebook) instructions */
                <div className="bg-[#FAF8F5] border border-[#E5DECF] p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#121212]">
                    <Monitor className="w-4 h-4 text-[#8C6D44]" />
                    <span>How to Install on Desktop (Windows / Mac / Chromebook):</span>
                  </div>
                  <ul className="space-y-2 text-[#404040] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#121212] mt-1.5 shrink-0" />
                      <span><strong>In Chrome or Edge:</strong> Look at the right side of the address bar at the top, click the <strong>Install</strong> icon <Download className="w-3.5 h-3.5 inline mx-1" /> and select <strong>Install</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#121212] mt-1.5 shrink-0" />
                      <span><strong>Or:</strong> Click the browser menu (⋮) &rarr; <strong>"Save and Share"</strong> or <strong>"Apps"</strong> &rarr; <strong>"Install SANGM'S"</strong>.</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* PWA App Benefits */}
              <div className="grid grid-cols-2 gap-3 text-xs text-[#555555] pt-1">
                <div className="p-3 bg-[#FFFDF5] border border-[#EAE3D2] space-y-1">
                  <div className="font-semibold text-[#121212] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Fast Standalone App</span>
                  </div>
                  <p className="text-[11px] text-[#737373]">
                    Runs without browser tabs or address bar for an immersive shopping experience.
                  </p>
                </div>

                <div className="p-3 bg-[#FFFDF5] border border-[#EAE3D2] space-y-1">
                  <div className="font-semibold text-[#121212] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Works Offline</span>
                  </div>
                  <p className="text-[11px] text-[#737373]">
                    Browses saved garments and keeps your cart synced even on intermittent connections.
                  </p>
                </div>
              </div>

            </div>
          </>
        )}

        {/* Footer actions */}
        <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#737373]">
          <span>Todinagar, Sikar, Rajasthan</span>
          <button
            onClick={onClose}
            className="text-[#121212] hover:underline font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
