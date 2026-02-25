import type { NextConfig } from "next";

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
  ].join(" "),
  "font-src 'self' data: https://cdnjs.cloudflare.com",
  // API / WebSocket connections: Supabase REST + Realtime, Google Maps JS API, hCaptcha
  [
    "connect-src 'self'",
    "https://kjhufdervnyuayhiwqtc.supabase.co",
    "wss://kjhufdervnyuayhiwqtc.supabase.co",
    "https://maps.googleapis.com",
    "https://api.hcaptcha.com",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
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
    ],
  },

  async redirects() {
    return [

      // GROUP 1: Old WordPress pages
      { source: '/homepage',                               destination: '/', permanent: true },
      { source: '/homepage/',                              destination: '/', permanent: true },
      { source: '/tag/ipsum',                              destination: '/', permanent: true },
      { source: '/tag/ipsum/',                             destination: '/', permanent: true },
      { source: '/tag/lectus',                             destination: '/', permanent: true },
      { source: '/tag/lectus/',                            destination: '/', permanent: true },
      { source: '/tag/magna',                              destination: '/', permanent: true },
      { source: '/tag/magna/',                             destination: '/', permanent: true },
      { source: '/tag/lorem',                              destination: '/', permanent: true },
      { source: '/tag/lorem/',                             destination: '/', permanent: true },
      { source: '/tag/sapien',                             destination: '/', permanent: true },
      { source: '/tag/sapien/',                            destination: '/', permanent: true },
      { source: '/category/ideas',                         destination: '/', permanent: true },
      { source: '/category/ideas/',                        destination: '/', permanent: true },
      { source: '/category/uncategorized',                 destination: '/', permanent: true },
      { source: '/category/uncategorized/',                destination: '/', permanent: true },
      { source: '/sample-page',                            destination: '/', permanent: true },
      { source: '/sample-page/',                           destination: '/', permanent: true },
      { source: '/login',                                  destination: '/', permanent: true },
      { source: '/login/',                                 destination: '/', permanent: true },
      { source: '/login-2',                                destination: '/', permanent: true },
      { source: '/login-2/',                               destination: '/', permanent: true },
      { source: '/forgot',                                 destination: '/', permanent: true },
      { source: '/forgot/',                                destination: '/', permanent: true },
      { source: '/account',                                destination: '/', permanent: true },
      { source: '/account/',                               destination: '/', permanent: true },
      { source: '/users',                                  destination: '/', permanent: true },
      { source: '/users/',                                 destination: '/', permanent: true },
      { source: '/user-list-item',                         destination: '/', permanent: true },
      { source: '/user-list-item/',                        destination: '/', permanent: true },
      { source: '/location',                               destination: '/', permanent: true },
      { source: '/location/',                              destination: '/', permanent: true },
      { source: '/profile',                                destination: '/', permanent: true },
      { source: '/profile/',                               destination: '/', permanent: true },
      { source: '/profile/jcrb-hubspacegmail-com',         destination: '/', permanent: true },
      { source: '/profile/jcrb-hubspacegmail-com/',        destination: '/', permanent: true },
      { source: '/author/jcrb-hubspacegmail-com',          destination: '/', permanent: true },
      { source: '/author/jcrb-hubspacegmail-com/',         destination: '/', permanent: true },

      // GROUP 2: Old listing URL format
      { source: '/listings/seafood-city-supermarket-chicago-il-2',  destination: '/listings/seafood-city-supermarket-chicago-il/', permanent: true },
      { source: '/listings/seafood-city-supermarket-chicago-il-2/', destination: '/listings/seafood-city-supermarket-chicago-il/', permanent: true },
      { source: '/listing/custom-carpentry-services',                destination: '/', permanent: true },
      { source: '/listing/custom-carpentry-services/',               destination: '/', permanent: true },

      // GROUP 3: Fake/placeholder restaurant pages
      { source: '/restaurants/united-states/new-york/new-york/panorama',               destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/panorama/',              destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/cesare-hotel',           destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/cesare-hotel/',          destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/chez-michael',           destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/chez-michael/',          destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/ziro',                   destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/ziro/',                  destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/maya-inn',               destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/maya-inn/',              destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/gusto',                  destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/gusto/',                 destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/old-whiskey-salon',      destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/old-whiskey-salon/',     destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/tasty-food-inc',  destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/tasty-food-inc/', destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/cucina-e-vino',   destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/cucina-e-vino/',  destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/burger-factory',  destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/burger-factory/', destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/eire-inn',        destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/eire-inn/',       destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/stardust-hotel',  destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/stardust-hotel/', destination: '/directory/', permanent: true },

      // GROUP 4: Invalid/broken paths
      { source: '/restaurants/category/hotels',  destination: '/directory/', permanent: true },
      { source: '/restaurants/category/hotels/', destination: '/directory/', permanent: true },
      { source: '/$',                            destination: '/',           permanent: true },

      // GROUP 5: WordPress lorem ipsum junk
      { source: '/the-standard-chunk-of-lorem-ipsum-used-since-the-1500s-is-reproduced-below-for-those-interested',  destination: '/', permanent: true },
      { source: '/the-standard-chunk-of-lorem-ipsum-used-since-the-1500s-is-reproduced-below-for-those-interested/', destination: '/', permanent: true },
      { source: '/lorem-ipsum-is-simply-dummy-text-of-the-printing-and-typesetting-industry',                        destination: '/', permanent: true },
      { source: '/lorem-ipsum-is-simply-dummy-text-of-the-printing-and-typesetting-industry/',                       destination: '/', permanent: true },
      { source: '/where-does-it-come-from',   destination: '/', permanent: true },
      { source: '/where-does-it-come-from/',  destination: '/', permanent: true },
      { source: '/reset',                     destination: '/', permanent: true },
      { source: '/reset/',                    destination: '/', permanent: true },
      { source: '/category/trends',           destination: '/', permanent: true },
      { source: '/category/trends/',          destination: '/', permanent: true },
      { source: '/restaurants/tags/food',     destination: '/directory/', permanent: true },
      { source: '/restaurants/tags/food/',    destination: '/directory/', permanent: true },
      { source: '/comments/feed',             destination: '/', permanent: true },
      { source: '/comments/feed/',            destination: '/', permanent: true },
      { source: '/feed',                      destination: '/', permanent: true },
      { source: '/feed/',                     destination: '/', permanent: true },

      // GROUP 6: Old WordPress Philadelphia restaurant pages
      { source: '/restaurants/united-states/pennsylvania/philadelphia/loews-philadelphia-hotel',      destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/pennsylvania/philadelphia/loews-philadelphia-hotel/',     destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/pennsylvania/philadelphia/parc',                          destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/pennsylvania/philadelphia/parc/',                         destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/pennsylvania/philadelphia/zavino-pizzeria-and-wine-bar',  destination: '/directory/', permanent: true },
      { source: '/restaurants/united-states/pennsylvania/philadelphia/zavino-pizzeria-and-wine-bar/', destination: '/directory/', permanent: true },

    ];
  },

};

export default nextConfig;