
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

export interface Dua {
  id: number;
  title: string;
  arabic: string;
  bangla: string;
  english: string;
  category?: string;
  reference?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  translation_bn?: string;
  translation_en?: string;
  tafsir_bn?: string;
  tafsir_en?: string;
  lesson_bn?: string;
  lesson_en?: string;
  audio?: string;
}

export type View = 'home' | 'prayer' | 'dua' | 'quran' | 'surah-detail';
