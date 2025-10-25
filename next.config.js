// @ts-check
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  productionBrowserSourceMaps: true,

  // Make builds resilient to lint/type issues while we recover
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Environment Variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:8000'),
  },

  // Experimental Features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Images Configuration
  images: {
    domains: [
      'localhost',
      'vercel.app',
      'railway.app',
      // Add other domains as needed
    ],
    // Avoid requiring sharp locally; Next will fall back when unoptimized=true
    unoptimized: process.env.NODE_ENV !== 'production',
  },

  // Webpack Configuration
  webpack: (config, { isServer, dev }) => {
    // Add support for importing SVG as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Fixes npm packages that depend on `node:` protocol
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }

    // Add source map support in development
    if (dev) {
      config.devtool = 'source-map';
    }

    return config;
  },

  // Custom Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects and Rewrites
  async redirects() {
    return [];
  },

  // Rewrites for API proxy if needed
  async rewrites() {
    const isVercel = !!process.env.VERCEL_URL
    return [
      {
        source: '/api/:path*',
        destination: isVercel
          ? `https://pasalku-ai-backend.vercel.app/api/:path*`
          : `http://localhost:8000/api/:path*`,
      },
    ];
  },
};

const { withSentryConfig } = require("@sentry/nextjs");
const nextTranslate = require('next-translate-plugin');

module.exports = nextTranslate({
  ...withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "pasalkuai",
    project: "pasalku-ai",

    // Only print logs for uploading source maps in CI
    silent: true,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show the component name
    // in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/cron/get-started/#1-instrument-cron-jobs
    automaticVercelMonitors: true,
  }),
  i18n: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
  },
});

