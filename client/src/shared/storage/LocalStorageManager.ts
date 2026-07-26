/**
 * Safe wrapper around window.localStorage.
 * Swallows quota / private-mode failures so callers stay simple.
 */
class LocalStorageManager {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore quota / private-mode failures
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore private-mode failures
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const localStorageManager = new LocalStorageManager();
