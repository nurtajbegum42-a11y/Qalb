
import React, { useState, useEffect } from 'react';
import { fetchSurahs } from '../services/quranService';
import { Surah } from '../types';
import { ICONS } from '../constants';

interface QuranProps {
  onSelectSurah: (surah: Surah) => void;
}

const Quran: React.FC<QuranProps> = ({ onSelectSurah }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahs().then(data => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.number.toString().includes(search)
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <ICONS.Search />
        </div>
        <input 
          type="text" 
          placeholder="Search Surah (e.g. Al-Fatiha or 1)"
          className="w-full pl-12 pr-6 py-4 bg-white rounded-[10px] shadow-sm shadow-black/[0.02] border border-black/[0.05] focus:ring-1 focus:ring-black transition-all placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
             <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Gathering Surahs...</p>
          </div>
        ) : (
          filteredSurahs.map((surah) => (
            <button 
              key={surah.number}
              onClick={() => onSelectSurah(surah)}
              className="w-full flex justify-between items-center p-5 bg-white rounded-[10px] shadow-sm shadow-black/[0.02] border border-black/[0.03] hover:shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-black w-10 h-10 bg-black text-white flex items-center justify-center rounded-[10px] shadow-md shadow-black/20">{surah.number}</span>
                <div className="text-left">
                  <div className="text-sm font-black uppercase tracking-widest leading-none mb-1">{surah.englishName}</div>
                  <div className="text-[9px] opacity-40 uppercase font-black tracking-widest">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</div>
                </div>
              </div>
              <div className="font-arabic text-2xl">{surah.name}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Quran;
