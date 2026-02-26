'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { DishTag } from '../../lib/types/dish-tags'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Business types that QUALIFY for the dish selector.
// We use an allowlist so only known food-service types show dishes.
const DISH_SELECTOR_ALLOWED = [
  'restaurant',
  'quick bites',
  'turo-turo',
  'food truck',
  'pop-up',
]

function shouldShowDishSelector(businessType: string | undefined | null): boolean {
  if (!businessType) return false
  const lower = businessType.toLowerCase()
  return DISH_SELECTOR_ALLOWED.some((term) => lower.includes(term))
}

interface AvailableDishesSelectorProps {
  businessType: string | undefined | null
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export default function AvailableDishesSelector({
  businessType,
  selectedIds,
  onChange,
}: AvailableDishesSelectorProps) {
  const [dishes, setDishes] = useState<DishTag[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    async function fetchDishes() {
      const { data, error } = await supabase
        .from('dish_tags')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      if (error) {
        console.error('[AvailableDishesSelector] Failed to fetch dish_tags:', error.message)
        setFetchError(true)
      }
      setDishes(data || [])
      setLoading(false)
    }

    fetchDishes()
  }, [])

  if (!shouldShowDishSelector(businessType)) return null

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((v) => v !== id)
        : [...selectedIds, id]
    )
  }

  const savory = dishes.filter((d) => d.category === 'savory')
  const desserts = dishes.filter((d) => d.category === 'dessert')

  return (
    <div>
      <label className="block text-lg font-semibold text-gray-900 mb-1">
        Available Dishes{' '}
        <span className="text-sm text-gray-600 font-normal">(select all that apply)</span>
      </label>
      <p className="text-sm text-gray-500 mb-4">
        Check all dishes available at this restaurant
      </p>

      {loading ? (
        <p className="text-sm text-gray-400">Loading dishes...</p>
      ) : fetchError ? (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          ⚠️ Could not load dish list — the <code>dish_tags</code> table may not exist yet.
          Run the migration in Supabase and seed the dish tags.
        </p>
      ) : dishes.length === 0 ? (
        <p className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg p-3">
          No dish tags found. Run <code>supabase/seeds/dish_tags.sql</code> in the Supabase SQL editor.
        </p>
      ) : (
        <>
          {/* Savory */}
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            🍽️ Savory
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {savory.map((dish) => {
              const isSelected = selectedIds.includes(dish.id)
              return (
                <label
                  key={dish.id}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                    isSelected
                      ? 'border-[#0038A8] bg-[#0038A8]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(dish.id)}
                    className="sr-only"
                  />
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-[#0038A8] border-[#0038A8]'
                        : 'border-gray-300'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? 'text-[#0038A8]' : 'text-gray-700'
                    }`}
                  >
                    {dish.name}
                  </span>
                </label>
              )
            })}
          </div>

          {/* Desserts */}
          {desserts.length > 0 && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                🍨 Desserts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {desserts.map((dish) => {
                  const isSelected = selectedIds.includes(dish.id)
                  return (
                    <label
                      key={dish.id}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? 'border-[#FCD116] bg-[#FCD116]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggle(dish.id)}
                        className="sr-only"
                      />
                      <span
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-[#FCD116] border-[#FCD116]'
                            : 'border-gray-300'
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-gray-900" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {dish.name}
                      </span>
                    </label>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
