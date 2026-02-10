
import React from 'react';
import { Dua } from './types';

export const DAILY_DUAS: Dua[] = [
  {
    id: 1,
    title: "Morning Protection",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ অَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    bangla: "হে আল্লাহ! আপনার রহমতেই আমরা সকালে উপনীত হই, আপনার রহমতেই সন্ধ্যায় উপনীত হই, আপনার রহমতেই আমরা জীবন ধারণ করি এবং আপনার ইচ্ছাতেই আমরা মৃত্যুবরণ করি। আপনার কাছেই ফিরে যেতে হবে।",
    english: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
    category: "Morning"
  },
  {
    id: 2,
    title: "Before Sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ অَمُوتُ وَঅَحْيَا",
    bangla: "হে আল্লাহ! আপনার নাম নিয়ে আমি মৃত্যুবরণ করছি (ঘুমাচ্ছি) এবং আপনার নাম নিয়ে আমি জাগ্রত হব।",
    english: "In Your name, O Allah, I die and I live.",
    category: "Evening"
  },
  {
    id: 3,
    title: "For Knowledge",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    bangla: "হে আমার রব! আমার জ্ঞান বৃদ্ধি করে দিন।",
    english: "My Lord, increase me in knowledge.",
    category: "Quranic"
  }
];

export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export const ICONS = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Prayer: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Dua: () => <span className="text-xl leading-none">🤲</span>,
  Quran: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Back: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  BookmarkOutline: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>,
  BookmarkSolid: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Logo: () => (
    <div className="flex items-center gap-2 select-none group">
      <span className="text-2xl font-black tracking-tighter text-black">QALB</span>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-active:scale-90">
        <path d="M12 2.5C10.5 6.5 7.5 8 7.5 12C7.5 14.5 8.5 16 8.5 16V21.5H11.5V17.5C11.5 17 11.7 16.5 12 16.5C12.3 16.5 12.5 17 12.5 17.5V21.5H15.5V16C15.5 16 16.5 14.5 16.5 12C16.5 8 13.5 6.5 12 2.5Z" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 21.5V17.5C11.5 17 11.7 16.5 12 16.5C12.3 16.5 12.5 17 12.5 17.5V21.5" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
};
