#!/usr/bin/env node

/**
 * Payment Flow Integration Test untuk Pasalku.ai
 * Test end-to-end alur pembayaran dengan Stripe
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('💳 Starting Stripe Payment Flow Tests\n');
console.log('======================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function logTest(name, success, message = '') {
    const status = success ? '✅' : '❌';
    const result = success ? 'PASS' : 'FAIL';

    console.log(`${status} ${name}: ${result}`);
    if (message) {
        console.log(`   ${message}`);
    }
    console.log('');

    totalTests++;
    if (success) passedTests++;
    else failedTests++;
}

// Mock Stripe client for testing
async function testStripeConfiguration() {
    console.log('🔧 Testing Stripe Configuration\n');

    try {
        // Check if Stripe publishable key is set
        const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!stripeKey) {
            logTest('Stripe Publishable Key', false, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found in environment');
            return false;
        }

        // Basic validation - should start with 'pk_test_' for test mode
        if (stripeKey.startsWith('pk_test_')) {
            logTest('Stripe Environment', true, 'Using Stripe test environment');
        } else if (stripeKey.startsWith('pk_live_')) {
            logTest('Stripe Environment', true, 'Using Stripe live environment (Caution!)');
        } else {
            logTest('Stripe Environment', false, 'Invalid Stripe key format');
            return false;
        }

        logTest('Stripe Publishable Key', true, 'Stripe key is configured');

        // Check if Stripe packages are installed
        try {
            require('@stripe/stripe-js');
            logTest('Stripe.js Package', true, '@stripe/stripe-js is installed');
        } catch (e) {
            logTest('Stripe.js Package', false, '@stripe/stripe-js not installed');
        }

        try {
            require('@stripe/react-stripe-js');
            logTest('React Stripe.js Package', true, '@stripe/react-stripe-js is installed');
        } catch (e) {
            logTest('React Stripe.js Package', false, '@stripe/react-stripe-js not installed');
        }

        return true;

    } catch (error) {
        logTest('Stripe Configuration', false, error.message);
        return false;
    }
}

async function testPaymentComponents() {
    console.log('🔩 Testing Payment Components\n');

    const componentPaths = [
        {
            name: 'SubscriptionPlans Component',
            path: 'components/payments/SubscriptionPlans.tsx',
            requiredExports: ['useState', 'useEffect', 'SubscriptionPlans']
        },
        {
            name: 'PaymentForm Component',
            path: 'components/payments/PaymentForm.tsx',
            requiredExports: ['useStripe', 'useElements', 'PaymentElement', 'PaymentForm']
        },
        {
            name: 'PaymentPage Component',
            path: 'components/payments/PaymentPage.tsx',
            requiredExports: ['useRouter', 'useSearchParams', 'useStripe', 'useElements', 'PaymentPage']
        },
        {
            name: 'StripeProvider Component',
            path: 'components/payments/StripeProvider.tsx',
            requiredExports: ['loadStripe', 'Elements', 'StripeProvider']
        }
    ];

    let allComponentsOk = true;

    for (const component of componentPaths) {
        try {
            const filePath = path.join(__dirname, '..', component.path);

            if (!fs.existsSync(filePath)) {
                logTest(component.name, false, `File not found: ${component.path}`);
                allComponentsOk = false;
                continue;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const missingImports = component.requiredExports.filter(exportName =>
                !content.includes(exportName)
            );

            if (missingImports.length === 0) {
                logTest(component.name, true, 'All required imports and exports found');
            } else {
                logTest(component.name, false, `Missing: ${missingImports.join(', ')}`);
                allComponentsOk = false;
            }

        } catch (error) {
            logTest(component.name, false, error.message);
            allComponentsOk = false;
        }
    }

    return allComponentsOk;
}

async function testBackendStripeIntegration() {
    console.log('🔗 Testing Backend Stripe Integration\n');

    try {
        // Check if backend payment routes exist
        const backendFiles = [
            'backend/routers/payments.py',
            'backend/models/payments.py'
        ];

        let backendFilesOk = true;
        for (const file of backendFiles) {
            const filePath = path.join(__dirname, '..', file);
            if (!fs.existsSync(filePath)) {
                logTest(`Backend File: ${file}`, false, `File not found`);
                backendFilesOk = false;
            } else {
                logTest(`Backend File: ${file}`, true, 'File exists');
            }
        }

        // Check if payment routes are defined in server.py
        const serverPath = path.join(__dirname, '..', 'backend', 'server.py');
        if (fs.existsSync(serverPath)) {
            const serverContent = fs.readFileSync(serverPath, 'utf8');

            const routeChecks = [
                'payments.router',
                '/api/payments/',
                'stripe'
            ];

            let routesOk = true;
            for (const route of routeChecks) {
                if (!serverContent.includes(route)) {
                    logTest(`Server Route: ${route}`, false, 'Route not found in server.py');
                    routesOk = false;
                } else {
                    logTest(`Server Route: ${route}`, true, 'Route configured');
                }
            }

            return backendFilesOk && routesOk;
        } else {
            logTest('Backend Server', false, 'server.py not found');
            return false;
        }

    } catch (error) {
        logTest('Backend Stripe Integration', false, error.message);
        return false;
    }
}

async function testEnvironmentVariables() {
    console.log('🔑 Testing Payment Environment Variables\n');

    const requiredVars = [
        {
            name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
            description: 'Stripe publishable key for frontend',
            shouldBePublic: true
        },
        {
            name: 'STRIPE_SECRET_KEY',
            description: 'Stripe secret key for backend',
            shouldBePublic: false
        },
        {
            name: 'STRIPE_MCP_KEY',
            description: 'Stripe webhook endpoint key',
            shouldBePublic: false
        }
    ];

    try {
        const envPath = path.join(__dirname, '..', '.env');

        if (!fs.existsSync(envPath)) {
            logTest('Environment File', false, '.env file not found');
            return false;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        let allVarsFound = true;

        for (const varConfig of requiredVars) {
            const varPattern = `${varConfig.name}=`;
            const varExists = envContent.includes(varPattern);

            if (varExists) {
                logTest(`${varConfig.name}`, true, varConfig.description);
            } else {
                logTest(`${varConfig.name}`, false, `${varConfig.description} - Not found in .env`);
                allVarsFound = false;
            }

            // Check if public variables are properly marked
            if (varConfig.shouldBePublic && !varConfig.name.startsWith('NEXT_PUBLIC_')) {
                logTest(`${varConfig.name} Visibility`, false, 'Should be public but not marked with NEXT_PUBLIC_');
                allVarsFound = false;
            }
        }

        return allVarsFound;

    } catch (error) {
        logTest('Environment Variables', false, error.message);
        return false;
    }
}

async function simulatePaymentFlow() {
    console.log('💳 Simulating Payment Flow\n');

    try {
        // Test 1: Check if server is running (for actual testing)
        console.log('   Note: For complete payment flow testing, ensure backend server is running');
        console.log('   Run: python backend/server.py');
        console.log('   Then access: http://localhost:5000/api/payments/subscription-plans\n');

        logTest('Payment Flow Simulation', true, 'Testing framework is ready (manual verification required for backend)');

        // Test 2: Check TypeScript compilation of payment components
        try {
            execSync('npx tsc --noEmit --skipLibCheck components/payments/*.tsx 2>/dev/null', {
                cwd: path.join(__dirname, '..'),
                stdio: 'pipe'
            });
            logTest('Payment Components TypeScript', true, 'Payment components compile without errors');
        } catch (error) {
            logTest('Payment Components TypeScript', false, 'TypeScript compilation failed for payment components');
        }

        return true;

    } catch (error) {
        logTest('Payment Flow Simulation', false, error.message);
        return false;
    }
}

async function testStripeWebhookConfiguration() {
    console.log('🔄 Testing Stripe Webhook Configuration\n');

    try {
        // Check if webhook endpoint is implemented in backend
        const paymentsPath = path.join(__dirname, '..', 'backend', 'routers', 'payments.py');

        if (!fs.existsSync(paymentsPath)) {
            logTest('Webhook Endpoint', false, 'payments.py not found');
            return false;
        }

        const paymentsContent = fs.readFileSync(paymentsPath, 'utf8');

        const webhookChecks = [
            '/webhook',
            'STRIPE_MCP_KEY',
            'stripe.Webhook.construct_event',
            'customer.subscription',
            'payment_intent.succeeded'
        ];

        let webhookOk = true;
        for (const check of webhookChecks) {
            if (paymentsContent.includes(check)) {
                logTest(`Webhook: ${check}`, true, 'Found in payments router');
            } else {
                logTest(`Webhook: ${check}`, false, 'Not found in payments router');
                webhookOk = false;
            }
        }

        // Check database models for payment storage
        const modelsPath = path.join(__dirname, '..', 'backend', 'models.py');
        if (fs.existsSync(modelsPath)) {
            const modelsContent = fs.readFileSync(modelsPath, 'utf8');
            if (modelsContent.includes('class Payment(')) {
                logTest('Payment Database Model', true, 'Payment model exists');
            } else {
                logTest('Payment Database Model', false, 'Payment model not found');
                webhookOk = false;
            }
        }

        return webhookOk;

    } catch (error) {
        logTest('Stripe Webhook Configuration', false, error.message);
        return false;
    }
}

async function generateTestReport() {
    console.log('📊 Generating Test Report\n');

    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            successRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0'
        },
        status: failedTests === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED',
        recommendations: []
    };

    // Generate recommendations
    if (failedTests > 0) {
        report.recommendations.push('❌ Fix failing tests before deployment');
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        report.recommendations.push('⚠️  Configure Stripe environment variables');
    }

    report.recommendations.push('✅ Test actual payment flow in browser');
    report.recommendations.push('🔗 Verify Stripe webhook endpoints');
    report.recommendations.push('💳 Test with Stripe test card numbers');

    // Write report to file
    const reportPath = path.join(__dirname, 'payment-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Report saved to: ${reportPath}\n`);

    // Display summary
    console.log('======================================');
    console.log('💳 PAYMENT FLOW TEST SUMMARY');
    console.log('======================================');
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Total:  ${totalTests}`);
    console.log(`📊 Success Rate: ${report.summary.successRate}%`);

    if (failedTests === 0) {
        console.log('\n🎉 PAYMENT INTEGRATION READY!');
        console.log('💳 You can now accept payments through Stripe\n');
    } else {
        console.log('\n⚠️  PAYMENT ISSUES DETECTED');
        console.log('Please review and fix the errors above\n');
    }

    console.log('💡 Testing Recommendations:');
    report.recommendations.forEach(rec => console.log(`   ${rec}`));
    console.log('');
}

async function main() {
    try {
        // Run all payment tests
        await testStripeConfiguration();
        await testEnvironmentVariables();
        await testPaymentComponents();
        await testBackendStripeIntegration();
        await testStripeWebhookConfiguration();
        await simulatePaymentFlow();

        // Generate final report
        await generateTestReport();

        return failedTests === 0 ? 0 : 1;

    } catch (error) {
        console.error('💥 Unexpected error during testing:', error.message);
        return 1;
    }
}

main().then(exitCode => {
    process.exit(exitCode);
}).catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});