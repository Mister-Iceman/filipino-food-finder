import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Most Memorable Filipino Food Cities in America (2026) | Filipino Food Near Me',
  description: 'Discover the 10 most memorable cities for Filipino food in America. From Los Angeles to Virginia Beach, explore where Filipino-American communities gather and celebrate their culinary heritage.',
  openGraph: {
    title: 'Most Memorable Filipino Food Cities in America (2026)',
    description: 'A cultural journey through the 10 cities where Filipino food tells the story of diaspora, community, and home.',
    type: 'article',
  },
}

const cities = [
  {
    rank: 1,
    name: 'Los Angeles',
    state: 'California',
    slug: 'california/los-angeles',
    population: '~500,000 Filipinos',
    highlight: 'Home to Historic Filipinotown, the first officially designated Filipinotown in the United States (2002)',
    keyDistricts: 'Historic Filipinotown, Eagle Rock, Carson, West Covina',
  },
  {
    rank: 2,
    name: 'San Francisco',
    state: 'California',
    slug: 'california/san-francisco',
    population: '~290,000 Filipinos',
    highlight: 'SOMA Pilipinas is the first Filipino Cultural Heritage District in a major U.S. city (designated 2016)',
    keyDistricts: 'SOMA Pilipinas, Daly City (Little Manila by the Bay), Excelsior District',
  },
  {
    rank: 3,
    name: 'New York',
    state: 'New York',
    slug: 'new-york/new-york',
    population: '~250,000 Filipinos',
    highlight: 'Little Manila in Woodside, Queens is the highest concentration of Filipino restaurants on the East Coast',
    keyDistricts: 'Woodside Queens, Jersey City, Staten Island',
  },
  {
    rank: 4,
    name: 'Honolulu',
    state: 'Hawaii',
    slug: 'hawaii/honolulu',
    population: '~214,000 Filipinos',
    highlight: 'Filipinos are the largest ethnic group in Hawaii, and Filipino food has become inseparable from local cuisine',
    keyDistricts: 'Kalihi, Waipahu, Ewa Beach',
  },
  {
    rank: 5,
    name: 'San Diego',
    state: 'California',
    slug: 'california/san-diego',
    population: '~201,000 Filipinos',
    highlight: 'Deep U.S. Navy roots dating back over a century, with one of the highest Filipino populations in any major U.S. city',
    keyDistricts: 'Mira Mesa, National City, Chula Vista',
  },
  {
    rank: 6,
    name: 'Las Vegas',
    state: 'Nevada',
    slug: 'nevada/las-vegas',
    population: '~147,000 Filipinos',
    highlight: 'Filipino Town on Maryland Parkway was officially recognized in 2023 as Nevada\'s first Filipino district',
    keyDistricts: 'Filipino Town, Spring Valley, Henderson',
  },
  {
    rank: 7,
    name: 'Chicago',
    state: 'Illinois',
    slug: 'illinois/chicago',
    population: '~145,000 Filipinos',
    highlight: 'One of the largest Filipino communities in the Midwest, with one of the largest Philippine Independence Day parades in the U.S.',
    keyDistricts: 'Lincoln Square, Albany Park, Skokie',
  },
  {
    rank: 8,
    name: 'Seattle',
    state: 'Washington',
    slug: 'washington/seattle',
    population: '~115,000 Filipinos',
    highlight: 'One of the oldest continuous Filipino communities in the United States, dating back to cannery workers in the early 1900s',
    keyDistricts: 'Beacon Hill, International District, Tukwila',
  },
  {
    rank: 9,
    name: 'Houston',
    state: 'Texas',
    slug: 'texas/houston',
    population: '~70,000-90,000 Filipinos',
    highlight: 'Rapidly growing community drawn to the Texas Medical Center and energy industry',
    keyDistricts: 'Bellaire, Jersey Village, Sugar Land',
  },
  {
    rank: 10,
    name: 'Virginia Beach',
    state: 'Virginia',
    slug: 'virginia/virginia-beach',
    population: 'Substantial military-rooted community',
    highlight: 'Home to Naval Station Norfolk, the largest naval base in the world, attracting generations of Filipino sailors',
    keyDistricts: 'Virginia Beach, Norfolk, Chesapeake',
  },
]

