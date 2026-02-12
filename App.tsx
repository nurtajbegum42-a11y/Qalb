
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Home from './views/Home.tsx';
import PrayerTimes from './views/PrayerTimes.tsx';
import DuaView from './views/Dua.tsx';
import Quran from './views/Quran.tsx';
import SurahDetail from './views/SurahDetail.tsx';
import { View, Surah, PrayerTimings } from './types.ts';
import { notificationService } from './services/notificationService.ts';
import { fetchPrayerTimings } from './services/prayerService.ts';

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
      <div className="flex items-center gap-3">
        <span className="text-6xl font-black tracking-tighter text-black">QALB</span>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
          <path d="M12 2.5C10.5 6.5 7.5 8 7.5 12C7.5 14.5 8.5 16 8.5 16V21.5H11.5V17.5C11.5 17 11.7 16.5 12 16.5C12.3 16.5 12.5 17 12.5 17.5V21.5H15.5V16C15.5 16 16.5 14.5 16.5 12C16.5 8 13.5 6.5 12 2.5Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
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
      <div className="bg-white w-full max-w-sm rounded-[24px] p-8 shadow-2xl space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg shadow-black/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight">Prayer Alerts</h2>
            <h3 className="text-sm font-bold opacity-40 uppercase tracking-widest">নামাজের সর্তকবার্তা</h3>
          </div>
          <p className="text-xs font-medium leading-relaxed text-black/60">
            Get notified when prayer time starts.
            <br/><span className="font-bold">নামাজ শুরু হলে সর্তকবার্তা পান।</span>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={handleEnable} className="w-full bg-black text-white py-4 rounded-[12px] text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all">Enable / চালু করুন</button>
          <button onClick={handleLater} className="w-full bg-black/5 text-black py-4 rounded-[12px] text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all">Later / পরে করব</button>
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
  const [notifsEnabled, setNotifsEnabled] = useState(localStorage.getItem('qalb_notifs') === 'true');
  const [globalTimings, setGlobalTimings] = useState<PrayerTimings | null>(null);

  const loadTimings = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchPrayerTimings(pos.coords.latitude, pos.coords.longitude)
          .then(setGlobalTimings)
          .catch(err => console.error("Timings Fetch Error:", err));
      }, (err) => {
        console.warn("Location permission denied.");
      }, { timeout: 10000 });
    }
  };

  useEffect(() => {
    loadTimings();

    const splashTimer = setTimeout(() => {
      setIsSplashVisible(false);
      if (!localStorage.getItem('qalb_notif_prompted')) {
        setShowNotifPrompt(true);
      }
    }, 2500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadTimings();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(splashTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (notifsEnabled && globalTimings) {
      notificationService.scheduleDailyNotifications(globalTimings);
    }
  }, [notifsEnabled, globalTimings]);

  const handleToggleNotifs = async () => {
    if (!notifsEnabled) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setNotifsEnabled(true);
        localStorage.setItem('qalb_notifs', 'true');
        notificationService.playBell();
        if (globalTimings) notificationService.scheduleDailyNotifications(globalTimings);
      }
    } else {
      setNotifsEnabled(false);
      localStorage.setItem('qalb_notifs', 'false');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home timingsFromParent={globalTimings} />;
      case 'prayer': return <PrayerTimes timingsFromParent={globalTimings} />;
      case 'dua': return <DuaView />;
      case 'quran': return <Quran onSelectSurah={(s) => { setSelectedSurah(s); setCurrentView('surah-detail'); }} />;
      case 'surah-detail': return selectedSurah ? <SurahDetail surah={selectedSurah} onBack={() => setCurrentView('quran')} /> : <Home timingsFromParent={globalTimings} />;
      default: return <Home timingsFromParent={globalTimings} />;
    }
  };

  return (
    <>
      {isSplashVisible && <SplashScreen />}
      {showNotifPrompt && <NotificationPrompt onComplete={(e) => { setShowNotifPrompt(false); setNotifsEnabled(e); }} />}
      <Layout 
        currentView={currentView} 
        onNavigate={setCurrentView}
        title={currentView === 'surah-detail' ? selectedSurah?.englishName : currentView}
        notifsEnabled={notifsEnabled}
        onToggleNotifs={handleToggleNotifs}
      >
        {renderView()}
      </Layout>
    </>
  );
};

export default App;
