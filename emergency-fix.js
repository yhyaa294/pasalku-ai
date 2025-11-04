#!/usr/bin/env node

/**
 * EMERGENCY FIX SCRIPT
 * Creates simple placeholder components for broken files
 */

const fs = require('fs');
const path = require('path');

const brokenFiles = [
  'app/blog/page.tsx',
  'app/contact/page.tsx', 
  'app/dashboard/page.tsx',
  'app/faq/page.tsx',
  'app/privacy-policy/page.tsx',
  'app/security-report/page.tsx'
];

const createPlaceholder = (filePath) => {
  const fileName = path.basename(filePath, '.tsx');
  const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1) + 'Page';
  
  const placeholder = `'use client';

import React from 'react';

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ${fileName.charAt(0).toUpperCase() + fileName.slice(1)} Page
        </h1>
        <p className="text-gray-600 mb-6">
          This page is temporarily under maintenance.
        </p>
        <div className="text-6xl mb-4">🚧</div>
        <p className="text-sm text-gray-500">
          We're working to restore full functionality soon.
        </p>
      </div>
    </div>
  );
}`;

  return placeholder;
};

console.log('🚨 EMERGENCY FIX: Creating placeholder components...');

brokenFiles.forEach(filePath => {
  try {
    // Backup original
    if (fs.existsSync(filePath)) {
      fs.renameSync(filePath, filePath + '.broken');
      console.log(`✅ Backed up ${filePath}`);
    }
    
    // Create placeholder
    const placeholder = createPlaceholder(filePath);
    fs.writeFileSync(filePath, placeholder);
    console.log(`✅ Created placeholder for ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Failed to fix ${filePath}:`, error.message);
  }
});

console.log('🎉 Emergency fix completed! Try building now.');
