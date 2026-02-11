
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import PrayerTimes from './views/PrayerTimes';
import DuaView from './views/Dua';
import Quran from './views/Quran';
import SurahDetail from './views/SurahDetail';
import { View, Surah } from './types';

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center animate-in fade-in duration-500">
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-6xl font-black tracking-tighter text-black">QALB</span>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
          <path d="M12 2.5C10.5 6.5 7.5 8 7.5 12C7.5 14.5 8.5 16 8.5 16V21.5H11.5V17.5C11.5 17 11.7 16.5 12 16.5C12.3 16.5 12.5 17 12.5 17.5V21.5H15.5V16C15.5 16 16.5 14.5 16.5 12C16.5 8 13.5 6.5 12 2.5Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.5 21.5V17.5C11.5 17 11.7 16.5 12 16.5C12.3 16.5 12.5 17 12.5 17.5V21.5" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="h-[1px] w-32 bg-black/10"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40">Islamic Companion</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, []);

  const navigateToSurah = (surah: Surah) => {
    setSelectedSurah(surah);
    setCurrentView('surah-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home />;
      case 'prayer': return <PrayerTimes />;
      case 'dua': return <DuaView />;
      case 'quran': return <Quran onSelectSurah= {navigateToSurah} />;
      case 'surah-detail': 
        return selectedSurah ? (
          <SurahDetail 
            surah={selectedSurah} 
            onBack={() => setCurrentView('quran')} 
          />
        ) : <Quran onSelectSurah={navigateToSurah} />;
      default: return <Home />;
    }
  };

  const getTitle = () => {
    if (currentView === 'surah-detail') return 'Reading Quran';
    return currentView.charAt(0).toUpperCase() + currentView.slice(1);
  };

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-black text-white text-[8px] font-black uppercase tracking-[0.3em] py-1 text-center z-[100] animate-in slide-in-from-top duration-300">
          Viewing Offline Content
        </div>
      )}
      {isSplashVisible && <SplashScreen />}
      <Layout 
        currentView={currentView} 
        onNavigate={setCurrentView}
        title={getTitle()}
      >
        {renderView()}
      </Layout>
    </>
  );
};

export default App;
