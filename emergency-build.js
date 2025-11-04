#!/usr/bin/env node

/**
 * EMERGENCY BUILD SCRIPT
 * Temporarily renames config files to suppress errors for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY BUILD MODE ACTIVATED');

// Backup original configs
const backupConfigs = () => {
  try {
    if (fs.existsSync('next.config.js')) {
      fs.renameSync('next.config.js', 'next.config.backup.js');
      console.log('✅ Backed up next.config.js');
    }
    
    if (fs.existsSync('next.config.mjs')) {
      fs.renameSync('next.config.mjs', 'next.config.backup.mjs');
      console.log('✅ Backed up next.config.mjs');
    }
  } catch (error) {
    console.warn('⚠️ Warning during backup:', error.message);
  }
};

// Use emergency config
const useEmergencyConfig = () => {
  try {
    if (fs.existsSync('next.config.emergency.js')) {
      fs.renameSync('next.config.emergency.js', 'next.config.js');
      console.log('✅ Emergency config activated');
    }
  } catch (error) {
    console.error('❌ Failed to activate emergency config:', error.message);
  }
};

// Restore original configs
const restoreConfigs = () => {
  try {
    if (fs.existsSync('next.config.js')) {
      fs.renameSync('next.config.js', 'next.config.emergency.js');
    }
    
    if (fs.existsSync('next.config.backup.js')) {
      fs.renameSync('next.config.backup.js', 'next.config.js');
      console.log('✅ Restored next.config.js');
    }
    
    if (fs.existsSync('next.config.backup.mjs')) {
      fs.renameSync('next.config.backup.mjs', 'next.config.mjs');
      console.log('✅ Restored next.config.mjs');
    }
  } catch (error) {
    console.warn('⚠️ Warning during restore:', error.message);
  }
};

// Main execution
const command = process.argv[2];

switch (command) {
  case 'activate':
    backupConfigs();
    useEmergencyConfig();
    console.log('🚀 Emergency mode ready for build');
    break;
    
  case 'restore':
    restoreConfigs();
    console.log('🔄 Original configs restored');
    break;
    
  default:
    console.log(`
Usage:
  node emergency-build.js activate   - Activate emergency mode
  node emergency-build.js restore    - Restore original configs
    `);
}