const moreCities = [
  {
    name: 'Riverside-San Bernardino',
    state: 'California',
    slug: 'california/riverside-san-bernardino',
    population: '~136,000 Filipinos',
    highlight: 'One of the top 10 Filipino metro areas in the U.S., growing rapidly as LA spillover brings families to the Inland Empire',
    keyDistricts: 'Riverside, Corona, Rancho Cucamonga, Chino Hills',
  },
  {
    name: 'San Jose',
    state: 'California',
    slug: 'california/san-jose',
    population: '~109,000 Filipinos',
    highlight: 'Silicon Valley\'s Filipino community blends tech workers, healthcare professionals, and multi-generational families',
    keyDistricts: 'South San Jose, Evergreen, Berryessa, Milpitas',
  },
  {
    name: 'Daly City',
    state: 'California',
    slug: 'california/daly-city',
    population: '~35% of the city',
    highlight: 'The highest concentration of Filipino Americans of any U.S. municipality, with Serramonte Center as a cultural hub',
    keyDistricts: 'Daly City, South San Francisco, San Bruno',
  },
  {
    name: 'Sacramento',
    state: 'California',
    slug: 'california/sacramento',
    population: 'Tens of thousands',
    highlight: 'California\'s capital region is home to a significant Filipino community centered in South Sacramento and Elk Grove',
    keyDistricts: 'South Sacramento, Florin Road, Elk Grove',
  },
  {
    name: 'Washington D.C.',
    state: 'District of Columbia',
    slug: 'district-of-columbia/washington',
    population: 'Large metro community',
    highlight: 'Filipino-Americans tied to military, government, and healthcare shape the capital region\'s cultural landscape',
    keyDistricts: 'Northern Virginia, Maryland suburbs, D.C.',
  },
  {
    name: 'Jersey City',
    state: 'New Jersey',
    slug: 'new-jersey/jersey-city',
    population: '100,000+ Filipinos across North Jersey',
    highlight: "A tight-knit, church-anchored community just a PATH train from NYC's Little Manila — where the East Coast Fil-Am story grows",
    keyDistricts: 'Journal Square, Bergenline Avenue (Union City), Woodbridge and Edison corridors',
  },
  {
    name: 'San Antonio',
    state: 'Texas',
    slug: 'texas/san-antonio',
    population: '30,000–50,000 Filipinos, military-rooted',
    highlight: 'Shaped by Lackland AFB and Fort Sam Houston — comfort food built for homecomings and fiestas, where military roots meet Tex-Mex soul',
    keyDistricts: 'Near Lackland AFB, Fort Sam Houston corridor, Southwest and Northwest sides',
  },
]

