
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

// Fixed: Added Surah interface for Quran functionality
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Fixed: Added Ayah interface with optional translation and tafsir fields
export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
  audio?: string;
  translation_bn?: string;
  translation_en?: string;
  tafsir_bn?: string;
  tafsir_en?: string;
  lesson_bn?: string;
  lesson_en?: string;
}

export interface Dua {
  id: number;
  title: string;
  arabic: string;
  bangla: string;
  english: string;
  category?: string;
  reference?: string;
  benefit_bn?: string;
  benefit_en?: string;
  isRuqyah?: boolean;
}

export type View = 'home' | 'prayer' | 'dua' | 'quran' | 'surah-detail';
