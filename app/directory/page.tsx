'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DirectoryPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    const { data } = await supabase.from('listings').select('*').order('name', { ascending: true })
    if (data) setListings(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Restaurant Directory</h1>
        
        {loading && <div className="text-center py-12">Loading...</div>}

        <div className="grid md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{listing.name}</h2>
              <p className="text-gray-600 mb-4">{listing.category_primary}</p>
              <p className="text-sm text-gray-600">
                {listing.city}, {listing.state}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}