export default function MostMemorableCitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-4xl mx-auto px-4 py-16">
        <header className="mb-12">
          <nav className="text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="hover:underline">Guides</Link>
            <span className="mx-2">/</span>
            <span>Most Memorable Cities 2026</span>
          </nav>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Most Memorable Filipino Food Cities in America (2026)
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            A cultural journey through the 10 cities where Filipino food tells the story of diaspora, 
            community, and home—from plantation workers and Navy sailors to nurses and tech workers 
            building vibrant enclaves across the United States.
          </p>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> These aren't "best" lists—they're cultural maps. The rankings reflect 
              population size and cultural significance based on data from Pew Research Center, Migration 
              Policy Institute, and community sources.
            </p>
          </div>
        </header>

        <section className="prose prose-lg max-w-none mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why These Cities Matter</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Filipino-Americans are the third-largest Asian American group in the United States, with over 
            4.2 million people according to Pew Research Center.<sup><a href="#ref-1" className="text-blue-600">1</a></sup> But 
            Filipino food is more than what's on the plate—it's nurses finishing night shifts and stopping 
            for lumpia, families gathering after Sunday mass, and grandparents teaching their grandchildren 
            to love the dishes they grew up with.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            These 10 cities represent where Filipino-American communities have put down the deepest roots, 
            building cultural districts, restaurants, and gathering spaces that keep more than a century of 
            immigration history alive. From early cannery workers in Seattle to Navy families in San Diego 
            to casino workers in Las Vegas, each city tells a different story of how Filipinos made America home.
          </p>

          <p className="text-gray-700 leading-relaxed">
            The food follows the migration: turo-turo steam tables, kamayan feasts, Fil-Mex fusions, ube desserts, 
            and the familiar comfort of Jollibee Chickenjoy thousands of miles from Manila. This is where you'll 
            find it.
          </p>
        </section>

        <section className="space-y-12 mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">The 10 Most Memorable Cities</h2>

          {cities.map((city) => (
            <Link
              key={city.rank}
              href={`/${city.slug}`}
              className="block bg-white rounded-xl shadow-lg overflow-hidden border-l-8 border-blue-600 hover:shadow-2xl hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl font-bold">#{city.rank}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600">{city.name}</h3>
                      <p className="text-lg text-gray-600">{city.state}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2">
                    <p className="text-sm font-bold text-yellow-800 whitespace-nowrap">📊 {city.population}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {city.highlight}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🏘️</span> Key Filipino Districts
                  </h4>
                  <p className="text-gray-600">
                    {city.keyDistricts}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-blue-600 font-semibold flex items-center gap-2">
                    Click to explore the full {city.name} guide
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* NEW SECTION: 5 More Notable Cities */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">7 More Notable Filipino Food Cities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Beyond the top 10, these cities represent the next wave of Filipino-American communities—
              growing hubs where families are building new chapters of the Filipino story in America.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {moreCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="block bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:shadow-2xl hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                  <p className="text-purple-100">{city.state}</p>
                </div>

                <div className="p-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
                    <p className="text-sm font-semibold text-yellow-800">
                      📊 {city.population}
                    </p>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                    {city.highlight}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <span>🏘️</span> Key Areas
                    </h4>
                    <p className="text-sm text-gray-600">
                      {city.keyDistricts}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-purple-600 font-bold flex items-center gap-2 text-sm">
                      Explore the Guide
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gray-100 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Chose These Cities</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            These rankings are based on Filipino population data from Pew Research Center<sup><a href="#ref-1" className="text-blue-600">1</a></sup> 
            and the Migration Policy Institute,<sup><a href="#ref-4" className="text-blue-600">4</a></sup> combined with cultural 
            significance factors like designated Filipino districts, historical immigration patterns, and the density 
            of Filipino-owned restaurants and businesses.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We focused on cities where Filipino food and culture are not just present but integral to the city's 
            identity—where you can find official Filipino cultural districts, generations-old restaurants, and 
            communities that have been gathering for decades.
          </p>
        </section>

        <section className="border-t-2 border-gray-200 pt-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sources & References</h2>
          
          <ol className="text-sm text-gray-600 space-y-2">
            <li id="ref-1">
              1. Pew Research Center. "Asian Americans: Filipinos in the U.S." 
              <a href="https://www.pewresearch.org/race-and-ethnicity/fact-sheet/asian-americans-filipinos-in-the-u-s/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener">
                pewresearch.org
              </a>
            </li>
            <li id="ref-2">
              2. Pew Research Center. "Top 10 U.S. Metropolitan Areas by Filipino Population (2019)."
              <a href="https://www.pewresearch.org/chart/top-10-u-s-metropolitan-areas-by-filipino-population-2019/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener">
                pewresearch.org
              </a>
            </li>
            <li id="ref-3">
              3. The Filipino Chronicle. "Filipino Americans: Building Communities, Filipino Values & Visibility."
              <a href="https://thefilipinochronicle.com/2025/10/11/filipino-americans-building-communities-filipino-values-visibility-a-snapshot-of-their-historical-moments-and-socioeconomic-status/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener">
                thefilipinochronicle.com
              </a>
            </li>
            <li id="ref-4">
              4. Migration Policy Institute. "Filipino Population by State" (PDF).
              <a href="https://www.migrationpolicy.org/sites/default/files/datahub/Filipino_by_state_wCityTop15.pdf" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener">
                migrationpolicy.org
              </a>
            </li>
            <li id="ref-5">
              5. LA Taco. "Best Restaurants in Filipinotown."
              <a href="https://lataco.com/best-restaurants-filipinotown" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener">
                lataco.com
              </a>
            </li>
            <li>
              6. Additional city-specific sources: The Infatuation (SF, LA, Seattle), Conde Nast Traveler, Secret NYC, Las Vegas Citycast, and local Filipino community directories.
            </li>
          </ol>
        </section>

        <section className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Filipino Food Across America
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Browse our complete directory of Filipino restaurants, bakeries, and grocery stores
            across all 17 featured cities and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
            >
              Browse All Restaurants
            </Link>
            <Link
              href="/guides"
              className="inline-block bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
            >
              More Guides
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}