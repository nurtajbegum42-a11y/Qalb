
import React, { useState, useEffect } from 'react';
import { PrayerTimings } from '../types';
import { PRAYER_NAMES, DAILY_DUAS } from '../constants';

interface PrayerTimesProps {
  timingsFromParent: PrayerTimings | null;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ timingsFromParent }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = (prayerName: string, prayerTimeStr: string) => {
    if (!prayerTimeStr) return '';
    const [h, m] = prayerTimeStr.split(':').map(Number);
    const pTime = new Date();
    pTime.setHours(h, m, 0, 0);
    
    if (pTime < currentTime) return 'Passed';
    
    const diff = pTime.getTime() - currentTime.getTime();
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <section className="space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Daily Prayer Times</h3>
        <div className="space-y-4">
          {PRAYER_NAMES.map((name) => (
            <div key={name} className="bg-white rounded-[10px] p-6 flex justify-between items-center group shadow-sm shadow-black/[0.02] border border-black/[0.03] active:scale-[0.98] transition-all">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{name}</div>
                <div className="text-3xl font-black">{timingsFromParent ? (timingsFromParent as any)[name] : '--:--'}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase font-black tracking-widest opacity-30 mb-1">Countdown</div>
                <div className="text-xs font-mono bg-black text-white px-3 py-1 rounded-[10px]">{timingsFromParent ? getCountdown(name, (timingsFromParent as any)[name]) : '--'}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5 pb-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Prayer Related Duas</h3>
        <div className="space-y-4">
          {DAILY_DUAS.slice(0, 3).map(dua => (
            <div key={dua.id} className="bg-white rounded-[10px] p-6 space-y-4 shadow-md shadow-black/[0.03] border border-black/[0.03]">
               <h4 className="text-[10px] font-black uppercase tracking-widest border-b border-black/[0.03] pb-2">{dua.title}</h4>
               <p className="text-right font-arabic text-xl leading-loose" dir="rtl">{dua.arabic}</p>
               <div className="space-y-2 opacity-80">
                 <p className="text-xs leading-relaxed"><span className="font-bold">BN:</span> {dua.bangla}</p>
                 <p className="text-xs leading-relaxed italic"><span className="font-bold">EN:</span> {dua.english}</p>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PrayerTimes;
