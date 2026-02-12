
import React, { useState, useEffect } from 'react';
import { ALL_DUAS } from '../services/duaService.ts';
import { ICONS } from '../constants.tsx';
import { Dua } from '../types.ts';

const DuaView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'ruqyah' | 'bookmarks'>('all');
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
    
    if (activeTab === 'ruqyah') {
      baseList = ALL_DUAS.filter(d => d.isRuqyah === true);
    } else if (activeTab === 'bookmarks') {
      baseList = ALL_DUAS.filter(d => bookmarks.includes(d.id));
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
      {/* Controls Container - Non-sticky for maximum scrolling reliability */}
      <div className="p-6 space-y-6 bg-white border-b border-black/[0.02]">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <ICONS.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search Duas & Ruqyah..."
            className="w-full pl-12 pr-6 py-4 bg-white rounded-[10px] shadow-sm shadow-black/[0.02] border border-black/[0.05] focus:ring-1 focus:ring-black transition-all placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white p-1 rounded-[10px] border border-black/[0.05] flex shadow-sm gap-1">
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.1em] rounded-[8px] transition-all duration-300 ${activeTab === 'all' ? 'bg-black text-white shadow-md' : 'opacity-40'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('ruqyah')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.1em] rounded-[8px] transition-all duration-300 ${activeTab === 'ruqyah' ? 'bg-black text-white shadow-md' : 'opacity-40'}`}
          >
            Ruqyah
          </button>
          <button 
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.1em] rounded-[8px] transition-all duration-300 ${activeTab === 'bookmarks' ? 'bg-black text-white shadow-md' : 'opacity-40'}`}
          >
            Saved ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Scrollable List Content */}
      <div className="p-6 space-y-6">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => {
            const isBookmarked = bookmarks.includes(dua.id);
            return (
              <div key={dua.id} className="bg-white rounded-[10px] p-8 shadow-md shadow-black/[0.03] border border-black/[0.03] space-y-5 group relative">
                <div className="flex justify-between items-center border-b border-black/[0.03] pb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest">{dua.title}</span>
                    <span className="text-[8px] opacity-30 uppercase font-black tracking-widest mt-0.5">{dua.category}</span>
                  </div>
                  <button 
                    onClick={() => toggleBookmark(dua.id)}
                    className="p-2 -mr-2 transition-transform active:scale-75"
                  >
                    {isBookmarked ? <ICONS.BookmarkSolid /> : <ICONS.BookmarkOutline />}
                  </button>
                </div>
                
                <p className="text-right font-arabic text-2xl leading-loose py-2 selectable" dir="rtl">{dua.arabic}</p>
                
                <div className="space-y-4 pt-2 border-t border-black/[0.01]">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest block opacity-30 mb-1">Bangla Meaning</span>
                    <p className="text-sm font-medium leading-relaxed text-black/90 selectable">{dua.bangla}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest block opacity-30 mb-1">English Translation</span>
                    <p className="text-sm italic opacity-70 leading-relaxed text-black/80 selectable">{dua.english}</p>
                  </div>
                  
                  {(dua.benefit_bn || dua.benefit_en) && (
                    <div className="p-4 bg-black/[0.02] rounded-[8px] border border-black/[0.03] space-y-2">
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-50 block mb-1">Benefit</span>
                       {dua.benefit_bn && <p className="text-[11px] leading-relaxed font-bold selectable">{dua.benefit_bn}</p>}
                       {dua.benefit_en && <p className="text-[11px] leading-relaxed italic opacity-70 selectable">{dua.benefit_en}</p>}
                    </div>
                  )}
                </div>

                {dua.reference && (
                  <div className="pt-3 border-t border-black/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Source</span>
                      <span className="text-[9px] font-bold opacity-40 italic">{dua.reference}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-[10px] border border-black/[0.03] shadow-inner px-12 text-center">
            <div className="opacity-10 scale-[2]">
              {activeTab === 'bookmarks' ? <ICONS.BookmarkOutline /> : <ICONS.Search />}
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-30">
              {activeTab === 'bookmarks' 
                ? "No saved remembrances" 
                : "No matching results found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuaView;
