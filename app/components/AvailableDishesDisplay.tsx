'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { BusinessDishTag } from '../../lib/types/dish-tags'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CONFIRMED_THRESHOLD = 3

function daysAgo(timestamp: string | null): string {
  if (!timestamp) return 'recently'
  const diff = Date.now() - new Date(timestamp).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

interface AvailableDishesDisplayProps {
  listingId: number
}

export default function AvailableDishesDisplay({ listingId }: AvailableDishesDisplayProps) {
  const [dishes, setDishes] = useState<BusinessDishTag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDishes() {
      const { data } = await supabase
        .from('business_dish_tags')
        .select('*, dish_tags(id, name, category, display_order)')
        .eq('business_id', listingId)
        .order('dish_tags(display_order)')

      setDishes(data || [])
      setLoading(false)
    }

    fetchDishes()
  }, [listingId])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-500 text-sm">Loading available dishes...</p>
      </div>
    )
  }

  if (dishes.length === 0) return null

  const savory = dishes.filter((d) => d.dish_tags?.category === 'savory')
  const desserts = dishes.filter((d) => d.dish_tags?.category === 'dessert')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-1">🍽️ Available Dishes</h3>
      <p className="text-sm text-gray-500 mb-5">
        Community-reported dishes at this location
      </p>

      {savory.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Savory
          </p>
          <div className="flex flex-wrap gap-2">
            {savory.map((entry) => (
              <DishBadge key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {desserts.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Desserts
          </p>
          <div className="flex flex-wrap gap-2">
            {desserts.map((entry) => (
              <DishBadge key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DishBadge({ entry }: { entry: BusinessDishTag }) {
  const isConfirmed = entry.confirmed_count >= CONFIRMED_THRESHOLD
  const isOwnerVerified = entry.verified_by_owner

  return (
    <div
      className={`inline-flex flex-col gap-0.5 px-3 py-2 rounded-lg border text-sm ${
        isConfirmed
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-gray-50 border-gray-200 text-gray-700'
      }`}
    >
      <span className="font-medium">{entry.dish_tags?.name}</span>
      <span className="flex flex-wrap items-center gap-1 text-xs">
        {isConfirmed && (
          <span className="text-green-700 font-semibold">✅ Community Confirmed</span>
        )}
        {isOwnerVerified && (
          <span className="text-purple-700 font-semibold">🏪 Owner Verified</span>
        )}
        {entry.last_verified && (
          <span className="text-gray-400">
            · Last verified: {daysAgo(entry.last_verified)}
          </span>
        )}
        {!isConfirmed && !isOwnerVerified && (
          <span className="text-gray-400">
            {entry.confirmed_count} report{entry.confirmed_count !== 1 ? 's' : ''}
          </span>
        )}
      </span>
    </div>
  )
}
