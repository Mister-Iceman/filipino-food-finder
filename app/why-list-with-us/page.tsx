import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Why List Your Filipino Business With Us | FilipinoFoodNearMe.org',
  description: 'Get your Filipino restaurant, bakery, or grocery store found by the Filipino-American community. Free listing. Nationwide visibility. Positive-only ratings. No pay-to-rank. Ever.',
  openGraph: {
    title: 'Why List With Us | FilipinoFoodNearMe.org',
    description: 'Free, community-powered Filipino food directory. No pay-to-rank. Reach thousands of Filipino food lovers across America.',
  },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options = {}) =>
        fetch(url, { ...options, next: { revalidate: 3600 } }),
    },
  }
)

export const revalidate = 3600

const BENEFITS = [
  {
    icon: '✅',
    title: 'Free Listing',
    description: 'No fees, no subscriptions, no credit card required. Adding your business to our directory has always been free and always will be.',
  },
  {
    icon: '🗺️',
    title: 'Nationwide Visibility',
    description: 'Your listing appears in city guides, state directories, dish pages, and Google search results — reaching Filipino food lovers wherever they are.',
  },
  {
    icon: '⭐',
    title: 'Positive-Only Ratings',
    description: 'Our unique positive-first rating system is designed to protect small businesses. We celebrate what makes your restaurant great — no anonymous attacks, no review bombing.',
  },
  {
    icon: '📅',
    title: 'Events Calendar',
    description: 'Promote your pop-ups, specials, and Filipino food events to a dedicated audience actively looking for things to do and places to eat.',
  },
  {
    icon: '🤝',
    title: 'Community-First Directory',
    description: 'Built by and for the Filipino-American community. Every listing supports a free, open resource that brings our community together around food.',
  },
]

export default async function WhyListWithUsPage() {
  const { count: listingCount } = await supabase
    .from('listings').select('*', { count: 'exact', head: true })
  const { data: stateRows } = await supabase
    .from('listings').select('state')
  const stateCount = new Set(stateRows?.map((r: any) => r.state).filter(Boolean)).size

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#3A2060] via-[#62438D] to-[#92345A] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-4">
            For Filipino Food Business Owners
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Get Your Business Found by the Filipino-American Community
          </h1>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Free. Community-powered. No pay-to-rank. Ever.
          </p>
          <Link
            href="/add-business"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
          >
            Add Your Business Free →
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:divide-x divide-gray-200">
            <div className="text-center px-12 py-4 sm:py-0">
              <p className="text-6xl font-bold leading-none" style={{ color: '#62438D' }}>
                {(listingCount ?? 0).toLocaleString()}+
              </p>
              <p className="text-gray-500 mt-2 text-sm font-semibold uppercase tracking-widest">Listings Nationwide</p>
            </div>
            <div className="text-center px-12 py-4 sm:py-0">
              <p className="text-6xl font-bold leading-none" style={{ color: '#62438D' }}>{stateCount}</p>
              <p className="text-gray-500 mt-2 text-sm font-semibold uppercase tracking-widest">States Covered</p>
            </div>
            <div className="text-center px-12 py-4 sm:py-0">
              <p className="text-6xl font-bold leading-none" style={{ color: '#62438D' }}>5</p>
              <p className="text-gray-500 mt-2 text-sm font-semibold uppercase tracking-widest">Food Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Business Owners Choose Us
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((b, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-8">
              <div className="text-4xl mb-4">{b.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
              <p className="text-gray-600 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pitch paragraph */}
      <div className="bg-purple-50 border-y border-purple-100 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
            "While other directories just list addresses, we've built a {(listingCount ?? 0).toLocaleString()}+ business ecosystem with a positive-first rating system to protect local mom-and-pop shops from the toxicity of major review sites."
          </p>
          <p className="text-gray-500 text-sm">— FilipinoFoodNearMe.org</p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to reach thousands of Filipino food lovers?
        </h2>
        <p className="text-gray-500 mb-10 max-w-xl mx-auto">
          It takes less than 2 minutes. No account needed. No fees. Your listing goes live after a quick review.
        </p>
        <Link
          href="/add-business"
          className="inline-block bg-[#62438D] hover:bg-[#3A2060] text-white font-bold text-lg px-12 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
        >
          Add Your Business Free →
        </Link>
      </div>

    </div>
  )
}
