'use client'

import { useState, useEffect, useMemo } from 'react'
import { ClientOnlyWrapper, useClientOnly } from './ClientOnlyWrapper'

interface BrowserInfo {
  userAgent: string
  screenWidth: number
  hasLocalStorage: boolean
  theme: 'light' | 'dark'
}

/**
 * Test page to verify hydration fixes and SSR/CSR consistency
 * Demonstrates proper patterns for avoiding hydration mismatches
 */
export function HydrationTestPage() {
  const isClient = useClientOnly()
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null)

  // Memoize test status to prevent unnecessary re-renders
  const testStatus = useMemo(() => ({
    mounted: isClient,
    message: isClient ? 'Hydration test successful!' : 'Initializing...'
  }), [isClient])

  useEffect(() => {
    if (!isClient) return

    // Safely access browser APIs only after client mount
    const getBrowserInfo = (): BrowserInfo => {
      try {
        return {
          userAgent: navigator.userAgent.substring(0, 50) + '...',
          screenWidth: window.innerWidth,
          hasLocalStorage: typeof localStorage !== 'undefined',
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        }
      } catch (error) {
        console.warn('Error accessing browser APIs:', error)
        return {
          userAgent: 'Unknown',
          screenWidth: 0,
          hasLocalStorage: false,
          theme: 'light'
        }
      }
    }

    setBrowserInfo(getBrowserInfo())
  }, [isClient])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Hydration Test Page
        </h1>
        
        <TestSection
          title="Test 1: Basic Rendering"
          description="This text should appear immediately without hydration errors."
          className="bg-gray-100 dark:bg-gray-800"
        >
          <p className="text-sm text-gray-500 mt-2">
            Status: {testStatus.mounted ? '✅ Mounted' : '⏳ Mounting...'}
          </p>
        </TestSection>

        <TestSection
          title="Test 2: Client-Only Content"
          className="bg-blue-100 dark:bg-blue-900"
        >
          <ClientOnlyWrapper
            fallback={<LoadingIndicator message="Loading client content..." />}
          >
            <div className="text-blue-700 dark:text-blue-300">
              <p>{testStatus.message}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                Current time: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </ClientOnlyWrapper>
        </TestSection>

        <TestSection
          title="Test 3: Browser APIs"
          className="bg-green-100 dark:bg-green-900"
        >
          <ClientOnlyWrapper
            fallback={<LoadingIndicator message="Loading browser info..." />}
          >
            <BrowserInfoDisplay info={browserInfo} />
          </ClientOnlyWrapper>
        </TestSection>

        <TestSection
          title="Test 4: Theme Detection"
          className="bg-purple-100 dark:bg-purple-900"
        >
          <ClientOnlyWrapper
            fallback={<LoadingIndicator message="Detecting theme..." />}
          >
            <p className="text-purple-700 dark:text-purple-300">
              Current theme: {browserInfo?.theme === 'dark' ? 'Dark' : 'Light'}
            </p>
          </ClientOnlyWrapper>
        </TestSection>

        {/* Test Results */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-green-500">
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-4">
            ✅ Test Results
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you can see this page without any console errors about hydration mismatches, 
            then the hydration fixes are working correctly!
          </p>
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-300">
              All hydration tests completed successfully. No console errors should be present.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components for better organization and reusability

interface TestSectionProps {
  title: string
  description?: string
  className?: string
  children: React.ReactNode
}

function TestSection({ title, description, className = '', children }: TestSectionProps) {
  return (
    <div className={`p-6 rounded-lg mb-6 ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {description && (
        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
      )}
      {children}
    </div>
  )
}

interface LoadingIndicatorProps {
  message: string
}

function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
      <p className="text-gray-500">{message}</p>
    </div>
  )
}

interface BrowserInfoDisplayProps {
  info: BrowserInfo | null
}

function BrowserInfoDisplay({ info }: BrowserInfoDisplayProps) {
  if (!info) {
    return <p className="text-gray-500">Browser information not available</p>
  }

  return (
    <div className="space-y-2 text-green-700 dark:text-green-300">
      <InfoItem label="User Agent" value={info.userAgent} />
      <InfoItem label="Screen Width" value={`${info.screenWidth}px`} />
      <InfoItem 
        label="Local Storage Available" 
        value={info.hasLocalStorage ? '✅ Yes' : '❌ No'} 
      />
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <p>
      <span className="font-medium">{label}:</span> {value}
    </p>
  )
}

function SuccessIndicators() {
  return (
    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <p className="font-medium text-green-800 dark:text-green-200">
        <strong>Success indicators:</strong>
      </p>
      <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
        <li>No "Hydration failed" errors in console</li>
        <li>No "Text content does not match" warnings</li>
        <li>All content renders smoothly</li>
        <li>Client-only content appears after initial load</li>
      </ul>
    </div>
  )
}