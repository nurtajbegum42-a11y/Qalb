
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import PrayerTimes from './views/PrayerTimes';
import DuaView from './views/Dua';
import Quran from './views/Quran';
import SurahDetail from './views/SurahDetail';
import { View, Surah, PrayerTimings } from './types';
import { notificationService } from './services/notificationService';
import { fetchPrayerTimings } from './services/prayerService';

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

const NotificationPrompt: React.FC<{ onComplete: (enabled: boolean) => void }> = ({ onComplete }) => {
  const handleEnable = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      localStorage.setItem('qalb_notifs', 'true');
      notificationService.playBell();
      localStorage.setItem('qalb_notif_prompted', 'true');
      onComplete(true);
    } else {
      localStorage.setItem('qalb_notif_prompted', 'true');
      onComplete(false);
    }
  };

  const handleLater = () => {
    localStorage.setItem('qalb_notif_prompted', 'true');
    onComplete(false);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[20px] p-8 shadow-2xl border border-black/10 space-y-8 animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-tight">Prayer Alerts</h2>
            <h3 className="text-lg font-bold">নামাজের সর্তকবার্তা</h3>
          </div>

          <div className="space-y-4 text-black/60">
            <p className="text-xs font-medium leading-relaxed">
              Get notified when prayer time starts and 10 minutes before it ends.
            </p>
            <p className="text-xs font-bold leading-relaxed border-t border-black/5 pt-4">
              নামাজ শুরু হলে এবং শেষ হওয়ার ১০ মিনিট আগে সর্তকবার্তা পেতে নোটিফিকেশন চালু করুন।
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleEnable}
            className="w-full bg-black text-white py-4 rounded-[12px] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/20 active:scale-95 transition-all"
          >
            Enable Notifications / চালু করুন
          </button>
          <button 
            onClick={handleLater}
            className="w-full bg-white text-black border border-black/10 py-4 rounded-[12px] text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all"
          >
            Maybe Later / পরে করব
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifsEnabled, setNotifsEnabled] = useState(localStorage.getItem('qalb_notifs') === 'true');
  const [globalTimings, setGlobalTimings] = useState<PrayerTimings | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load and timings fetch
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchPrayerTimings(pos.coords.latitude, pos.coords.longitude)
        .then(setGlobalTimings)
        .catch(console.error);
    });

    const splashTimer = setTimeout(() => {
      setIsSplashVisible(false);
      const prompted = localStorage.getItem('qalb_notif_prompted');
      if (!prompted && 'Notification' in window) {
        setShowNotifPrompt(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(splashTimer);
    };
  }, []);

  // Global Notification Engine
  useEffect(() => {
    const interval = setInterval(() => {
      if (notifsEnabled && globalTimings) {
        notificationService.checkTimings(globalTimings);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [notifsEnabled, globalTimings]);

  const handleToggleNotifs = async () => {
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

  const navigateToSurah = (surah: Surah) => {
    setSelectedSurah(surah);
    setCurrentView('surah-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home timingsFromParent={globalTimings} />;
      case 'prayer': return <PrayerTimes timingsFromParent={globalTimings} />;
      case 'dua': return <DuaView />;
      case 'quran': return <Quran onSelectSurah={navigateToSurah} />;
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
      {showNotifPrompt && (
        <NotificationPrompt 
          onComplete={(enabled) => {
            setShowNotifPrompt(false);
            setNotifsEnabled(enabled);
          }} 
        />
      )}
      <Layout 
        currentView={currentView} 
        onNavigate={setCurrentView}
        title={getTitle()}
        notifsEnabled={notifsEnabled}
        onToggleNotifs={handleToggleNotifs}
      >
        {renderView()}
      </Layout>
    </>
  );
};

export default App;
