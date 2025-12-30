export type LocalStorageKey = "builder-state";

export function saveState(key: LocalStorageKey, payload: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore persistence errors in stub implementation
  }
}

export function loadState<T>(key: LocalStorageKey): T | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}
