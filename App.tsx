
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import PrayerTimes from './views/PrayerTimes';
import DuaView from './views/Dua';
import Quran from './views/Quran';
import SurahDetail from './views/SurahDetail';
import { View, Surah } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

  const navigateToSurah = (surah: Surah) => {
    setSelectedSurah(surah);
    setCurrentView('surah-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home />;
      case 'prayer': return <PrayerTimes />;
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
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      title={getTitle()}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
