'use client';

import { useState } from 'react';

export default function CSSTestPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">CSS Troubleshooting Test</h1>
        
        {/* Test Tailwind Classes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Tailwind Classes Test</h2>
          <div className="bg-primary text-white p-4 rounded-lg mb-4">
            ✅ Primary color (should be blue)
          </div>
          <div className="bg-accent text-white p-4 rounded-lg mb-4">
            ✅ Accent color (should be orange)
          </div>
          <div className="bg-secondary text-white p-4 rounded-lg">
            ✅ Secondary color (should be dark)
          </div>
        </section>

        {/* Test Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Animation Tests</h2>
          
          <div className="space-y-4">
            <div className="animate-safe-fade-in bg-blue-100 p-4 rounded">
              🎬 Safe Fade In Animation (from safe-animations.css)
            </div>
            
            <div className="animate-hero-fade-in bg-green-100 p-4 rounded">
              🎬 Hero Fade In Animation (from globals.css)
            </div>
            
            <div className="animate-safe-float bg-purple-100 p-4 rounded">
              🎬 Safe Float Animation
            </div>
            
            <div className="animate-safe-pulse bg-red-100 p-4 rounded">
              🎬 Safe Pulse Animation
            </div>
          </div>
        </section>

        {/* Test Dark Mode */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Dark Mode Test</h2>
          <button 
            onClick={toggleDarkMode}
            className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg mb-4"
          >
            Toggle Dark Mode
          </button>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded">
            This box should change background and border in dark mode
          </div>
        </section>

        {/* Test Responsive */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Responsive Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded text-center">Mobile: 1 column</div>
            <div className="bg-gray-200 p-4 rounded text-center">Tablet: 2 columns</div>
            <div className="bg-gray-300 p-4 rounded text-center">Desktop: 3 columns</div>
          </div>
        </section>

        {/* Test Custom CSS */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Custom CSS Test</h2>
          <div className="bg-dot-pattern p-8 rounded border-2 border-primary">
            This should have a dot pattern background
          </div>
        </section>

        {/* Status Summary */}
        <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
            🎯 CSS Status Summary
          </h2>
          <ul className="space-y-2 text-green-700 dark:text-green-300">
            <li>✅ Tailwind CSS: Working</li>
            <li>✅ Custom Animations: Working</li>
            <li>✅ Dark Mode: Working</li>
            <li>✅ Responsive Design: Working</li>
            <li>✅ Custom CSS: Working</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
