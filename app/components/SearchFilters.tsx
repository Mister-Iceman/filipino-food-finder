'use client'

import type { DishTag } from '../../lib/types/dish-tags'
import type { GroceryTag, UniversalTag } from '../../lib/types/search-filters'

const DISH_ELIGIBLE_TYPES = ['Restaurant', 'Quick Bites & Turo-Turo', 'Food Truck & Pop-Up']
const GROCERY_ELIGIBLE_TYPES = ['Supermarket & Grocery']

interface SearchFiltersProps {
  dishTags: DishTag[]
  groceryTags: GroceryTag[]
  universalTags: UniversalTag[]
  selectedDishSlugs: string[]
  selectedGrocerySlugs: string[]
  selectedUniversalSlugs: string[]
  categoryFilter: string
  onToggleDish: (slug: string) => void
  onToggleGrocery: (slug: string) => void
  onToggleUniversal: (slug: string) => void
}

interface TagPillProps {
  label: string
  emoji?: string | null
  isActive: boolean
  onClick: () => void
  activeClass: string
}

function TagPill({ label, emoji, isActive, onClick, activeClass }: TagPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
        isActive
          ? activeClass
          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
    </button>
  )
}

export default function SearchFilters({
  dishTags,
  groceryTags,
  universalTags,
  selectedDishSlugs,
  selectedGrocerySlugs,
  selectedUniversalSlugs,
  categoryFilter,
  onToggleDish,
  onToggleGrocery,
  onToggleUniversal,
}: SearchFiltersProps) {
  // Dish tags: show when no category filter, or for restaurant/quick-bites/food-truck types
  const showDishTags =
    !categoryFilter || DISH_ELIGIBLE_TYPES.includes(categoryFilter)

  // Grocery tags: show only for grocery/supermarket
  const showGroceryTags = GROCERY_ELIGIBLE_TYPES.includes(categoryFilter)

  const hasDishes = dishTags.length > 0
  const hasGrocery = groceryTags.length > 0
  const hasUniversal = universalTags.length > 0

  if (!hasDishes && !hasGrocery && !hasUniversal) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
      {/* Dish filter — restaurants / quick bites / food trucks */}
      {showDishTags && hasDishes && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            🍽️ Filter by dish
          </p>
          <div className="flex flex-wrap gap-2">
            {dishTags.map((tag) => (
              <TagPill
                key={tag.id}
                label={tag.name.split(' (')[0]}
                isActive={!!tag.slug && selectedDishSlugs.includes(tag.slug)}
                onClick={() => tag.slug && onToggleDish(tag.slug)}
                activeClass="bg-[#0038A8] text-white border-[#0038A8] shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Grocery filter — supermarket & grocery only */}
      {showGroceryTags && hasGrocery && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            🛒 Filter by product category
          </p>
          <div className="flex flex-wrap gap-2">
            {groceryTags.map((tag) => (
              <TagPill
                key={tag.id}
                label={tag.name}
                emoji={tag.emoji}
                isActive={selectedGrocerySlugs.includes(tag.slug)}
                onClick={() => onToggleGrocery(tag.slug)}
                activeClass="bg-green-600 text-white border-green-600 shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Universal tags — all business types */}
      {hasUniversal && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            ✨ Options & Features
          </p>
          <div className="flex flex-wrap gap-2">
            {universalTags.map((tag) => (
              <TagPill
                key={tag.id}
                label={tag.name}
                emoji={tag.emoji}
                isActive={selectedUniversalSlugs.includes(tag.slug)}
                onClick={() => onToggleUniversal(tag.slug)}
                activeClass="bg-purple-600 text-white border-purple-600 shadow-sm"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
