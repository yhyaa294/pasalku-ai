/**
 * Safe Storage Utilities
 * 
 * Provides safe access to browser storage APIs with SSR compatibility
 */

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return null
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error)
      return false
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
      return false
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('Error clearing localStorage:', error)
      return false
    }
  }
}

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    
    try {
      return sessionStorage.getItem(key)
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
      return null
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      sessionStorage.setItem(key, value)
      return true
    } catch (error) {
      console.warn(`Error writing sessionStorage key "${key}":`, error)
      return false
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      sessionStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error)
      return false
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      sessionStorage.clear()
      return true
    } catch (error) {
      console.warn('Error clearing sessionStorage:', error)
      return false
    }
  }
}

/**
 * Check if code is running in browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

/**
 * Check if code is running on server
 */
export const isServer = (): boolean => {
  return typeof window === 'undefined'
}

/**
 * Safe window object access
 */
export const safeWindow = (): Window | null => {
  return typeof window !== 'undefined' ? window : null
}

/**
 * Safe document object access
 */
export const safeDocument = (): Document | null => {
  return typeof document !== 'undefined' ? document : null
}

/**
 * Safe navigator object access
 */
export const safeNavigator = (): Navigator | null => {
  return typeof navigator !== 'undefined' ? navigator : null
}
