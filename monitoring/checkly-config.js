/**
 * Checkly Monitoring Configuration
 * Konfigurasi untuk monitoring uptime dan performance Pasalku.ai
 */

const { ChecklyConfig } = require('checkly');

const config = new ChecklyConfig({
  projectName: 'Pasalku AI',
  logicalId: 'pasalku-ai-monitoring',
  repoUrl: 'https://github.com/yhyaa294/pasalku-ai',
  checks: {
    activated: true,
    muted: false,
    runtimeId: '2023.09',
    frequency: 5, // Check every 5 minutes
    locations: ['us-east-1', 'eu-west-1', 'ap-southeast-1'], // Multiple regions
    tags: ['api', 'production'],
    alertChannels: [],
    checkMatch: '**/*.check.js',
    browserChecks: {
      frequency: 10,
      testMatch: '**/*.spec.js',
    },
  },
  cli: {
    runLocation: 'eu-west-1',
  },
});

module.exports = config;
