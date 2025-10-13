/**
 * Checkly API Check - Health Endpoint
 * Monitors the /api/health endpoint untuk memastikan backend berjalan
 */

const { ApiCheck, AssertionBuilder } = require('checkly/constructs');

new ApiCheck('health-check-api', {
  name: 'Pasalku AI - Health Check',
  degradedResponseTime: 5000,
  maxResponseTime: 10000,
  activated: true,
  muted: false,
  shouldFail: false,
  runParallel: true,
  locations: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
  tags: ['health', 'critical'],
  frequency: 5, // Every 5 minutes
  environmentVariables: [],
  request: {
    method: 'GET',
    url: process.env.BACKEND_URL || 'http://localhost:8000',
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.status').equals('healthy'),
      AssertionBuilder.responseTime().lessThan(5000),
    ],
  },
});
