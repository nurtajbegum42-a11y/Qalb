
import { PrayerTimings } from '../types.ts';
import { cacheService } from './cacheService.ts';

export const fetchPrayerTimings = async (lat: number, lng: number): Promise<PrayerTimings> => {
  const dateKey = new Date().toISOString().split('T')[0];
  const cacheKey = `prayer_${dateKey}_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  
  const cached = cacheService.get<PrayerTimings>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
  const data = await response.json();
  if (data.code === 200) {
    cacheService.set(cacheKey, data.data.timings, 24);
    return data.data.timings;
  }
  throw new Error('Failed to fetch prayer timings');
};

export const getNextPrayer = (timings: PrayerTimings) => {
  const now = new Date();
  const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
  
  for (const key of prayerKeys) {
    const [hours, minutes] = timings[key].split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    
    if (prayerTime > now) {
      return { name: key, time: prayerTime };
    }
  }
  
  const [hours, minutes] = timings.Fajr.split(':').map(Number);
  const tomorrowFajr = new Date();
  tomorrowFajr.setDate(now.getDate() + 1);
  tomorrowFajr.setHours(hours, minutes, 0, 0);
  return { name: 'Fajr', time: tomorrowFajr };
};
