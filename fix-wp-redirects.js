const fs = require('fs');

let config = fs.readFileSync('next.config.ts', 'utf8');

// Add new redirects after GROUP 4 comment
config = config.replace(
  `{ source: '/$',                           destination: '/',            permanent: true },`,
  `{ source: '/$',                           destination: '/',            permanent: true },

      // GROUP 5: WordPress lorem ipsum junk
      { source: '/the-standard-chunk-of-lorem-ipsum-used-since-the-1500s-is-reproduced-below-for-those-interested', destination: '/', permanent: true },
      { source: '/lorem-ipsum-is-simply-dummy-text-of-the-printing-and-typesetting-industry', destination: '/', permanent: true },
      { source: '/where-does-it-come-from',  destination: '/', permanent: true },
      { source: '/reset',                    destination: '/', permanent: true },
      { source: '/category/trends',          destination: '/', permanent: true },
      { source: '/restaurants/tags/food',    destination: '/', permanent: true },
      { source: '/comments/feed',            destination: '/', permanent: true },
      { source: '/feed',                     destination: '/', permanent: true },

      // GROUP 6: Old WordPress Philadelphia restaurant pages
      { source: '/restaurants/united-states/pennsylvania/philadelphia/loews-philadelphia-hotel', destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/pennsylvania/philadelphia/parc',                     destination: '/restaurants', permanent: true },
      { source: '/restaurants/united-states/pennsylvania/philadelphia/zavino-pizzeria-and-wine-bar', destination: '/restaurants', permanent: true },`
);

fs.writeFileSync('next.config.ts', config);
console.log('Done. Verify - count of redirects:');
const matches = config.match(/permanent: true/g);
console.log('Total redirects:', matches ? matches.length : 0);
