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

          {/* Los Angeles */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#1</span>
                <div>
                  <h3 className="text-3xl font-bold">Los Angeles</h3>
                  <p className="text-blue-100">California</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~500,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  Home to Historic Filipinotown, the first officially designated Filipinotown in the United States
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Historic Filipinotown, Eagle Rock, Carson, West Covina</p>
              </div>
              <Link
                href="/california/los-angeles"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full Los Angeles Guide →
              </Link>
            </div>
          </div>

          {/* San Francisco */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#2</span>
                <div>
                  <h3 className="text-3xl font-bold">San Francisco</h3>
                  <p className="text-blue-100">California</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~290,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  SOMA Pilipinas is the first Filipino Cultural Heritage District in a major U.S. city
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">SOMA Pilipinas, Daly City (Little Manila by the Bay), Excelsior District</p>
              </div>
              <Link
                href="/california/san-francisco"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full San Francisco Guide →
              </Link>
            </div>
          </div>

          {/* New York */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#3</span>
                <div>
                  <h3 className="text-3xl font-bold">New York</h3>
                  <p className="text-blue-100">New York</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~250,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  Little Manila in Woodside, Queens is the highest concentration of Filipino restaurants on the East Coast
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Woodside Queens, Jersey City, Staten Island</p>
              </div>
              <Link
                href="/new-york/new-york"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full New York Guide →
              </Link>
            </div>
          </div>

          {/* Honolulu */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#4</span>
                <div>
                  <h3 className="text-3xl font-bold">Honolulu</h3>
                  <p className="text-blue-100">Hawaii</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~214,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  Filipinos are the largest ethnic group in Hawaii, and Filipino food has become inseparable from local cuisine
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Kalihi, Waipahu, Ewa Beach</p>
              </div>
              <Link
                href="/hawaii/honolulu"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full Honolulu Guide →
              </Link>
            </div>
          </div>

          {/* San Diego */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#5</span>
                <div>
                  <h3 className="text-3xl font-bold">San Diego</h3>
                  <p className="text-blue-100">California</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~201,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  Deep U.S. Navy roots dating back over a century, with one of the highest Filipino populations in any major U.S. city
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Mira Mesa, National City, Chula Vista</p>
              </div>
              <Link
                href="/california/san-diego"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full San Diego Guide →
              </Link>
            </div>
          </div>

          {/* Las Vegas */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#6</span>
                <div>
                  <h3 className="text-3xl font-bold">Las Vegas</h3>
                  <p className="text-blue-100">Nevada</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~147,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  Filipino Town on Maryland Parkway was officially recognized in 2023 as Nevada's first Filipino district
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Filipino Town, Spring Valley, Henderson</p>
              </div>
              <Link
                href="/nevada/las-vegas"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full Las Vegas Guide →
              </Link>
            </div>
          </div>

          {/* Chicago */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#7</span>
                <div>
                  <h3 className="text-3xl font-bold">Chicago</h3>
                  <p className="text-blue-100">Illinois</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~145,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  One of the largest Filipino communities in the Midwest, with one of the largest Philippine Independence Day parades in the U.S.
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Lincoln Square, Albany Park, Skokie</p>
              </div>
              <Link
                href="/illinois/chicago"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full Chicago Guide →
              </Link>
            </div>
          </div>

          {/* Seattle */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#8</span>
                <div>
                  <h3 className="text-3xl font-bold">Seattle</h3>
                  <p className="text-blue-100">Washington</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~115,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  One of the oldest continuous Filipino communities in the United States, dating back to cannery workers in the early 1900s
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Beacon Hill, International District, Tukwila</p>
              </div>
              <Link
                href="/washington/seattle"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full Seattle Guide →
              </Link>
            </div>
          </div>

          {/* Houston */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#9</span>
                <div>
                  <h3 className="text-3xl font-bold">Houston</h3>
                  <p className="text-blue-100">Texas</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> ~70,000-90,000
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  Rapidly growing community drawn to the Texas Medical Center and energy industry
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Bellaire, Jersey Village, Sugar Land</p>
              </div>
              <Link
                href="/texas/houston"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full Houston Guide →
              </Link>
            </div>
          </div>

          {/* Virginia Beach */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold opacity-75">#10</span>
                <div>
                  <h3 className="text-3xl font-bold">Virginia Beach</h3>
                  <p className="text-blue-100">Virginia</p>
                </div>
              </div>
              <p className="text-lg mt-2">
                <strong>Filipino Population:</strong> Substantial military-rooted community
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                <p className="text-gray-700 leading-relaxed">
                  Home to Naval Station Norfolk, the largest naval base in the world, attracting generations of Filipino sailors
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Filipino Districts</h4>
                <p className="text-gray-600">Virginia Beach, Norfolk, Chesapeake</p>
              </div>
              <Link
                href="/virginia/virginia-beach"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Read the Full Virginia Beach Guide →
              </Link>
            </div>
          </div>
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