import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { themeManager, type Theme } from './ThemeManager'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

type ThemeAction =
  | { type: 'SET'; theme: Theme }
  | { type: 'TOGGLE' }

const ThemeContext = createContext<ThemeContextValue | null>(null)

const themeReducer = (state: Theme, action: ThemeAction): Theme => {
  switch (action.type) {
    case 'SET':
      return action.theme
    case 'TOGGLE':
      return state === 'dark' ? 'light' : 'dark'
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, dispatch] = useReducer(themeReducer, undefined, () => themeManager.get())

  const setTheme = (next: Theme) => {
    themeManager.set(next)
    dispatch({ type: 'SET', theme: next })
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    themeManager.set(next)
    dispatch({ type: 'TOGGLE' })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
