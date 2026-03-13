import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js needs unsafe-inline for hydration scripts; unsafe-eval for dev/HMR
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' maps.googleapis.com cdn.buymeacoffee.com https://js.hcaptcha.com https://www.googletagmanager.com https://analytics.ahrefs.com",
  // Inline styles are used throughout; cdnjs for Twemoji assets
  "style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com",
  // All image origins: Supabase storage, Twemoji SVGs, Buy Me a Coffee badge,
  // Google Maps tiles, and the remotePatterns already in next/image config
  [
    "img-src 'self' data: blob:",
    "https://kjhufdervnyuayhiwqtc.supabase.co",
    "https://cdnjs.cloudflare.com",
    "https://cdn.buymeacoffee.com",
    "https://maps.googleapis.com",
    "https://maps.gstatic.com",
    "https://lh3.googleusercontent.com",
    "https://images.unsplash.com",
    "https://placehold.co",
    "https://streetviewpixels-pa.googleapis.com",
    "https://imgs.hcaptcha.com",
    "https://upload.wikimedia.org",
  ].join(" "),
  "font-src 'self' data: https://cdnjs.cloudflare.com",
  // API / WebSocket connections: Supabase REST + Realtime, Google Maps JS API, hCaptcha, Sentry
  [
    "connect-src 'self'",
    "https://kjhufdervnyuayhiwqtc.supabase.co",
    "wss://kjhufdervnyuayhiwqtc.supabase.co",
    "https://maps.googleapis.com",
    "https://api.hcaptcha.com",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://*.ingest.sentry.io",
    "https://*.ingest.us.sentry.io",
  ].join(" "),
  // hCaptcha renders its challenge inside an iframe on newassets.hcaptcha.com
  "frame-src https://newassets.hcaptcha.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options",          value: "DENY" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  trailingSlash: true,

  // Expose SENTRY_DSN to client-side bundles at build time
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'streetviewpixels-pa.googleapis.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },

  async redirects() {
    return [

      // ── WILDCARD REDIRECTS (processed first) ────────────────────────────────

      // Note: /listings/:slug* is handled inside app/listings/[slug]/page.tsx
      // via permanentRedirect() because App Router dynamic routes intercept
      // before next.config.ts redirects fire for matching page paths.

      // Legacy claim-listing pages → add-business
      { source: '/claim-listing/:path*', destination: '/add-business/',    permanent: true },

      // WordPress taxonomy wildcards → homepage
      { source: '/category/:path*',    destination: '/', permanent: true },
      { source: '/tag/:path*',         destination: '/', permanent: true },
      { source: '/location/:path*',    destination: '/', permanent: true },
      { source: '/profile/:path*',     destination: '/', permanent: true },

      // Legacy WordPress restaurant directory wildcard → /directory/
      { source: '/restaurants/united-states/:path*', destination: '/directory/', permanent: true },

      // Old /states/ pattern
      { source: '/states/:state',  destination: '/directory/', permanent: true },
      { source: '/states/:state/', destination: '/directory/', permanent: true },

      // Washington D.C. city guide — old slug used state as city segment
      { source: '/washington-dc/washington-dc',  destination: '/district-of-columbia/washington/', permanent: true },
      { source: '/washington-dc/washington-dc/', destination: '/district-of-columbia/washington/', permanent: true },

      // ── SPECIFIC REDIRECTS ───────────────────────────────────────────────────

      // Old WordPress pages
      { source: '/homepage',        destination: '/', permanent: true },
      { source: '/homepage/',       destination: '/', permanent: true },
      { source: '/sample-page',     destination: '/', permanent: true },
      { source: '/sample-page/',    destination: '/', permanent: true },
      { source: '/login',           destination: '/', permanent: true },
      { source: '/login/',          destination: '/', permanent: true },
      { source: '/login-2',         destination: '/', permanent: true },
      { source: '/login-2/',        destination: '/', permanent: true },
      { source: '/forgot',          destination: '/', permanent: true },
      { source: '/forgot/',         destination: '/', permanent: true },
      { source: '/account',         destination: '/', permanent: true },
      { source: '/account/',        destination: '/', permanent: true },
      { source: '/users',           destination: '/', permanent: true },
      { source: '/users/',          destination: '/', permanent: true },
      { source: '/user-list-item',  destination: '/', permanent: true },
      { source: '/user-list-item/', destination: '/', permanent: true },
      { source: '/users-list-item',  destination: '/', permanent: true },
      { source: '/users-list-item/', destination: '/', permanent: true },
      { source: '/account-2',        destination: '/', permanent: true },
      { source: '/account-2/',       destination: '/', permanent: true },
      { source: '/profile-2',        destination: '/', permanent: true },
      { source: '/profile-2/',       destination: '/', permanent: true },
      { source: '/users-2',          destination: '/', permanent: true },
      { source: '/users-2/',         destination: '/', permanent: true },
      { source: '/tips-for-renting-a-house',  destination: '/', permanent: true },
      { source: '/tips-for-renting-a-house/', destination: '/', permanent: true },
      { source: '/author/jcrb-hubspacegmail-com',  destination: '/', permanent: true },
      { source: '/author/jcrb-hubspacegmail-com/', destination: '/', permanent: true },

      // Old /listing/ (no s) junk URL
      { source: '/listing/custom-carpentry-services',  destination: '/directory/', permanent: true },
      { source: '/listing/custom-carpentry-services/', destination: '/directory/', permanent: true },

      // Other invalid/broken paths
      { source: '/restaurants/category/hotels',    destination: '/directory/', permanent: true },
      { source: '/restaurants/category/hotels/',   destination: '/directory/', permanent: true },
      { source: '/restaurants/tags/restaurant',    destination: '/directory/', permanent: true },
      { source: '/restaurants/tags/restaurant/',   destination: '/directory/', permanent: true },
      { source: '/restaurants/tags/america',       destination: '/directory/', permanent: true },
      { source: '/restaurants/tags/america/',      destination: '/directory/', permanent: true },
      { source: '/restaurants/tags/food',        destination: '/directory/', permanent: true },
      { source: '/restaurants/tags/food/',       destination: '/directory/', permanent: true },
      { source: '/$',                            destination: '/',           permanent: true },

      // WordPress lorem ipsum junk
      { source: '/the-standard-chunk-of-lorem-ipsum-used-since-the-1500s-is-reproduced-below-for-those-interested',  destination: '/', permanent: true },
      { source: '/the-standard-chunk-of-lorem-ipsum-used-since-the-1500s-is-reproduced-below-for-those-interested/', destination: '/', permanent: true },
      { source: '/lorem-ipsum-is-simply-dummy-text-of-the-printing-and-typesetting-industry',  destination: '/', permanent: true },
      { source: '/lorem-ipsum-is-simply-dummy-text-of-the-printing-and-typesetting-industry/', destination: '/', permanent: true },
      { source: '/where-does-it-come-from',  destination: '/', permanent: true },
      { source: '/where-does-it-come-from/', destination: '/', permanent: true },
      { source: '/reset',          destination: '/', permanent: true },
      { source: '/reset/',         destination: '/', permanent: true },
      { source: '/comments/feed',  destination: '/', permanent: true },
      { source: '/comments/feed/', destination: '/', permanent: true },
      { source: '/feed',           destination: '/', permanent: true },
      { source: '/feed/',          destination: '/', permanent: true },

      // GSC 404 cleanup — added 2026-03-13
      { source: '/states/:state/:city*',                 destination: '/directory', permanent: true },
      { source: '/restaurants/category/:slug*',          destination: '/directory', permanent: true },
      { source: '/classifieds-archive-item/',            destination: '/', permanent: true },
      { source: '/starting-a-small-business/',           destination: '/', permanent: true },
      { source: '/contrary-to-popular-belief-lorem-ipsum-is-not-simply-random-text/', destination: '/', permanent: true },
      { source: '/register-2/',                          destination: '/', permanent: true },
      { source: '/aenean-sed-pulvinar-et-diam/',         destination: '/', permanent: true },
      { source: '/register/',                            destination: '/', permanent: true },
      { source: '/terms-and-conditions-2/',              destination: '/', permanent: true },
      { source: '/terms-and-conditions/',                destination: '/', permanent: true },
      { source: '/there-are-many-variations-of-passages-of-lorem-ipsum-available-but-the/', destination: '/', permanent: true },
      { source: '/advertising-dashboard/',               destination: '/', permanent: true },
      { source: '/orci-varius-natoque-penatibus/',       destination: '/', permanent: true },
      { source: '/what-is-lorem-ipsum/',                 destination: '/', permanent: true },
      { source: '/profile/',                             destination: '/', permanent: true },

    ];
  },

};

export default withSentryConfig(nextConfig, {
  // Suppress noisy build output; set to false to see full upload logs
  silent: !process.env.CI,

  // Automatically tree-shake Sentry logger statements in production
  disableLogger: true,

  // Upload source maps to Sentry (requires SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT)
  // Set widenClientFileUpload: true to upload more client source maps
  widenClientFileUpload: true,
});