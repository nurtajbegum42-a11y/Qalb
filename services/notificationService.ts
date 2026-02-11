
import { PrayerTimings } from '../types';

class NotificationService {
  private lastScheduledDate: string | null = null;
  private scheduledTimeouts: number[] = [];

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  playBell() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.warn("Audio Context failed (likely user interaction required)");
    }
  }

  async scheduleDailyNotifications(timings: PrayerTimings) {
    const today = new Date().toDateString();
    if (this.lastScheduledDate === today) return; 

    // Clear existing timeouts to avoid duplicates
    this.scheduledTimeouts.forEach(t => clearTimeout(t));
    this.scheduledTimeouts = [];

    if (Notification.permission !== 'granted') return;

    const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    const now = new Date();

    prayerKeys.forEach((key) => {
      const timeStr = (timings as any)[key];
      if (!timeStr) return;

      const [hours, minutes] = timeStr.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      if (prayerTime > now) {
        const delay = prayerTime.getTime() - now.getTime();
        
        const timeout = window.setTimeout(() => {
          this.sendImmediateNotification(`Qalb: ${key} Started`, `It is now time for ${key} prayer.`);
        }, delay);
        
        this.scheduledTimeouts.push(timeout);
      }
    });

    this.lastScheduledDate = today;
  }

  private sendImmediateNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0xMiAyLjVDMTAuNSA2LjUgNy41IDggNy41IDEyQzcuNSAxNC41IDguNSAxNiA4LjUgMTZWMjEuNUgxMS41VjE3LjVDMTEuNSAxNyAxMS43IDE2LjUgMTIgMTYuNUMxMi4zIDE2LjUgMTIuNSAxNyAxMi41IDE3LjVWMjEuNUgxNS41VjE2QzE1LjUgMTYgMTYuNSAxNC41IDE2LjUgMTJDMTYuNSA4IDEzLjUgNi41IDEyIDIuNVoiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMS4yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=',
        });
        this.playBell();
      } catch (e) {
        console.error("Notification delivery failed", e);
      }
    }
  }
}

export const notificationService = new NotificationService();
