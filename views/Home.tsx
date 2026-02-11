
import React, { useState, useEffect } from 'react';
import { fetchPrayerTimings, getNextPrayer } from '../services/prayerService';
import { fetchAyahDetail } from '../services/quranService';
import { cacheService } from '../services/cacheService';
import { PrayerTimings, Ayah } from '../types';
import { DAILY_DUAS } from '../constants';

const Home: React.FC = () => {
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [countdown, setCountdown] = useState<string>('00:00:00');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [dailyTafsir, setDailyTafsir] = useState<Ayah | null>(null);
  const [tafsirTab, setTafsirTab] = useState<'bn' | 'en'>('bn');

  useEffect(() => {
    const loadData = () => {
      // Load Prayer Timings
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchPrayerTimings(pos.coords.latitude, pos.coords.longitude)
            .then(setTimings)
            .catch(() => setLocationError("API Error. Please try again."));
        },
        () => setLocationError("Enable Location for accurate timings.")
      );

      // Load Daily Tafsir
      const dateKey = new Date().toISOString().split('T')[0];
      const cacheKey = `daily_tafsir_${dateKey}`;
      const cachedTafsir = cacheService.get<Ayah>(cacheKey);

      if (cachedTafsir) {
        setDailyTafsir(cachedTafsir);
      } else {
        // Selection logic: pick a surah/ayah based on day of year
        const start = new Date(new Date().getFullYear(), 0, 0);
        const diff = new Date().getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        // Pick from some meaningful Ayahs (Surah:Ayah)
        const meaningfulAyahs = [
          [1, 1], [2, 255], [2, 286], [3, 191], [4, 135], [5, 3], [6, 162], [7, 54],
          [8, 2], [9, 128], [10, 62], [11, 114], [12, 101], [13, 28], [14, 7], [15, 9]
        ];
        const [s, a] = meaningfulAyahs[dayOfYear % meaningfulAyahs.length];
        
        fetchAyahDetail(s, a).then(data => {
          if (data) {
            setDailyTafsir(data);
            cacheService.set(cacheKey, data, 24);
          }
        });
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (timings) {
      const interval = setInterval(() => {
        const next = getNextPrayer(timings);
        setNextPrayer(next);
        
        const now = new Date().getTime();
        const diff = next.time.getTime() - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
          const secs = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
          setCountdown(`${hours}:${mins}:${secs}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timings]);

  const bannerDua = DAILY_DUAS[new Date().getDate() % DAILY_DUAS.length];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* 1. Daily Changing Banner */}
      <section className="bg-white rounded-[10px] p-6 shadow-md shadow-black/[0.03] space-y-4 border border-black/[0.03]">
        <div className="flex justify-between items-center border-b border-black/[0.03] pb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dua of the Day</span>
          <span className="text-[10px] opacity-40">{new Date().toLocaleDateString()}</span>
        </div>
        <h2 className="text-2xl font-arabic text-right leading-relaxed pt-2" dir="rtl">{bannerDua.arabic}</h2>
        <div className="space-y-2">
          <p className="text-xs font-bold leading-relaxed">{bannerDua.bangla}</p>
          <p className="text-xs italic leading-relaxed opacity-70">{bannerDua.english}</p>
        </div>
      </section>

      {/* 2. Next Prayer with Live Countdown */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Coming Up Next</h3>
        {locationError ? (
          <div className="bg-white rounded-[10px] p-6 text-center text-xs uppercase tracking-widest shadow-sm border border-black/[0.03]">{locationError}</div>
        ) : (
          <div className="bg-white rounded-[10px] p-8 flex flex-col items-center justify-center space-y-2 shadow-lg shadow-black/[0.03] border border-black/[0.03]">
            <span className="text-5xl font-black uppercase tracking-tighter">{nextPrayer?.name || '---'}</span>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-6 bg-black rounded-full opacity-10"></div>
              <span className="text-xl font-mono tracking-[0.3em] tabular-nums">{countdown}</span>
              <div className="h-[2px] w-6 bg-black rounded-full opacity-10"></div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Sehri and Iftar Times */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[10px] p-6 flex flex-col items-center shadow-sm shadow-black/[0.02] border border-black/[0.03]">
          <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">Sehri</span>
          <span className="text-2xl font-black">{timings?.Imsak || '--:--'}</span>
        </div>
        <div className="bg-white rounded-[10px] p-6 flex flex-col items-center shadow-sm shadow-black/[0.02] border border-black/[0.03]">
          <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">Iftar</span>
          <span className="text-2xl font-black">{timings?.Maghrib || '--:--'}</span>
        </div>
      </section>

      {/* 4. Horizontal Slider with Daily Useful Duas */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Useful Remembrances</h3>
        <div className="flex overflow-x-auto gap-4 snap-x no-scrollbar">
          {DAILY_DUAS.map((dua) => (
            <div key={dua.id} className="min-w-[85%] snap-center bg-white rounded-[10px] p-6 shadow-md shadow-black/[0.03] space-y-4 border border-black/[0.03]">
              <span className="text-[10px] font-black uppercase tracking-widest block border-b border-black/[0.03] pb-3">{dua.title}</span>
              <p className="text-right font-arabic text-xl" dir="rtl">{dua.arabic}</p>
              <div className="space-y-2">
                <p className="text-[11px] leading-relaxed"><span className="font-bold">BN:</span> {dua.bangla}</p>
                <p className="text-[11px] leading-relaxed italic"><span className="font-bold">EN:</span> {dua.english}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Tafsir of the Day */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Tafsir of the Day</h3>
        <div className="bg-white rounded-[10px] p-6 shadow-lg shadow-black/[0.04] border border-black/[0.05] space-y-6">
          {dailyTafsir ? (
            <>
              <div className="flex justify-between items-start border-b border-black/[0.03] pb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest">Surah Detail</span>
                  <span className="text-[8px] opacity-40 font-black uppercase tracking-widest">Ayah {dailyTafsir.numberInSurah}</span>
                </div>
                <div className="bg-black/5 p-1 rounded-[8px] flex">
                  <button 
                    onClick={() => setTafsirTab('bn')}
                    className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-[6px] transition-all ${tafsirTab === 'bn' ? 'bg-black text-white' : 'opacity-40'}`}
                  >BN</button>
                  <button 
                    onClick={() => setTafsirTab('en')}
                    className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-[6px] transition-all ${tafsirTab === 'en' ? 'bg-black text-white' : 'opacity-40'}`}
                  >EN</button>
                </div>
              </div>

              <p className="text-right font-arabic text-2xl leading-loose" dir="rtl">{dailyTafsir.text}</p>
              
              <div className="space-y-4 bg-black/[0.01] p-4 rounded-[10px] border border-black/[0.02]">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-30 block mb-1">Translation</span>
                  <p className="text-xs font-bold leading-relaxed">
                    {tafsirTab === 'bn' ? dailyTafsir.translation_bn : dailyTafsir.translation_en}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-30 block mb-1">In-depth Tafsir</span>
                  <p className="text-[11px] leading-relaxed opacity-80">
                    {tafsirTab === 'bn' ? dailyTafsir.tafsir_bn : dailyTafsir.tafsir_en}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-10 gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Loading wisdom...</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. Footer / Credit Section */}
      <footer className="pt-10 pb-32 border-t border-black/[0.03] flex flex-col items-center justify-center space-y-2 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20 px-6">
          © 2024-25 QALB. ALL RIGHTS RESERVED.
        </p>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
            CREDIT: <span className="text-black">CODENEST25</span>
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
            DEVELOPER: <span className="text-black">@SIAMAFRID</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
