'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface RatingSummaryProps {
  listingId: number
  category: 'restaurant' | 'grocery'
}

export default function RatingSummary({ listingId, category }: RatingSummaryProps) {
  const [ratings, setRatings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRatings() {
      const { data } = await supabase
        .from('ratings')
        .select('*')
        .eq('listing_id', listingId)

      setRatings(data || [])
      setLoading(false)
    }

    fetchRatings()
  }, [listingId])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-500">Loading community insights...</p>
      </div>
    )
  }

  if (ratings.length === 0) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Be the first to rate!
        </h3>
        <p className="text-gray-700">
          Help the community by sharing your experience with this {category === 'restaurant' ? 'restaurant' : 'market'}.
        </p>
      </div>
    )
  }

  // Calculate aggregated data
  const totalRatings = ratings.length

  if (category === 'restaurant') {
    // Count taste styles
    const tasteStyles = ratings.reduce((acc: any, r) => {
      if (r.taste_style) acc[r.taste_style] = (acc[r.taste_style] || 0) + 1
      return acc
    }, {})

    const topTaste = Object.entries(tasteStyles).sort((a: any, b: any) => b[1] - a[1])[0]
    const tastePercent = topTaste ? Math.round((topTaste[1] as number / totalRatings) * 100) : 0
    const tasteLabel = topTaste ? topTaste[0] : ''

    // Average price
    const avgPrice = Math.round(
      ratings.filter(r => r.price).reduce((sum, r) => sum + r.price, 0) / 
      ratings.filter(r => r.price).length
    )

    // Average portion
    const avgPortion = Math.round(
      ratings.filter(r => r.portion_size).reduce((sum, r) => sum + r.portion_size, 0) / 
      ratings.filter(r => r.portion_size).length
    )

    // Good for percentages
    const goodForCounts: any = {}
    ratings.forEach(r => {
      if (r.good_for) {
        r.good_for.forEach((item: string) => {
          goodForCounts[item] = (goodForCounts[item] || 0) + 1
        })
      }
    })

    const goodForTop = Object.entries(goodForCounts)
      .map(([key, count]) => ({
        key,
        percent: Math.round((count as number / totalRatings) * 100)
      }))
      .filter(item => item.percent >= 30)
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3)

    // Parking
    const parkingCounts = ratings.reduce((acc: any, r) => {
      if (r.parking) acc[r.parking] = (acc[r.parking] || 0) + 1
      return acc
    }, {})
    const topParking = Object.entries(parkingCounts).sort((a: any, b: any) => b[1] - a[1])[0]

    const tasteLabels: any = {
      traditional: 'Traditional/Authentic',
      fusion: 'Fusion',
      americanized: 'Americanized'
    }

    const portionLabels = ['', 'Just right', 'Generous', 'Huge (leftovers!)']
    const priceLabels = ['', 'Budget-friendly', 'Moderate', 'Premium']
    const parkingLabels: any = {
      easy: 'Easy',
      street: 'Street parking',
      limited: 'Limited'
    }

    const goodForLabels: any = {
      families: 'Families',
      takeout: 'Takeout',
      date_night: 'Date night',
      large_groups: 'Large groups',
      quick_bite: 'Quick bite'
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ⭐ Community Insights
        </h3>
        <p className="text-sm text-gray-600 mb-6">Based on {totalRatings} rating{totalRatings > 1 ? 's' : ''}</p>

        <div className="space-y-4">
          {tasteLabel && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">🇵🇭 Taste:</span>
                <span className="font-bold text-gray-900">
                  {tastePercent}% say {tasteLabels[tasteLabel]}
                </span>
              </div>
            </div>
          )}

          {avgPrice > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">💵 Price:</span>
                <span className="font-bold text-gray-900">{priceLabels[avgPrice]}</span>
              </div>
            </div>
          )}

          {avgPortion > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">🍽️ Portions:</span>
                <span className="font-bold text-gray-900">{portionLabels[avgPortion]}</span>
              </div>
            </div>
          )}

          {goodForTop.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="text-gray-700 font-medium mb-2">✅ Good for:</div>
              <div className="space-y-1">
                {goodForTop.map(item => (
                  <div key={item.key} className="text-sm">
                    <span className="font-semibold text-gray-900">{goodForLabels[item.key]}</span>
                    <span className="text-gray-600"> ({item.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topParking && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">🅿️ Parking:</span>
                <span className="font-bold text-gray-900">{parkingLabels[topParking[0]]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } else {
    // Grocery ratings
    const whatTheyHaveCounts: any = {}
    ratings.forEach(r => {
      if (r.what_they_have) {
        r.what_they_have.forEach((item: string) => {
          whatTheyHaveCounts[item] = (whatTheyHaveCounts[item] || 0) + 1
        })
      }
    })

    const topItems = Object.entries(whatTheyHaveCounts)
      .map(([key, count]) => ({
        key,
        percent: Math.round((count as number / totalRatings) * 100)
      }))
      .sort((a, b) => b.percent - a.percent)

    const avgSelection = Math.round(
      ratings.filter(r => r.selection).reduce((sum, r) => sum + r.selection, 0) / 
      ratings.filter(r => r.selection).length
    )

    const avgPrice = Math.round(
      ratings.filter(r => r.price).reduce((sum, r) => sum + r.price, 0) / 
      ratings.filter(r => r.price).length
    )

    const readyToEatCounts = ratings.reduce((acc: any, r) => {
      if (r.ready_to_eat) acc[r.ready_to_eat] = (acc[r.ready_to_eat] || 0) + 1
      return acc
    }, {})
    const topReadyToEat = Object.entries(readyToEatCounts).sort((a: any, b: any) => b[1] - a[1])[0]

    const parkingCounts = ratings.reduce((acc: any, r) => {
      if (r.parking) acc[r.parking] = (acc[r.parking] || 0) + 1
      return acc
    }, {})
    const topParking = Object.entries(parkingCounts).sort((a: any, b: any) => b[1] - a[1])[0]

    const itemLabels: any = {
      produce: '🥬 Filipino vegetables',
      meat: '🥩 Meat/seafood',
      frozen: '🧊 Frozen meals',
      dry_goods: '🍚 Dry goods',
      bakery: '🥖 Bakery',
      ready_to_eat: '🍱 Ready-to-eat'
    }

    const selectionLabels = ['', 'Basic essentials', 'Good variety', 'Everything!']
    const priceLabels = ['', 'Budget-friendly', 'Moderate', 'Premium']
    
    const readyToEatLabels: any = {
      full_restaurant: 'Full restaurant/food court',
      hot_counter: 'Hot food counter',
      frozen_only: 'Frozen meals only',
      none: 'No ready-to-eat'
    }

    const parkingLabels: any = {
      easy: 'Easy',
      street: 'Street parking',
      limited: 'Limited'
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ⭐ Community Insights
        </h3>
        <p className="text-sm text-gray-600 mb-6">Based on {totalRatings} rating{totalRatings > 1 ? 's' : ''}</p>

        <div className="space-y-4">
          {topItems.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="text-gray-700 font-medium mb-2">🛒 What they have:</div>
              <div className="space-y-1">
                {topItems.map(item => (
                  <div key={item.key} className="text-sm">
                    <span className="font-semibold text-gray-900">{itemLabels[item.key]}</span>
                    <span className="text-gray-600"> ({item.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {avgSelection > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">📦 Selection:</span>
                <span className="font-bold text-gray-900">{selectionLabels[avgSelection]}</span>
              </div>
            </div>
          )}

          {avgPrice > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">💵 Price:</span>
                <span className="font-bold text-gray-900">{priceLabels[avgPrice]}</span>
              </div>
            </div>
          )}

          {topReadyToEat && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">🍱 Ready-to-eat:</span>
                <span className="font-bold text-gray-900">{readyToEatLabels[topReadyToEat[0]]}</span>
              </div>
            </div>
          )}

          {topParking && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">🅿️ Parking:</span>
                <span className="font-bold text-gray-900">{parkingLabels[topParking[0]]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}