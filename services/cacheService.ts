
export const cacheService = {
  set: (key: string, data: any, ttlHours: number = 24) => {
    const item = {
      data,
      expiry: ttlHours === -1 ? -1 : Date.now() + ttlHours * 60 * 60 * 1000,
    };
    localStorage.setItem(`qalb_cache_${key}`, JSON.stringify(item));
  },

  get: <T>(key: string): T | null => {
    const raw = localStorage.getItem(`qalb_cache_${key}`);
    if (!raw) return null;

    try {
      const item = JSON.parse(raw);
      if (item.expiry !== -1 && Date.now() > item.expiry) {
        localStorage.removeItem(`qalb_cache_${key}`);
        return null;
      }
      return item.data as T;
    } catch (e) {
      return null;
    }
  },

  clear: (key: string) => {
    localStorage.removeItem(`qalb_cache_${key}`);
  }
};
