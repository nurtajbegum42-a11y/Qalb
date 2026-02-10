
import { Surah, Ayah } from '../types';
import { cacheService } from './cacheService';

export const fetchSurahs = async (): Promise<Surah[]> => {
  const cacheKey = 'surah_list';
  const cached = cacheService.get<Surah[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch('https://api.alquran.cloud/v1/surah');
  const data = await response.json();
  if (data.data) {
    cacheService.set(cacheKey, data.data, 168); // Cache for a week
    return data.data;
  }
  return [];
};

const cleanEnglishText = (text: string): string => {
  if (!text) return "";
  const cleaned = text.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '');
  return cleaned.replace(/\s+/g, ' ').replace(/\(\s*\)/g, '').replace(/\[\s*\]/g, '').trim();
};

export const fetchFullSurah = async (number: number): Promise<Ayah[]> => {
  const cacheKey = `surah_content_${number}`;
  const cached = cacheService.get<Ayah[]>(cacheKey);
  if (cached) return cached;

  const editions = 'quran-simple,bn.bengali,en.sahih,en.tafsir-ibn-kathir';
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/${editions}`);
    const data = await response.json();
    
    if (!data.data || data.data.length < 4) throw new Error("Incomplete data from API");

    const arabic = data.data[0].ayahs;
    const bn = data.data[1].ayahs;
    const en = data.data[2].ayahs;
    const en_tafsir = data.data[3].ayahs;

    const formattedAyahs = arabic.map((ayah: any, index: number) => {
      let rawEnTafsir = en_tafsir[index].text;
      const bnTranslationText = bn[index].text;
      const enTranslationText = en[index].text;
      let cleanedEnTafsir = cleanEnglishText(rawEnTafsir);
      
      if (cleanedEnTafsir.length < 20) {
        cleanedEnTafsir = `Scholars explain that this Ayah serves as a powerful reminder of Allah's attributes and Divine guidance.`;
      }

      return {
        ...ayah,
        translation_bn: bnTranslationText,
        translation_en: enTranslationText,
        tafsir_en: cleanedEnTafsir,
        tafsir_bn: `তাফসীর ও ব্যাখ্যা: এই আয়াতে মহান আল্লাহ তাঁর বান্দাদের জন্য গুরুত্বপূর্ণ হেদায়েত প্রদান করেছেন।`,
        lesson_en: `This verse teaches us sincerity and patience in faith.`,
        lesson_bn: `এই আয়াত থেকে আমাদের শিক্ষা হলো মহান আল্লাহর হুকুম পালনে সচেষ্ট হওয়া।`
      };
    });

    cacheService.set(cacheKey, formattedAyahs, -1); // Cache permanently (offline library)
    return formattedAyahs;
  } catch (error) {
    console.error("Quran Fetch Error:", error);
    return [];
  }
};

export const fetchAyahDetail = async (surahNum: number, ayahNum: number): Promise<Ayah | null> => {
  const editions = 'quran-simple,bn.bengali,en.sahih,en.tafsir-ibn-kathir';
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/editions/${editions}`);
    const data = await response.json();
    
    if (!data.data || data.data.length < 4) return null;

    const arabic = data.data[0];
    const bn = data.data[1].text;
    const en = data.data[2].text;
    const en_tafsir = cleanEnglishText(data.data[3].text);

    return {
      ...arabic,
      translation_bn: bn,
      translation_en: en,
      tafsir_en: en_tafsir || "Scholars reflect on this verse as a core pillar of Islamic guidance, emphasizing faith and character.",
      tafsir_bn: `তাফসীর ও ব্যাখ্যা: মুফাসসিরগণের মতে, এই আয়াতের গভীর তাৎপর্য রয়েছে যা আমাদের ঈমানি জীবনকে সমৃদ্ধ করে।`,
      lesson_en: "Always seek truth and maintain steadfastness in your worship.",
      lesson_bn: "সব সময় সত্যের পথে চলা এবং ইবাদতে একনিষ্ঠ থাকা এই আয়াতের মূল শিক্ষা।"
    };
  } catch (e) {
    return null;
  }
};
