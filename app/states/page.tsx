import Link from 'next/link'
import { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Browse Filipino Food by State | Filipino Food Near Me',
  description: 'Explore Filipino restaurants, bakeries, and grocery stores across America. Find authentic Filipino food near you.',
}

export default function StatesIndexPage() {
  const states = [
    { name: 'Alabama', slug: 'alabama' },
    { name: 'Alaska', slug: 'alaska' },
    { name: 'Arizona', slug: 'arizona' },
    { name: 'Arkansas', slug: 'arkansas' },
    { name: 'California', slug: 'california', featured: true },
    { name: 'Colorado', slug: 'colorado' },
    { name: 'Connecticut', slug: 'connecticut' },
    { name: 'Delaware', slug: 'delaware' },
    { name: 'Florida', slug: 'florida' },
    { name: 'Georgia', slug: 'georgia' },
    { name: 'Hawaii', slug: 'hawaii', featured: true },
    { name: 'Idaho', slug: 'idaho' },
    { name: 'Illinois', slug: 'illinois', featured: true },
    { name: 'Indiana', slug: 'indiana' },
    { name: 'Iowa', slug: 'iowa' },
    { name: 'Kansas', slug: 'kansas' },
    { name: 'Kentucky', slug: 'kentucky' },
    { name: 'Louisiana', slug: 'louisiana' },
    { name: 'Maine', slug: 'maine' },
    { name: 'Maryland', slug: 'maryland' },
    { name: 'Massachusetts', slug: 'massachusetts' },
    { name: 'Michigan', slug: 'michigan' },
    { name: 'Minnesota', slug: 'minnesota' },
    { name: 'Mississippi', slug: 'mississippi' },
    { name: 'Missouri', slug: 'missouri' },
    { name: 'Montana', slug: 'montana' },
    { name: 'Nebraska', slug: 'nebraska' },
    { name: 'Nevada', slug: 'nevada', featured: true },
    { name: 'New Hampshire', slug: 'new-hampshire' },
    { name: 'New Jersey', slug: 'new-jersey' },
    { name: 'New Mexico', slug: 'new-mexico' },
    { name: 'New York', slug: 'new-york', featured: true },
    { name: 'North Carolina', slug: 'north-carolina' },
    { name: 'North Dakota', slug: 'north-dakota' },
    { name: 'Ohio', slug: 'ohio' },
    { name: 'Oklahoma', slug: 'oklahoma' },
    { name: 'Oregon', slug: 'oregon' },
    { name: 'Pennsylvania', slug: 'pennsylvania' },
    { name: 'Rhode Island', slug: 'rhode-island' },
    { name: 'South Carolina', slug: 'south-carolina' },
    { name: 'South Dakota', slug: 'south-dakota' },
    { name: 'Tennessee', slug: 'tennessee' },
    { name: 'Texas', slug: 'texas', featured: true },
    { name: 'Utah', slug: 'utah' },
    { name: 'Vermont', slug: 'vermont' },
    { name: 'Virginia', slug: 'virginia', featured: true },
    { name: 'Washington', slug: 'washington', featured: true },
    { name: 'West Virginia', slug: 'west-virginia' },
    { name: 'Wisconsin', slug: 'wisconsin' },
    { name: 'Wyoming', slug: 'wyoming' },
  ]

  const featuredStates = states.filter(s => s.featured)
  const allStates = states.filter(s => !s.featured)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Browse Filipino Food by State
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Explore authentic Filipino restaurants, bakeries, and grocery stores across America.
        </p>

        {/* Featured States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ⭐ Top Filipino Food States
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredStates.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                  {state.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* All States */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            All States
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allStates.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-400"
              >
                <h3 className="font-bold text-gray-900 hover:text-blue-600">
                  {state.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}