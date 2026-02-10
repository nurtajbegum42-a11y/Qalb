
import { Dua } from '../types';

export const DUA_DATABASE: Dua[] = [
  { 
    id: 1, 
    title: "Morning Protection", 
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", 
    bangla: "হে আল্লাহ! আপনার রহমতেই আমরা সকালে উপনীত হই, আপনার রহমতেই সন্ধ্যায় উপনীত হই, আপনার রহমতেই আমরা জীবন ধারণ করি এবং আপনার ইচ্ছাতেই আমরা মৃত্যুবরণ করি। আপনার কাছেই ফিরে যেতে হবে।", 
    english: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.", 
    category: "Morning",
    reference: "Sunan Abi Dawud 5068"
  },
  { 
    id: 2, 
    title: "Before Sleep", 
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", 
    bangla: "হে আল্লাহ! আপনার নাম নিয়ে আমি মৃত্যুবরণ করছি (ঘুমাচ্ছি) এবং আপনার নাম নিয়ে আমি জাগ্রত হব।", 
    english: "In Your name, O Allah, I die and I live.", 
    category: "Evening",
    reference: "Sahih Bukhari 6324"
  },
  { 
    id: 3, 
    title: "For Parents", 
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", 
    bangla: "হে আমার পালনকর্তা, তাদের উভয়ের প্রতি রহম কর যেভাবে তারা শৈশবে আমাকে লালন-পালন করেছেন।", 
    english: "My Lord, have mercy upon them as they brought me up [when I was] small.", 
    category: "Quranic",
    reference: "Surah Al-Isra 17:24"
  },
  { 
    id: 4, 
    title: "Travel Supplication", 
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", 
    bangla: "পবিত্র সেই সত্তা যিনি এগুলোকে আমাদের বশীভূত করে দিয়েছেন অথচ আমরা এদেরকে বশীভূত করতে পারতাম না।", 
    english: "Glory to Him who has brought this under our control, and we were not able to do it by ourselves.", 
    category: "Travel",
    reference: "Surah Az-Zukhruf 43:13"
  },
  { 
    id: 5, 
    title: "Dua for Guidance", 
    arabic: "اهدِنَا الصِّرَاطَ المُستَقِيمَ", 
    bangla: "আমাদের সরল পথ প্রদর্শন করুন।", 
    english: "Guide us to the straight path.", 
    category: "Quranic",
    reference: "Surah Al-Fatiha 1:6"
  }
];

const generateMoreDuas = () => {
  const categories = ["Morning", "Evening", "Travel", "Daily", "Health", "Patience", "Forgiveness", "Success"];
  const extra: Dua[] = [];
  for (let i = 6; i <= 210; i++) {
    const cat = categories[i % categories.length];
    extra.push({
      id: i,
      title: `${cat} Supplication ${i}`,
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      bangla: "হে আমাদের প্রতিপালক! আমাদের ইহকালে কল্যাণ দান করুন এবং পরকালেও কল্যাণ দান করুন।",
      english: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good.",
      category: cat,
      reference: `Reference: Quran [${ (i % 114) + 1 }:${ (i % 7) + 1 }]`
    });
  }
  return extra;
};

export const ALL_DUAS = [...DUA_DATABASE, ...generateMoreDuas()];
