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

export default function MostMemorableCitiesPage() {
 const cities = [
  {
    rank: 1,
    name: 'Los Angeles',
    state: 'California',
    slug: '/california/los-angeles',  // Added leading slash
    population: '~500,000',
    highlight: 'Home to Historic Filipinotown, the first officially designated Filipinotown in the United States',
    keyDistricts: 'Historic Filipinotown, Eagle Rock, Carson, West Covina',
  },
  {
    rank: 2,
    name: 'San Francisco',
    state: 'California',
    slug: '/california/san-francisco',
    population: '~290,000',
    highlight: 'SOMA Pilipinas is the first Filipino Cultural Heritage District in a major U.S. city',
    keyDistricts: 'SOMA Pilipinas, Daly City (Little Manila by the Bay), Excelsior District',
  },
  {
    rank: 3,
    name: 'New York',
    state: 'New York',
    slug: '/new-york/new-york',
    population: '~250,000',
    highlight: 'Little Manila in Woodside, Queens is the highest concentration of Filipino restaurants on the East Coast',
    keyDistricts: 'Woodside Queens, Jersey City, Staten Island',
  },
  {
    rank: 4,
    name: 'Honolulu',
    state: 'Hawaii',
    slug: '/hawaii/honolulu',
    population: '~214,000',
    highlight: 'Filipinos are the largest ethnic group in Hawaii, and Filipino food has become inseparable from local cuisine',
    keyDistricts: 'Kalihi, Waipahu, Ewa Beach',
  },
  {
    rank: 5,
    name: 'San Diego',
    state: 'California',
    slug: '/california/san-diego',
    population: '~201,000',
    highlight: 'Deep U.S. Navy roots dating back over a century, with one of the highest Filipino populations in any major U.S. city',
    keyDistricts: 'Mira Mesa, National City, Chula Vista',
  },
  {
    rank: 6,
    name: 'Las Vegas',
    state: 'Nevada',
    slug: '/nevada/las-vegas',
    population: '~147,000',
    highlight: 'Filipino Town on Maryland Parkway was officially recognized in 2023 as Nevada\'s first Filipino district',
    keyDistricts: 'Filipino Town, Spring Valley, Henderson',
  },
  {
    rank: 7,
    name: 'Chicago',
    state: 'Illinois',
    slug: '/illinois/chicago',
    population: '~145,000',
    highlight: 'One of the largest Filipino communities in the Midwest, with one of the largest Philippine Independence Day parades in the U.S.',
    keyDistricts: 'Lincoln Square, Albany Park, Skokie',
  },
  {
    rank: 8,
    name: 'Seattle',
    state: 'Washington',
    slug: '/washington/seattle',
    population: '~115,000',
    highlight: 'One of the oldest continuous Filipino communities in the United States, dating back to cannery workers in the early 1900s',
    keyDistricts: 'Beacon Hill, International District, Tukwila',
  },
  {
    rank: 9,
    name: 'Houston',
    state: 'Texas',
    slug: '/texas/houston',
    population: '~70,000-90,000',
    highlight: 'Rapidly growing community drawn to the Texas Medical Center and energy industry',
    keyDistricts: 'Bellaire, Jersey Village, Sugar Land',
  },
  {
    rank: 10,
    name: 'Virginia Beach',
    state: 'Virginia',
    slug: '/virginia/virginia-beach',
    population: 'Substantial military-rooted community',
    highlight: 'Home to Naval Station Norfolk, the largest naval base in the world, attracting generations of Filipino sailors',
    keyDistricts: 'Virginia Beach, Norfolk, Chesapeake',
  },
]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
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

        {/* Introduction */}
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

        {/* Cities List */}
        <section className="space-y-12 mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">The 10 Most Memorable Cities</h2>

          {cities.map((city) => (
            <div key={city.rank} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-5xl font-bold opacity-75">#{city.rank}</span>
                  <div>
                    <h3 className="text-3xl font-bold">{city.name}</h3>
                    <p className="text-blue-100">{city.state}</p>
                  </div>
                </div>
                <p className="text-lg mt-2">
                  <strong>Filipino Population:</strong> {city.population}
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {city.highlight}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                  <p className="text-gray-600">
                    {city.keyDistricts}
                  </p>
                </div>

                <Link
                  href={`/${city.slug}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Read the Full {city.name} Guide →
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Methodology */}
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

        {/* Sources */}
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

        {/* CTA */}
        <section className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore All 10 City Guides
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Each city guide includes cultural history, neighborhood highlights, food influences, 
            and the most memorable Filipino restaurants in the area.
          </p>
          <Link
            href="/guides"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
          >
            View All City Guides
          </Link>
        </section>
      </article>
    </div>
  )
}