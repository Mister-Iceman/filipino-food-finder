'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

interface SponsoredBusiness {
  name: string
  slug: string
  city: string
  state: string
  category: string
}

interface Listing {
  id: number
  name: string
  slug: string
  city: string
  state: string
  category_primary: string
}

interface Props {
  dishName: string
  sponsoredBusiness?: SponsoredBusiness
}

export default function WhereToTryThis({ dishName, sponsoredBusiness }: Props) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const { data } = await supabase
        .from('listings')
        .select('id, name, slug, city, state, category_primary')
        .not('slug', 'is', null)
        .not('city', 'is', null)
        .limit(100)

      if (data && data.length > 0) {
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, sponsoredBusiness ? 3 : 4)
        setListings(shuffled)
      }
      setLoading(false)
    }
    fetchListings()
  }, [sponsoredBusiness])

  if (loading) return null

  return (
    <div className="my-10 p-6 bg-amber-50 border border-amber-200 rounded-2xl not-prose">
      <h3 className="text-xl font-bold text-gray-900 mb-1">Where to Try {dishName} Near You</h3>
      <p className="text-sm text-gray-500 mb-5">
        Filipino restaurants and markets serving this dish across the U.S.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sponsoredBusiness && (
          <div className="bg-white rounded-xl p-4 flex flex-col justify-between border-2 border-yellow-400 shadow-sm">
            <div>
              <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 mb-2">
                Featured Sponsor
              </span>
              <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">{sponsoredBusiness.name}</p>
              <p className="text-xs text-gray-400">{sponsoredBusiness.city}, {sponsoredBusiness.state}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sponsoredBusiness.category.replace(/&amp;/g, '&')}</p>
            </div>
            <Link
              href={`/listings/${sponsoredBusiness.slug}`}
              className="mt-3 inline-block text-center text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: '#62438D' }}
            >
              View Listing →
            </Link>
          </div>
        )}

        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-xl p-4 flex flex-col justify-between border-2 border-gray-100 hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">{listing.name}</p>
              <p className="text-xs text-gray-400">{listing.city}, {listing.state}</p>
              <p className="text-xs text-gray-400 mt-0.5">{listing.category_primary?.replace(/&amp;/g, '&')}</p>
            </div>
            <Link
              href={`/listings/${listing.slug}`}
              className="mt-3 inline-block text-center text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: '#62438D' }}
            >
              View Listing →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl px-5 py-4"
        style={{ background: 'linear-gradient(135deg, #fffbeb, #fff7ed)' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">⭐</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">Feature Your Business Here</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Sponsor this article and get your restaurant highlighted to thousands of Filipino food lovers searching for authentic {dishName}.
            </p>
          </div>
        </div>
        <Link
          href="/advertise"
          className="shrink-0 text-sm font-bold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 whitespace-nowrap"
          style={{ background: '#62438D' }}
        >
          Learn About Sponsorships →
        </Link>
      </div>
    </div>
  )
}
