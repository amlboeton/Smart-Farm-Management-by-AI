/**
 * Safe local storage utility for AgriPulse Smart Farm Management Platform.
 * Supports persistent saving across local sessions, Antigravity IDE, and browser reloads.
 */

export const STORAGE_KEYS = {
  ZONES: 'agripulse_zones_v4',
  SELECTED_ZONE_ID: 'agripulse_selected_zone_id_v4',
  ACTIVE_TAB: 'agripulse_active_tab_v1',
  DIAGNOSIS_HISTORY: 'agripulse_diagnosis_history_v1',
  AGRONOMIST_MESSAGES: 'agripulse_agronomist_messages_v1',
  IRRIGATION_EVENTS: 'agripulse_irrigation_events_v1',
};

export function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeStoredItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}

export function clearAllAgriPulseStorage(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
}
