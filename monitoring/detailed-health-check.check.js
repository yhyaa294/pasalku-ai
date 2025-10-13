/**
 * Checkly API Check - Detailed Health Endpoint
 * Monitors the /api/health/detailed endpoint untuk database connectivity
 */

const { ApiCheck, AssertionBuilder } = require('checkly/constructs');

new ApiCheck('detailed-health-check-api', {
  name: 'Pasalku AI - Detailed Health Check',
  degradedResponseTime: 10000,
  maxResponseTime: 15000,
  activated: true,
  muted: false,
  shouldFail: false,
  runParallel: true,
  locations: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
  tags: ['health', 'databases', 'monitoring'],
  frequency: 10, // Every 10 minutes
  environmentVariables: [],
  request: {
    method: 'GET',
    url: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/health/detailed`,
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.status').isIn(['healthy', 'degraded']),
      AssertionBuilder.jsonBody('$.databases').isDefined(),
      AssertionBuilder.jsonBody('$.external_services').isDefined(),
      AssertionBuilder.responseTime().lessThan(10000),
    ],
  },
});
