import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.01, // Reduce to 1% in dev

    // DISABLE DEBUG to reduce console spam
    debug: false, // Changed from true to false

    // Disable tracing to reduce noise
    enableTracing: false,
    
    // Reduce log level
    logLevel: 'error', // Only log errors, not warnings
    
    // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: process.env.NODE_ENV === 'development',
  });
}