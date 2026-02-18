import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'streetviewpixels-pa.googleapis.com',
      },
    ],
  },

  async redirects() {
    return [

      // GROUP 1: Old WordPress pages
      { source: '/tag/ipsum',                              destination: '/', permanent: true },
      { source: '/tag/lectus',                             destination: '/', permanent: true },
      { source: '/tag/magna',                              destination: '/', permanent: true },
      { source: '/tag/lorem',                              destination: '/', permanent: true },
      { source: '/tag/sapien',                             destination: '/', permanent: true },
      { source: '/category/ideas',                         destination: '/', permanent: true },
      { source: '/category/uncategorized',                 destination: '/', permanent: true },
      { source: '/sample-page',                            destination: '/', permanent: true },
      { source: '/login',                                  destination: '/', permanent: true },
      { source: '/login-2',                                destination: '/', permanent: true },
      { source: '/forgot',                                 destination: '/', permanent: true },
      { source: '/account',                                destination: '/', permanent: true },
      { source: '/users',                                  destination: '/', permanent: true },
      { source: '/user-list-item',                         destination: '/', permanent: true },
      { source: '/location',                               destination: '/', permanent: true },
      { source: '/profile',                                destination: '/', permanent: true },
      { source: '/profile/jcrb-hubspacegmail-com',         destination: '/', permanent: true },
      { source: '/author/jcrb-hubspacegmail-com',          destination: '/', permanent: true },

      // GROUP 2: Old listing URL format
      {
        source: '/listings/seafood-city-supermarket-chicago-il-2',
        destination: '/listings/seafood-city-supermarket-chicago-il',
        permanent: true,
      },
      {
        source: '/listing/custom-carpentry-services',
        destination: '/',
        permanent: true,
      },

      // GROUP 3: Fake/placeholder restaurant pages
      { source: '/restaurants/united-states/new-york/new-york/panorama',          destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/cesare-hotel',      destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/chez-michael',      destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/ziro',              destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/maya-inn',          destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/gusto',             destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/new-york/new-york/old-whiskey-salon', destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/tasty-food-inc',   destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/cucina-e-vino',    destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/burger-factory',   destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/eire-inn',         destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/california/san-francisco/stardust-hotel',   destination: '/restaurants', permanent: true },

      // GROUP 4: Invalid/broken paths
      { source: '/restaurants/category/hotels', destination: '/restaurants', permanent: true },
      { source: '/$',                           destination: '/',            permanent: true },

    ];
  },

};

export default nextConfig;