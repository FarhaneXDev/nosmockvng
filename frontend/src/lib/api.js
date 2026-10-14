import { DEFAULT_JOURNEY_DAYS, DEFAULT_STRATEGIES } from './constants';

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `http://${window.location.hostname}:8000/api`;
  }
  return 'http://127.0.0.1:8000/api';
};

// Helper for local storage persistence as resilient fallback/cache
const getLocal = (key, defaultVal) => {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(`nosmokvng_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocal = (key, val) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`nosmokvng_${key}`, JSON.stringify(val));
  } catch (e) {}
};

async function fetchWithFallback(endpoint, options = {}, localKey, defaultFallback) {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (res.ok) {
      if (res.status === 204) return null;
      const data = await res.json();
      if (localKey) setLocal(localKey, data);
      return data;
    }
    throw new Error(`API error ${res.status}`);
  } catch (err) {
    // Return cached/local fallback if available
    if (localKey) {
      const cached = getLocal(localKey, defaultFallback);
      if (cached !== undefined && cached !== null) {
        if (Array.isArray(defaultFallback) && Array.isArray(cached) && cached.length === 0 && defaultFallback.length > 0) {
          return defaultFallback;
        }
        return cached;
      }
    }
    return defaultFallback;
  }
}

export const api = {
  // Profil
  getProfile: async () => {
    return fetchWithFallback('/profile/', {}, 'profile', null);
  },
  updateProfile: async (profileData) => {
    setLocal('profile', { ...getLocal('profile', {}), ...profileData });
    return fetchWithFallback('/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, 'profile');
  },

  // Stats
  getStats: async () => {
    return fetchWithFallback('/stats/', {}, 'stats', null);
  },

  // Journal des envies (Cravings)
  getCravings: async (trigger = null) => {
    const query = trigger ? `?trigger=${encodeURIComponent(trigger)}` : '';
    return fetchWithFallback(`/cravings/${query}`, {}, 'cravings', []);
  },
  createCraving: async (cravingData) => {
    const localList = getLocal('cravings', []);
    const optimistic = { id: Date.now(), occurred_at: new Date().toISOString(), ...cravingData };
    setLocal('cravings', [optimistic, ...localList]);

    try {
      return await fetchWithFallback('/cravings/', {
        method: 'POST',
        body: JSON.stringify(cravingData),
      }, 'cravings');
    } catch (e) {
      return optimistic;
    }
  },
  deleteCraving: async (id) => {
    const localList = getLocal('cravings', []);
    setLocal('cravings', localList.filter(c => c.id !== id));
    return fetchWithFallback(`/cravings/${id}/`, { method: 'DELETE' });
  },

  // Check-in du jour
  getTodayCheckIn: async () => {
    return fetchWithFallback('/checkins/today/', {}, 'today_checkin', {
      morning_intention: '',
      morning_risk: '',
      morning_strategy: '',
      evening_cigarettes_smoked: 0,
      evening_cravings_managed: 0,
      mood_rating: 4,
      evening_learning: '',
      evening_adjustment: '',
    });
  },
  updateTodayCheckIn: async (data) => {
    setLocal('today_checkin', { ...getLocal('today_checkin', {}), ...data });
    return fetchWithFallback('/checkins/today/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, 'today_checkin');
  },

  // Stratégies
  getStrategies: async (trigger = null) => {
    const query = trigger ? `?trigger=${encodeURIComponent(trigger)}` : '';
    return fetchWithFallback(`/strategies/${query}`, {}, 'strategies', DEFAULT_STRATEGIES);
  },

  // Faux pas (Relapse)
  getRelapses: async () => {
    return fetchWithFallback('/relapses/', {}, 'relapses', []);
  },
  createRelapse: async (data) => {
    const localList = getLocal('relapses', []);
    const optimistic = { id: Date.now(), occurred_at: new Date().toISOString(), ...data };
    setLocal('relapses', [optimistic, ...localList]);
    return fetchWithFallback('/relapses/', {
      method: 'POST',
      body: JSON.stringify(data),
    }, 'relapses');
  },

  // Rappels
  getReminders: async () => {
    return fetchWithFallback('/reminders/', {}, 'reminders', []);
  },
  createReminder: async (data) => {
    return fetchWithFallback('/reminders/', {
      method: 'POST',
      body: JSON.stringify(data),
    }, 'reminders');
  },
  updateReminder: async (id, data) => {
    return fetchWithFallback(`/reminders/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, 'reminders');
  },
  deleteReminder: async (id) => {
    return fetchWithFallback(`/reminders/${id}/`, { method: 'DELETE' });
  },

  // Parcours 30 jours
  getJourney: async () => {
    return fetchWithFallback('/journey/', {}, 'journey', DEFAULT_JOURNEY_DAYS);
  },
  toggleJourneyDay: async (dayNumber) => {
    const journey = getLocal('journey', DEFAULT_JOURNEY_DAYS);
    const updated = journey.map(d => d.day_number === dayNumber ? { ...d, completed: !d.completed } : d);
    setLocal('journey', updated);
    return fetchWithFallback(`/journey/${dayNumber}/toggle/`, { method: 'POST' });
  },

  // Exportation & Réinitialisation
  exportDataUrl: (format = 'json') => {
    return `${getApiBase()}/export/?format=${format}`;
  },
  resetData: async () => {
    if (typeof window !== 'undefined') {
      ['cravings', 'today_checkin', 'relapses', 'journey'].forEach(k => {
        localStorage.removeItem(`nosmokvng_${k}`);
      });
    }
    return fetchWithFallback('/reset/', { method: 'POST' });
  },
};
