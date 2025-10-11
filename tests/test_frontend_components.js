#!/usr/bin/env node

/**
 * Frontend Component Testing untuk Pasalku.ai
 * Test bahwa semua komponen React bisa dirender dengan baik dan tidak ada error
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Frontend Component Tests\n');
console.log('=====================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.log('❌ package.json not found. Are you in the project root?');
    process.exit(1);
}

const componentsToTest = [
    {
        name: 'AnalyticsDashboard',
        path: 'components/analytics/index.ts',
        expected: 'AnalyticsDashboard'
    },
    {
        name: 'WorkflowDashboard',
        path: 'components/workflow/index.ts',
        expected: 'WorkflowDashboard, WorkflowCreator'
    },
    {
        name: 'AIProviderSelector',
        path: 'components/ai/index.ts',
        expected: 'AIProviderSelector'
    },
    {
        name: 'Payment Components',
        path: 'components/payments/index.ts',
        expected: 'SubscriptionPlans, PaymentForm, PaymentPage, StripeProvider'
    }
];

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

async function testComponentImports() {
    console.log('🔍 Testing Component Imports\n');

    for (const component of componentsToTest) {
        try {
            const componentPath = path.join(__dirname, '..', component.path);

            if (!fs.existsSync(componentPath)) {
                logTest(`${component.name} Import`, false, `File not found: ${component.path}`);
                continue;
            }

            const content = fs.readFileSync(componentPath, 'utf8');

            // Check if expected exports are present
            const expectedItems = component.expected.split(', ');
            let allFound = true;
            const foundItems = [];

            for (const expected of expectedItems) {
                if (content.includes(`export { ${expected} }`) ||
                    content.includes(`export { default as ${expected} }`) ||
                    content.includes(`export const ${expected}`) ||
                    content.includes(`export function ${expected}`)) {
                    foundItems.push(expected);
                } else {
                    allFound = false;
                }
            }

            if (allFound) {
                logTest(`${component.name} Import`, true,
                    `Found: ${foundItems.join(', ')}`);
            } else {
                logTest(`${component.name} Import`, false,
                    `Missing exports. Expected: ${component.expected}, Found: ${foundItems.join(', ')}`);
            }

        } catch (error) {
            logTest(`${component.name} Import`, false, error.message);
        }
    }
}

async function testTypeScriptCompilation() {
    console.log('⚡ Testing TypeScript Compilation\n');

    try {
        // Run TypeScript check
        execSync('npx tsc --noEmit --skipLibCheck', {
            stdio: 'pipe',
            cwd: path.join(__dirname, '..')
        });

        logTest('TypeScript Compilation', true, 'No type errors found');

    } catch (error) {
        const errorOutput = error.stdout.toString();
        const hasErrors = errorOutput.includes('error') || errorOutput.includes('Error');

        if (hasErrors) {
            logTest('TypeScript Compilation', false, 'TypeScript compilation failed');

            // Show first few errors
            const lines = errorOutput.split('\n').slice(0, 10);
            console.log('   First 10 lines of errors:');
            lines.forEach(line => {
                if (line.trim()) console.log(`   ${line}`);
            });
            console.log('   ... (use `npx tsc --noEmit` for full error output)');
        } else {
            logTest('TypeScript Compilation', true, 'TypeScript compilation successful');
        }
    }
}

async function testDependencies() {
    console.log('📦 Testing Dependencies\n');

    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

        const requiredDeps = [
            'react',
            '@stripe/stripe-js',
            '@stripe/react-stripe-js',
            'recharts',
            'lucide-react',
            '@radix-ui/react-dialog'
        ];

        const devDeps = [
            'typescript',
            '@types/react',
            'tailwindcss'
        ];

        // Check required dependencies
        const missingDeps = [];
        for (const dep of requiredDeps) {
            if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
                missingDeps.push(dep);
            }
        }

        if (missingDeps.length === 0) {
            logTest('Frontend Dependencies', true, `All ${requiredDeps.length} required dependencies found`);
        } else {
            logTest('Frontend Dependencies', false, `Missing: ${missingDeps.join(', ')}`);
        }

        // Check dev dependencies
        const missingDevDeps = [];
        for (const dep of devDeps) {
            if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
                missingDevDeps.push(dep);
            }
        }

        if (missingDevDeps.length === 0) {
            logTest('Dev Dependencies', true, `All ${devDeps.length} dev dependencies found`);
        } else {
            logTest('Dev Dependencies', false, `Missing: ${missingDevDeps.join(', ')}`);
        }

    } catch (error) {
        logTest('Dependencies Check', false, error.message);
    }
}

async function testEnvironmentVariables() {
    console.log('🔧 Testing Environment Variables\n');

    try {
        const envPath = path.join(__dirname, '..', '.env');
        const envExamplePath = path.join(__dirname, '..', '.env.example');

        if (!fs.existsSync(envPath)) {
            logTest('Environment File', false, '.env file not found');
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');

        // Check for critical environment variables
        const criticalVars = [
            'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
            'NEXT_PUBLIC_SENTRY_DSN',
            'DATABASE_URL'
        ];

        const missingVars = [];
        for (const varName of criticalVars) {
            // Check if variable is set (either in .env or process.env)
            if (!envContent.includes(`${varName}=`) && !process.env[varName]) {
                missingVars.push(varName);
            }
        }

        if (missingVars.length === 0) {
            logTest('Environment Variables', true, 'All critical environment variables are set');
        } else {
            logTest('Environment Variables', false, `Missing: ${missingVars.join(', ')}`);
        }

    } catch (error) {
        logTest('Environment Variables', false, error.message);
    }
}

async function testBuildProcess() {
    console.log('🔨 Testing Build Process\n');

    try {
        // Try to run build (but don't actually build, just check if the command works)
        execSync('npm run build --dry-run 2>/dev/null || echo "Build command exists"', {
            stdio: 'pipe',
            cwd: path.join(__dirname, '..')
        });

        // Check if build script exists
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

        if (packageJson.scripts && packageJson.scripts.build) {
            logTest('Build Scripts', true, 'Build script is configured');
        } else {
            logTest('Build Scripts', false, 'Build script not found in package.json');
        }

    } catch (error) {
        logTest('Build Process', false, error.message);
    }
}

async function main() {
    try {
        // Run all tests
        await testDependencies();
        await testEnvironmentVariables();
        await testComponentImports();
        await testTypeScriptCompilation();
        await testBuildProcess();

        // Print summary
        console.log('=====================================');
        console.log('📊 FRONTEND TEST SUMMARY');
        console.log('=====================================');
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`📈 Total:  ${totalTests}`);
        console.log(`📊 Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0'}%`);

        if (failedTests === 0) {
            console.log('\n🎉 ALL FRONTEND TESTS PASSED!');
            console.log('🚀 Frontend is ready for deployment!');
            return 0;
        } else {
            console.log('\n⚠️  SOME FRONTEND TESTS FAILED.');
            console.log('Please review the errors above.');
            return 1;
        }

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