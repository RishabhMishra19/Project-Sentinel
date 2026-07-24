import { localStorageManager } from '../storage/LocalStorageManager'

export type Theme = 'light' | 'dark'

export class ThemeManager {
  static readonly STORAGE_KEY = 'theme'

  apply(theme: Theme): void {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }

  get(): Theme {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }

  readStored(): Theme {
    return localStorageManager.get(ThemeManager.STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  }

  persist(theme: Theme): void {
    localStorageManager.set(ThemeManager.STORAGE_KEY, theme)
  }

  set(theme: Theme): void {
    this.apply(theme)
    this.persist(theme)
  }

  toggle(): Theme {
    const next: Theme = this.get() === 'dark' ? 'light' : 'dark'
    this.set(next)
    return next
  }
}

export const themeManager = new ThemeManager()
