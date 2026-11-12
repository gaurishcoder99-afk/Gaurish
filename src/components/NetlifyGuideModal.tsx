import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Copy, Check, ExternalLink, Terminal, Shield, Globe, FileCode, CheckCircle2 } from 'lucide-react';

export const NetlifyGuideModal: React.FC = () => {
  const { showNetlifyGuide, setShowNetlifyGuide } = useStore();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!showNetlifyGuide) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const netlifyTomlSnippet = `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl border border-[#E5DECF] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00C7B7]/15 text-[#008F84] flex items-center justify-center font-bold font-mono">
              N
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#121212] font-heading">
                Netlify Deployment & Production Guide
              </h2>
              <p className="text-xs text-[#737373]">
                Step-by-step instructions for deploying SANGM'S to Netlify with zero configuration hassle
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNetlifyGuide(false)}
            className="p-1.5 text-[#737373] hover:text-black rounded-full hover:bg-[#F2ECE1] cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary Pill */}
        <div className="bg-[#FAF8F5] border border-[#E8E2D5] p-4 text-xs text-[#404040] space-y-2">
          <div className="font-bold text-[#121212] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Project is 100% Pre-Configured for Netlify!</span>
          </div>
          <p className="leading-relaxed">
            A root <code>netlify.toml</code> file is already created in this codebase. It specifies the build command (<code>npm run build</code>), output directory (<code>dist</code>), and single-page application rewrite rule (<code>/* -&gt; /index.html 200</code>) so your URLs, catalogue filters, and admin routes resolve seamlessly without 404 errors.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-6 text-xs text-[#333333]">
          
          {/* Step 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#121212] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#121212] text-white flex items-center justify-center text-xs font-mono">
                1
              </span>
              <span>Deploying via Netlify Web UI (GitHub / GitLab / Bitbucket)</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 pl-2 leading-relaxed text-[#555555]">
              <li>Push this project codebase to your GitHub repository (e.g., <code>github.com/your-username/sangms-store</code>).</li>
              <li>Log in to <a href="https://app.netlify.com" target="_blank" rel="noreferrer" className="text-[#008F84] font-semibold underline">app.netlify.com</a>.</li>
              <li>Click <strong>"Add new site"</strong> &rarr; <strong>"Import an existing project"</strong>.</li>
              <li>Select <strong>GitHub</strong> and choose your repository.</li>
              <li>Netlify will automatically detect <code>netlify.toml</code> and pre-fill:
                <ul className="list-disc list-inside pl-4 mt-1 font-mono text-[11px] text-[#121212]">
                  <li>Build command: <code>npm run build</code></li>
                  <li>Publish directory: <code>dist</code></li>
                </ul>
              </li>
              <li>Click <strong>"Deploy site"</strong>. Your store will be live on a secure HTTPS URL in &lt; 60 seconds!</li>
            </ol>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#121212] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#121212] text-white flex items-center justify-center text-xs font-mono">
                2
              </span>
              <span>Alternative: Deploying via Netlify CLI (Terminal)</span>
            </h3>
            <div className="bg-[#171717] text-[#FAF8F5] p-3.5 font-mono text-xs space-y-2 relative">
              <button
                onClick={() => copyToClipboard('npm install -g netlify-cli\nnpm run build\nnetlify deploy --prod', 'cli')}
                className="absolute top-2.5 right-2.5 text-xs text-[#A8A196] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'cli' ? 'Copied' : 'Copy'}</span>
              </button>
              <p className="text-[#888888]"># Install Netlify CLI globally</p>
              <p>npm install -g netlify-cli</p>
              <p className="text-[#888888]"># Build production assets into /dist</p>
              <p>npm run build</p>
              <p className="text-[#888888]"># Deploy directly to production</p>
              <p>netlify deploy --prod</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#121212] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#121212] text-white flex items-center justify-center text-xs font-mono">
                3
              </span>
              <span>Updating the Published Website</span>
            </h3>
            <p className="text-[#555555] leading-relaxed">
              Whenever you make code changes, add new products to <code>src/data/products.ts</code>, or update styling:
            </p>
            <div className="bg-[#171717] text-[#FAF8F5] p-3 font-mono text-xs">
              <p>git add .</p>
              <p>git commit -m "Update SANGM'S collection catalogue"</p>
              <p>git push origin main</p>
            </div>
            <p className="text-[11px] text-[#737373]">
              Netlify's Continuous Deployment webhook triggers automatically, rebuilds the site, and deploys the new version with zero downtime.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#121212] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#121212] text-white flex items-center justify-center text-xs font-mono">
                4
              </span>
              <span>Environment Variables in Netlify</span>
            </h3>
            <p className="text-[#555555] leading-relaxed">
              In Netlify Site Settings &rarr; <strong>Configuration</strong> &rarr; <strong>Environment variables</strong>, you can add client-safe variables:
            </p>
            <div className="p-3 bg-[#FAF8F5] border border-[#DDD3C2] font-mono text-[11px] space-y-1">
              <div>VITE_APP_URL = "https://your-custom-domain.com"</div>
              <div>VITE_STORE_LOCATION = "Todinagar, Sikar, Rajasthan"</div>
              <div>VITE_CURRENCY = "INR"</div>
            </div>
            <p className="text-[11px] text-amber-800">
              * Note: Remember to prefix client-side variables with <code>VITE_</code> in Vite projects so they are accessible in React code.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F0EAE1] flex justify-end">
          <button
            onClick={() => setShowNetlifyGuide(false)}
            className="bg-[#121212] hover:bg-[#2B2B2B] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Got It, Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
