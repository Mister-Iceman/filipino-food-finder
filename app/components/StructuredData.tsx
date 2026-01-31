export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Filipino Food Near Me',
    url: 'https://filipinofoodnearme.org',
    description: 'Find authentic Filipino restaurants, bakeries, and grocery stores across America',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://filipinofoodnearme.org/directory?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function RestaurantStructuredData({ restaurant }: { restaurant: any }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address_street,
      addressLocality: restaurant.city,
      addressRegion: restaurant.state,
      postalCode: restaurant.zip,
      addressCountry: 'US',
    },
    telephone: restaurant.phone,
    url: restaurant.website,
    servesCuisine: 'Filipino',
    aggregateRating: restaurant.google_rating ? {
      '@type': 'AggregateRating',
      ratingValue: restaurant.google_rating,
      reviewCount: restaurant.google_reviews_count,
    } : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}