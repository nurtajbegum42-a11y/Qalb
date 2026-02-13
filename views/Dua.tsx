
import React, { useState, useEffect } from 'react';
import { ALL_DUAS } from '../services/duaService.ts';
import { ICONS } from '../constants.tsx';
import { Dua } from '../types.ts';

const CATEGORIES = ['All', 'Ramadan', 'Ruqyah', 'Salah', 'Saved'] as const;
type Category = typeof CATEGORIES[number];

const DuaView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Category>('All');
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('qalb_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load bookmarks", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('qalb_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id: number) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const getFilteredDuas = () => {
    let baseList = ALL_DUAS;
    
    if (activeTab === 'Ruqyah') {
      baseList = ALL_DUAS.filter(d => d.isRuqyah === true || d.category === 'Ruqyah');
    } else if (activeTab === 'Saved') {
      baseList = ALL_DUAS.filter(d => bookmarks.includes(d.id));
    } else if (activeTab !== 'All') {
      baseList = ALL_DUAS.filter(d => d.category === activeTab);
    }

    return baseList.filter(d => 
      d.title.toLowerCase().includes(search.toLowerCase()) || 
      d.category?.toLowerCase().includes(search.toLowerCase()) ||
      d.english.toLowerCase().includes(search.toLowerCase()) ||
      d.reference?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredDuas = getFilteredDuas();

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500">
      {/* Controls Container */}
      <div className="p-6 space-y-6 bg-white border-b border-black/[0.05]">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <ICONS.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search 500+ Duas, Ruqyah, Namaj..."
            className="w-full pl-12 pr-6 py-4 bg-white rounded-[12px] shadow-sm border border-black/[0.08] focus:ring-1 focus:ring-black transition-all placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Scrollable Category Bar */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar -mx-6 px-6">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-none px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all ${activeTab === cat ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/5 hover:border-black/20'}`}
            >
              {cat} {cat === 'Saved' ? `(${bookmarks.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable List Content */}
      <div className="p-6 space-y-6">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => {
            const isBookmarked = bookmarks.includes(dua.id);
            return (
              <div key={dua.id} className="bg-white rounded-[12px] p-8 shadow-sm border border-black/[0.05] space-y-5 group relative active:scale-[0.99] transition-transform">
                <div className="flex justify-between items-start border-b border-black/[0.03] pb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{dua.title}</span>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[7px] bg-black/5 px-2 py-0.5 rounded-full font-black uppercase tracking-widest text-black/40">{dua.category}</span>
                      {dua.isRuqyah && <span className="text-[7px] bg-black text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Ruqyah</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleBookmark(dua.id)}
                    className="p-2 -mt-2 -mr-2 transition-transform active:scale-75"
                  >
                    {isBookmarked ? <ICONS.BookmarkSolid /> : <ICONS.BookmarkOutline />}
                  </button>
                </div>
                
                <p className="text-right font-arabic text-2xl leading-loose py-2 selectable" dir="rtl">{dua.arabic}</p>
                
                <div className="space-y-4 pt-2 border-t border-black/[0.02]">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest block opacity-20 mb-1">Meaning (Bengali)</span>
                    <p className="text-sm font-bold leading-relaxed text-black/90 selectable">{dua.bangla}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest block opacity-20 mb-1">Meaning (English)</span>
                    <p className="text-sm italic opacity-60 leading-relaxed text-black/80 selectable">{dua.english}</p>
                  </div>
                  
                  {(dua.benefit_bn || dua.benefit_en) && (
                    <div className="p-4 bg-black/[0.02] rounded-[10px] border border-black/[0.03] space-y-2">
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-40 block mb-1">Virtue / Benefit</span>
                       {dua.benefit_bn && <p className="text-[11px] leading-relaxed font-bold selectable">{dua.benefit_bn}</p>}
                       {dua.benefit_en && <p className="text-[11px] leading-relaxed italic opacity-70 selectable">{dua.benefit_en}</p>}
                    </div>
                  )}
                </div>

                {dua.reference && (
                  <div className="pt-3 border-t border-black/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Reference:</span>
                      <span className="text-[9px] font-bold opacity-30 italic">{dua.reference}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
            <div className="opacity-10 scale-150">
              <ICONS.Search />
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-30">
              No results in {activeTab}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuaView;
