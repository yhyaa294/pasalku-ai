// Font loading optimization
let hasLoadedFonts = false

function loadFonts() {
  if (hasLoadedFonts) return
  
  const fontLinks = [
    {
      rel: 'preload',
      href: '/fonts/geist-sans.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'preload',  
      href: '/fonts/geist-mono.woff2',
      as: 'font', 
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    }
  ]

  fontLinks.forEach(font => {
    const link = document.createElement('link')
    Object.entries(font).forEach(([key, value]) => {
      link[key] = value
    })
    document.head.appendChild(link)
  })

  hasLoadedFonts = true
}

// CSS loading optimization
let hasLoadedCriticalCSS = false

function loadCriticalCSS() {
  if (hasLoadedCriticalCSS) return
  
  const styles = [
    '/styles/critical.css'
  ]

  styles.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  })

  hasLoadedCriticalCSS = true
}

// Theme initialization
let hasInitializedTheme = false

function initializeTheme() {
  if (hasInitializedTheme) return

  const root = document.documentElement
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  // Prevent flash by setting theme immediately
  if (localStorage.theme === 'dark' || (!localStorage.theme && darkModeMediaQuery.matches)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  // Set initial transition state
  root.setAttribute('data-theme-transitioning', 'true')
  
  // Remove transition state after animation
  setTimeout(() => {
    root.removeAttribute('data-theme-transitioning')
  }, 200)

  hasInitializedTheme = true
}

// Main initialization
export function initializeApp() {
  loadFonts()
  loadCriticalCSS() 
  initializeTheme()
  
  // Remove no-js class
  document.documentElement.classList.remove('no-js')
}