export const PACKAGES = {
  ffnm: [
    {
      val: 'local',
      name: 'Local Hero',
      stripePrice: 'price_1TDZ33GfgbxgwcRZbVNTDdbj',
      standardPrice: 79,
      foundingPrice: 55,
      savings: 24,
      cadence: '/mo',
      geo: 'City / Metro',
      features: [
        'Featured card on 1 city page',
        'Featured on 1 category page',
        'Featured badge on listing',
        'Logo, blurb, CTA button',
        'Monthly click + impression report'
      ]
    },
    {
      val: 'regional',
      name: 'Regional Spotlight',
      stripePrice: 'price_1TDZ3hGfgbxgwcRZaZuThMYn',
      standardPrice: 169,
      foundingPrice: 118,
      savings: 51,
      cadence: '/mo',
      geo: 'State or up to 3 metros',
      features: [
        'Everything in Local Hero',
        'Homepage rotation slot',
        'Up to 3 city/category placements',
        'Priority position in sponsored module',
        'Monthly performance report'
      ]
    },
    {
      val: 'national',
      name: 'National Partner',
      stripePrice: 'price_1TDZ5iGfgbxgwcRZN7CwFVO5',
      standardPrice: 349,
      foundingPrice: 244,
      savings: 105,
      cadence: '/mo',
      geo: 'Nationwide',
      features: [
        'Homepage priority slot (top position)',
        '5 placements across key category/state pages',
        'Nationwide or custom multi-state targeting',
        'Optional category exclusivity',
        'Priority reporting + screenshot proof'
      ]
    },
    {
      val: 'regional_kb',
      name: 'Regional Spotlight + Cultural KB',
      stripePrice: 'price_1TMCnmGfgbxgwcRZ6fX9ZbAf',
      standardPrice: 199,
      foundingPrice: 149,
      savings: 50,
      cadence: '/mo',
      geo: 'State or Region',
      features: [
        'Everything in Regional Spotlight',
        'Featured in 1 Cultural KB article per quarter',
        'Logo in article "Where to Try" section',
        'Priority in Cultural KB email features',
        'Homepage rotation slot',
        'Up to 3 city/category placements'
      ]
    },
    {
      val: 'national_kb',
      name: 'National Partner + Cultural KB',
      stripePrice: 'price_1TMCoqGfgbxgwcRZVz6sXXeE',
      standardPrice: 399,
      foundingPrice: 299,
      savings: 100,
      cadence: '/mo',
      geo: 'Nationwide',
      features: [
        'Everything in National Partner',
        'Featured in 2 Cultural KB articles per quarter',
        '"Where to Try" priority placement',
        'Priority in Cultural KB email features',
        'Homepage priority slot (top position)',
        '5 placements across key pages',
        'Optional category exclusivity'
      ]
    },
    {
      val: 'heritage',
      name: 'Heritage Sponsor',
      stripePrice: 'price_1TMCpVGfgbxgwcRZXau39CdN',
      standardPrice: 199,
      foundingPrice: 199,
      savings: 0,
      cadence: '/article',
      geo: 'Single article',
      features: [
        'Sponsor a specific Cultural KB article',
        'Logo placement at top of article',
        'Brand mention woven into content',
        'Link to your FFNM listing',
        'Social media shoutout when published',
        'Quarterly Cultural Partners highlight'
      ]
    }
  ],
  fenm: [
    {
      val: 'boost',
      name: 'Local Boost',
      stripePrice: 'price_1TDZ6HGfgbxgwcRZCx8SkonK',
      standardPrice: 49,
      foundingPrice: 34,
      savings: 15,
      cadence: '/event',
      geo: 'City / Metro',
      features: [
        'Featured on 1 city events page',
        'Featured on 1 category events page',
        'Featured badge on event card',
        'Click report at end of run',
        'Runs for 14 days, ending on or before your event date'
      ]
    },
    {
      val: 'spotlight',
      name: 'City Spotlight',
      stripePrice: 'price_1TDZ6kGfgbxgwcRZWvu9euVh',
      standardPrice: 99,
      foundingPrice: 69,
      savings: 30,
      cadence: '/event',
      geo: 'State / Region',
      features: [
        'Everything in Local Boost',
        'Homepage rotation slot',
        'City + category events page placement',
        'Priority in featured events module',
        'Performance report',
        'Runs for 30 days, ending on or before your event date'
      ]
    },
    {
      val: 'headliner',
      name: 'Headliner',
      stripePrice: 'price_1TDZ7VGfgbxgwcRZmvWhlKVx',
      standardPrice: 199,
      foundingPrice: 139,
      savings: 60,
      cadence: '/event',
      geo: 'Nationwide',
      features: [
        'Homepage top slot (priority)',
        'All-events page placement',
        'City + category events pages',
        'Optional cross-post to FilipinoFoodNearMe.org',
        'Priority reporting + screenshot proof',
        'Runs for 45 days, ending on or before your event date'
      ]
    }
  ]
}

export type FfnmPackage = typeof PACKAGES.ffnm[0]
export type FenmPackage = typeof PACKAGES.fenm[0]

export function calculateOrderTotal(
  ffnmPkg: FfnmPackage | null,
  fenomPkg: FenmPackage | null,
  isBundle: boolean
) {
  const ffnmTotal = ffnmPkg ? ffnmPkg.foundingPrice : 0
  const fenomTotal = fenomPkg ? fenomPkg.foundingPrice : 0
  const subtotal = ffnmTotal + fenomTotal
  const bundleDiscount = isBundle ? Math.round(subtotal * 0.15) : 0
  const total = subtotal - bundleDiscount
  return { ffnmTotal, fenomTotal, subtotal, bundleDiscount, total }
}
