
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { View } from '../types';
import { notificationService } from '../services/notificationService';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, title }) => {
  const [notifsEnabled, setNotifsEnabled] = useState(localStorage.getItem('qalb_notifs') === 'true');

  const toggleNotifs = async () => {
    if (!notifsEnabled) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setNotifsEnabled(true);
        localStorage.setItem('qalb_notifs', 'true');
        notificationService.playBell();
      } else {
        alert("Please enable notifications in your browser settings.");
      }
    } else {
      setNotifsEnabled(false);
      localStorage.setItem('qalb_notifs', 'false');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white border-x border-black/5 relative">
      {/* Header */}
      <header className="px-6 py-4 bg-white shadow-sm shadow-black/5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 leading-none mb-1">Navigation</span>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black tracking-tight uppercase text-black">{title || 'Home'}</h1>
            <button 
              onClick={toggleNotifs}
              className={`p-1.5 rounded-full transition-all ${notifsEnabled ? 'bg-black text-white' : 'bg-black/5 text-black/20'}`}
              title={notifsEnabled ? "Notifications On" : "Notifications Off"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <ICONS.Logo />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {children}
      </main>

      {/* Bottom Nav */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none">
        <nav className="max-w-md mx-auto bg-white shadow-xl shadow-black/10 rounded-[12px] border border-black/[0.05] flex justify-around py-4 px-2 pointer-events-auto">
          <button 
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === 'home' ? 'scale-110 opacity-100' : 'opacity-30'}`}
          >
            <ICONS.Home />
            <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button 
            onClick={() => onNavigate('prayer')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === 'prayer' ? 'scale-110 opacity-100' : 'opacity-30'}`}
          >
            <ICONS.Prayer />
            <span className="text-[8px] font-black uppercase tracking-widest">Prayer</span>
          </button>
          <button 
            onClick={() => onNavigate('dua')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === 'dua' ? 'scale-110 opacity-100' : 'opacity-30'}`}
          >
            <ICONS.Dua />
            <span className="text-[8px] font-black uppercase tracking-widest">Dua</span>
          </button>
          <button 
            onClick={() => onNavigate('quran')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === 'quran' ? 'scale-110 opacity-100' : 'opacity-30'}`}
          >
            <ICONS.Quran />
            <span className="text-[8px] font-black uppercase tracking-widest">Quran</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
