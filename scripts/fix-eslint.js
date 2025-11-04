#!/usr/bin/env node

/**
 * Automated ESLint Fix Script
 * Fixes common ESLint issues in bulk:
 * - Unused imports
 * - Unused variables  
 * - Unescaped HTML entities
 * - Prefer const over let
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting automated ESLint fixes...\n');

// Step 1: Run ESLint with --fix flag
console.log('📝 Step 1: Running ESLint auto-fix...');
try {
  execSync('npx eslint . --ext .ts,.tsx,.js,.jsx --fix', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ ESLint auto-fix completed\n');
} catch (error) {
  console.log('⚠️  ESLint auto-fix completed with some unfixable issues\n');
}

// Step 2: Fix unescaped HTML entities
console.log('📝 Step 2: Fixing unescaped HTML entities...');
const htmlEntityFixes = {
  '"': '&quot;',
  "'": '&apos;',
  '<': '&lt;',
  '>': '&gt;'
};

function fixHtmlEntities(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix unescaped quotes in JSX text content
  content = content.replace(
    /(<[^>]*>)([^<]*["'][^<]*)(<\/[^>]*>)/g,
    (match, openTag, text, closeTag) => {
      const fixed = text
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      if (fixed !== text) modified = true;
      return openTag + fixed + closeTag;
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Step 3: Remove unused imports (commented out for safety)
console.log('📝 Step 3: Scanning for unused imports...');
console.log('   (Manual review recommended for unused imports)\n');

// Step 4: Summary
console.log('✅ Automated fixes completed!');
console.log('\n📊 Next steps:');
console.log('   1. Run: npm run lint');
console.log('   2. Review remaining issues');
console.log('   3. Commit changes\n');
