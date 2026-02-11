
import React, { useState, useEffect, useRef } from 'react';
import { Surah, Ayah } from '../types';
import { fetchFullSurah } from '../services/quranService';
import { ICONS } from '../constants';

interface SurahDetailProps {
  surah: Surah;
  onBack: () => void;
}

const SurahDetail: React.FC<SurahDetailProps> = ({ surah, onBack }) => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [tab, setTab] = useState<'bn' | 'en'>('bn');
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<{ [key: number]: 'tafsir' | 'lesson' | null }>({});
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchFullSurah(surah.number).then(data => {
      setAyahs(data);
      setLoading(false);
    });
    // Scroll handling is now managed by the parent container in Layout.tsx
  }, [surah.number]);

  const toggleSection = (ayahNum: number, section: 'tafsir' | 'lesson') => {
    setExpandedSection(prev => ({
      ...prev,
      [ayahNum]: prev[ayahNum] === section ? null : section
    }));
  };

  const playAyahAudio = (ayah: Ayah) => {
    if (!ayah.audio) return;

    if (playingAyahNumber === ayah.number) {
      if (audioRef.current?.paused) {
        audioRef.current.play();
      } else {
        audioRef.current?.pause();
        setPlayingAyahNumber(null);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(ayah.audio);
    audioRef.current = audio;
    setPlayingAyahNumber(ayah.number);

    audio.play();
    audio.onended = () => {
      setPlayingAyahNumber(null);
    };
    audio.onerror = () => {
      setPlayingAyahNumber(null);
      alert("Failed to play audio. Check your connection.");
    };
  };

  return (
    <div className="min-h-full bg-white flex flex-col animate-in slide-in-from-right duration-400">
      {/* Sticky Header - Offset to align with Layout header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-4 z-40 flex items-center gap-4 shadow-sm shadow-black/[0.02] border-b border-black/[0.02]">
        <button onClick={onBack} className="p-3 bg-white rounded-[10px] shadow-sm border border-black/[0.03] hover:scale-110 active:scale-95 transition-all">
          <ICONS.Back />
        </button>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-lg font-black uppercase tracking-tighter leading-none truncate">{surah.englishName}</h2>
          <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block truncate">{surah.englishNameTranslation}</span>
        </div>
        <div className="text-right flex-shrink-0">
           <div className="font-arabic text-xl">{surah.name}</div>
        </div>
      </div>

      {/* Language Switcher */}
      <div className="px-6 py-4 sticky top-[73px] bg-white/95 backdrop-blur-sm z-30">
        <div className="bg-white p-1.5 rounded-[10px] flex shadow-md shadow-black/[0.03] border border-black/[0.03]">
          <button 
            onClick={() => setTab('bn')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[8px] transition-all duration-300 ${tab === 'bn' ? 'bg-black text-white shadow-md' : 'opacity-40'}`}
          >
            Bangla
          </button>
          <button 
            onClick={() => setTab('en')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[8px] transition-all duration-300 ${tab === 'en' ? 'bg-black text-white shadow-md' : 'opacity-40'}`}
          >
            English
          </button>
        </div>
      </div>

      {/* Ayah List */}
      <div className="flex-1 p-6 space-y-10">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] uppercase font-black tracking-widest animate-pulse">Illuminating Pages...</p>
          </div>
        ) : (
          <>
            {surah.number !== 1 && (
               <div className="text-center font-arabic text-3xl py-10 opacity-70 tracking-[0.5em]">
                 بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
               </div>
            )}
            {ayahs.map((ayah) => (
              <div key={ayah.number} className="group space-y-6 border-b border-black/[0.03] pb-10">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black w-10 h-10 bg-white shadow-sm border border-black/[0.03] flex items-center justify-center rounded-[10px]">
                      {ayah.numberInSurah}
                    </span>
                    <button 
                      onClick={() => playAyahAudio(ayah)}
                      className={`p-3 rounded-[10px] border shadow-sm transition-all active:scale-90 ${playingAyahNumber === ayah.number ? 'bg-black text-white border-black' : 'bg-white text-black border-black/5'}`}
                    >
                      {playingAyahNumber === ayah.number ? <ICONS.Pause /> : <ICONS.Play />}
                    </button>
                  </div>
                  <p className="text-right font-arabic text-3xl leading-[2.8] flex-1 text-black" dir="rtl">
                    {ayah.text}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Translation Card */}
                  <div className="bg-white rounded-[10px] p-6 shadow-sm shadow-black/[0.02] border-l-4 border-black border-y border-r border-black/[0.03]">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30 block mb-2">
                      {tab === 'bn' ? 'অনুবাদ' : 'Translation'}
                    </span>
                    <p className="text-sm font-bold leading-relaxed">
                      {tab === 'bn' ? ayah.translation_bn : ayah.translation_en}
                    </p>
                  </div>
                  
                  {/* Actions (Tafsir & Lesson) */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => toggleSection(ayah.number, 'tafsir')}
                      className={`p-3 rounded-[10px] border flex items-center justify-center gap-2 transition-all ${expandedSection[ayah.number] === 'tafsir' ? 'bg-black text-white border-black shadow-md' : 'bg-white text-black border-black/10'}`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest">{tab === 'bn' ? 'তাফসীর' : 'Tafsir'}</span>
                    </button>

                    <button 
                      onClick={() => toggleSection(ayah.number, 'lesson')}
                      className={`p-3 rounded-[10px] border flex items-center justify-center gap-2 transition-all ${expandedSection[ayah.number] === 'lesson' ? 'bg-black text-white border-black shadow-md' : 'bg-white text-black border-black/10'}`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest">{tab === 'bn' ? 'শিক্ষা' : 'Lesson'}</span>
                    </button>
                  </div>

                  {/* Expanded Content View */}
                  {expandedSection[ayah.number] && (
                    <div className="bg-white rounded-[10px] border border-black/[0.05] p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-4">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-50 block">
                          {expandedSection[ayah.number] === 'tafsir' 
                            ? (tab === 'bn' ? 'বিস্তারিত তাফসীর ও ব্যাখ্যা' : 'In-depth Commentary & Tafsir') 
                            : (tab === 'bn' ? 'এই আয়াতের ব্যবহারিক শিক্ষা' : 'Practical Lessons from Ayah')}
                        </span>
                        <p className="text-xs leading-relaxed opacity-90 font-medium whitespace-pre-wrap">
                          {expandedSection[ayah.number] === 'tafsir' 
                            ? (tab === 'bn' ? ayah.tafsir_bn : ayah.tafsir_en)
                            : (tab === 'bn' ? ayah.lesson_bn : ayah.lesson_en)
                          }
                        </p>
                        <div className="pt-3 border-t border-black/[0.02] flex justify-between items-center">
                           <p className="text-[9px] italic opacity-40">
                             {tab === 'bn' ? 'সূত্র: সহজ কুরআন ও তাফসীর' : 'Source: Quran.com & Ibn Kathir'}
                           </p>
                           {expandedSection[ayah.number] === 'tafsir' && (
                             <span className="text-[8px] font-bold uppercase tracking-widest opacity-30">
                               {tab === 'bn' ? 'ইবনে কাসীর' : 'Ibn Kathir'}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SurahDetail;
