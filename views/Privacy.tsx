
import React from 'react';
import { ICONS } from '../constants.tsx';
import { View } from '../types.ts';

interface PrivacyProps {
  onBack: () => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onBack }) => {
  return (
    <div className="p-6 space-y-10 animate-in slide-in-from-right duration-400">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white rounded-[10px] shadow-sm border border-black/[0.03] active:scale-95 transition-all">
          <ICONS.Back />
        </button>
        <h2 className="text-lg font-black uppercase tracking-tighter">Privacy Policy</h2>
      </div>

      <section className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">1. Overview</h3>
          <p className="text-xs leading-relaxed font-medium">
            Qalb is built as a minimalist, offline-first Islamic companion. We value your privacy and aim for total transparency. No personal data is ever sold or tracked for advertising.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">2. Geolocation</h3>
          <p className="text-xs leading-relaxed font-medium">
            Our app requests access to your <strong>Approximate Location</strong> solely to calculate accurate local prayer timings. This calculation is performed on your device or via secure API calls. We do not store or share your location history.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">3. Local Storage</h3>
          <p className="text-xs leading-relaxed font-medium">
            Your preferences, such as bookmarks, saved Duas, and notification settings, are stored locally on your device (LocalStorage). This data remains under your control and is cleared if you reset your browser data.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">4. Third-Party Services</h3>
          <p className="text-xs leading-relaxed font-medium">
            We utilize Aladhan API and Alquran Cloud to provide prayer timings and Quranic text. These services receive location coordinates to serve requests but do not receive any personally identifiable information.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">5. Contact</h3>
          <p className="text-xs leading-relaxed font-medium">
            For any queries regarding your privacy or data usage, please reach out to the developer via the official repository or professional profile.
          </p>
        </div>
      </section>

      <footer className="pt-10 pb-10 border-t border-black/[0.03] text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20">Last Updated: May 2024</p>
        <button 
          onClick={onBack}
          className="mt-6 px-8 py-3 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-[12px] active:scale-95 transition-all"
        >
          Return Home
        </button>
      </footer>
    </div>
  );
};

export default Privacy;
