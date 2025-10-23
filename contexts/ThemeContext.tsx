'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  mounted: boolean
}

// Type guard for theme validation
function isValidTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper function to safely apply theme to document
function applyThemeToDocument(theme: Theme): void {
  try {
    if (typeof document === 'undefined') return
    
    const { classList } = document.documentElement
    if (theme === 'dark') {
      classList.add('dark')
    } else {
      classList.remove('dark')
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to apply theme to document:', error)
    }
  }
}

// Helper function to safely save theme to localStorage
function saveThemeToStorage(theme: Theme): void {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem('theme', theme)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }
}

// Helper function to get initial theme ONLY on client
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  try {
    const savedTheme = localStorage.getItem('theme')
    if (isValidTheme(savedTheme)) {
      return savedTheme
    }
    
    // Check system preference with proper null checking
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (mediaQuery?.matches) {
      return 'dark'
    }
  } catch (error) {
    // Silently handle errors to prevent hydration mismatch
    return 'light'
  }
  
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with light theme for SSR consistency
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Separate effect for mounting state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Separate effect for theme initialization after mount
  useEffect(() => {
    if (!mounted) return
    
    const initialTheme = getInitialTheme()
    
    // Update state and DOM atomically
    setThemeState(initialTheme)
    applyThemeToDocument(initialTheme)
  }, [mounted])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if no user preference is saved
      try {
        const savedTheme = localStorage.getItem('theme')
        if (!savedTheme) {
          const newTheme = e.matches ? 'dark' : 'light'
          setThemeState(newTheme)
          applyThemeToDocument(newTheme)
        }
      } catch (error) {
        // Silently handle errors
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [mounted])

  // Update theme with proper guards and helper functions
  const setTheme = (newTheme: Theme) => {
    if (!mounted) return // Prevent updates before hydration
    
    setThemeState(newTheme)
    saveThemeToStorage(newTheme)
    applyThemeToDocument(newTheme)
  }

  const toggleTheme = () => {
    if (!mounted) return // Prevent toggle before hydration
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
