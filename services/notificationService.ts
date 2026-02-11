
import { PrayerTimings } from '../types';

class NotificationService {
  private lastNotified: string | null = null;
  private audioCtx: AudioContext | null = null;

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  playBell() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High A
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Slide to Middle A

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }

  private sendNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0xMiAyLjVDMTAuNSA2LjUgNy41IDggNy41IDEyQzcuNSAxNC41IDguNSAxNiA4LjUgMTZWMjEuNUgxMS41VjE3LjVDMTEuNSAxNyAxMS43IDE2LjUgMTIgMTYuNUMxMi4zIDE2LjUgMTIuNSAxNyAxMi41IDE3LjVWMjEuNUgxNS41VjE2QzE1LjUgMTYgMTYuNSAxNC41IDE2LjUgMTJDMTYuNSA4IDEzLjUgNi41IDEyIDIuNVoiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMS4yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=',
        badge: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiAyMmgKMjBMMTIgMnoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+'
      });
      this.playBell();
    }
  }

  checkTimings(timings: PrayerTimings) {
    const now = new Date();
    const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

    prayerKeys.forEach((key, index) => {
      const timeStr = timings[key];
      const [hours, minutes] = timeStr.split(':').map(Number);
      const prayerTime = new Date(now);
      prayerTime.setHours(hours, minutes, 0, 0);

      // 1. Check for Prayer Start
      const diffStart = Math.floor((now.getTime() - prayerTime.getTime()) / 60000);
      if (diffStart === 0 && this.lastNotified !== `${key}_start`) {
        this.sendNotification(`Qalb: ${key} Started`, `It is now time for ${key} prayer.`);
        this.lastNotified = `${key}_start`;
      }

      // 2. Check for 10 minutes before next prayer (end of current)
      const nextKey = prayerKeys[(index + 1) % prayerKeys.length];
      const nextTimeStr = timings[nextKey];
      const [nH, nM] = nextTimeStr.split(':').map(Number);
      const nextPrayerTime = new Date(now);
      if (index === prayerKeys.length - 1) nextPrayerTime.setDate(now.getDate() + 1);
      nextPrayerTime.setHours(nH, nM, 0, 0);

      const diffEnd = Math.floor((nextPrayerTime.getTime() - now.getTime()) / 60000);
      if (diffEnd === 10 && this.lastNotified !== `${key}_end`) {
        this.sendNotification(`Qalb: ${key} Ending`, `10 minutes left for ${key} prayer before ${nextKey} starts.`);
        this.lastNotified = `${key}_end`;
      }
    });
  }
}

export const notificationService = new NotificationService();
