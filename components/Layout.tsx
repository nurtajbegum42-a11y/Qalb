
import React from 'react';
import { ICONS } from '../constants.tsx';
import { View } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  title?: string;
  notifsEnabled: boolean;
  onToggleNotifs: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, title, notifsEnabled, onToggleNotifs }) => {
  return (
    <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
      {/* Top Safe Area Background */}
      <div className="flex-none bg-white z-[60] h-[env(safe-area-inset-top)]"></div>

      {/* App Bar */}
      <header className="flex-none px-6 pb-4 bg-white/95 backdrop-blur-md shadow-sm shadow-black/5 flex justify-between items-end z-50 pt-3 border-b border-black/[0.02]">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20 leading-none mb-1">Qalb App</span>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black tracking-tight uppercase text-black">{title || 'Home'}</h1>
            <button 
              onClick={onToggleNotifs}
              className={`p-1.5 rounded-full transition-all ${notifsEnabled ? 'bg-black text-white shadow-lg shadow-black/20' : 'bg-black/5 text-black/20'}`}
              aria-label="Toggle Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center pb-0.5">
          <ICONS.Logo />
        </div>
      </header>

      {/* Primary Scroll Container */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar relative">
        <div className="max-w-md mx-auto w-full pb-40">
          {children}
        </div>
      </main>

      {/* Bottom Floating Nav Container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-8 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
        <nav className="max-w-sm mx-auto bg-white text-black shadow-2xl shadow-black/15 rounded-[22px] flex justify-around py-4 px-2 pointer-events-auto border border-black/[0.08]">
          <button 
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === 'home' ? 'scale-110 opacity-100' : 'opacity-20 hover:opacity-40'}`}
          >
            <ICONS.Home />
            <span className="text-[7px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button 
            onClick={() => onNavigate('prayer')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === 'prayer' ? 'scale-110 opacity-100' : 'opacity-20 hover:opacity-40'}`}
          >
            <ICONS.Prayer />
            <span className="text-[7px] font-black uppercase tracking-widest">Times</span>
          </button>
          <button 
            onClick={() => onNavigate('dua')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === 'dua' ? 'scale-110 opacity-100' : 'opacity-20 hover:opacity-40'}`}
          >
            <ICONS.Dua />
            <span className="text-[7px] font-black uppercase tracking-widest">Dua</span>
          </button>
          <button 
            onClick={() => onNavigate('quran')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${currentView === 'quran' || currentView === 'surah-detail' ? 'scale-110 opacity-100' : 'opacity-20 hover:opacity-40'}`}
          >
            <ICONS.Quran />
            <span className="text-[7px] font-black uppercase tracking-widest">Quran</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
