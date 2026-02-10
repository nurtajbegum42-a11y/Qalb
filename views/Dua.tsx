
import React, { useState, useEffect } from 'react';
import { ALL_DUAS } from '../services/duaService';
import { ICONS } from '../constants';

const DuaView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks'>('all');
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // Initialize bookmarks from localStorage
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

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('qalb_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id: number) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const filteredDuas = (activeTab === 'all' ? ALL_DUAS : ALL_DUAS.filter(d => bookmarks.includes(d.id))).filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.category?.toLowerCase().includes(search.toLowerCase()) ||
    d.english.toLowerCase().includes(search.toLowerCase()) ||
    d.reference?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-2 duration-500">
      {/* Search and Tabs Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-30 p-6 space-y-6 shadow-sm shadow-black/[0.02]">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <ICONS.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search Duas (e.g. Morning, Al-Baqarah...)"
            className="w-full pl-12 pr-6 py-4 bg-white rounded-[10px] shadow-sm shadow-black/[0.02] border border-black/[0.05] focus:ring-1 focus:ring-black transition-all placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white p-1 rounded-[10px] border border-black/[0.05] flex shadow-sm">
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[8px] transition-all duration-300 ${activeTab === 'all' ? 'bg-black text-white shadow-md' : 'opacity-40'}`}
          >
            All Duas
          </button>
          <button 
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[8px] transition-all duration-300 ${activeTab === 'bookmarks' ? 'bg-black text-white shadow-md' : 'opacity-40'}`}
          >
            Bookmarks ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="p-6 space-y-6 pb-32">
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
                
                <p className="text-right font-arabic text-2xl leading-loose py-2" dir="rtl">{dua.arabic}</p>
                
                <div className="space-y-4 pt-2 border-t border-black/[0.01]">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest block opacity-30 mb-1">Bangla Meaning</span>
                    <p className="text-sm font-medium leading-relaxed text-black/90">{dua.bangla}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest block opacity-30 mb-1">English Translation</span>
                    <p className="text-sm italic opacity-70 leading-relaxed text-black/80">{dua.english}</p>
                  </div>
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
                ? "Your bookmarked collection is empty" 
                : "No matching remembrances found"}
            </p>
            {activeTab === 'bookmarks' && (
              <button 
                onClick={() => setActiveTab('all')}
                className="text-[9px] uppercase font-black tracking-widest border border-black px-4 py-2 rounded-[8px] active:bg-black active:text-white transition-all"
              >
                Browse All Duas
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DuaView;
