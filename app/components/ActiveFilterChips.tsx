'use client'

import type { DishTag } from '../../lib/types/dish-tags'
import type { GroceryTag, UniversalTag } from '../../lib/types/search-filters'

interface ActiveFilterChipsProps {
  selectedDishSlugs: string[]
  selectedGrocerySlugs: string[]
  selectedUniversalSlugs: string[]
  dishTags: DishTag[]
  groceryTags: GroceryTag[]
  universalTags: UniversalTag[]
  onRemoveDish: (slug: string) => void
  onRemoveGrocery: (slug: string) => void
  onRemoveUniversal: (slug: string) => void
  onClearTagFilters: () => void
}

interface ChipProps {
  label: string
  onRemove: () => void
  colorClass: string
}

function Chip({ label, onRemove, colorClass }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ml-0.5 hover:opacity-70 transition text-base leading-none"
      >
        ×
      </button>
    </span>
  )
}

export default function ActiveFilterChips({
  selectedDishSlugs,
  selectedGrocerySlugs,
  selectedUniversalSlugs,
  dishTags,
  groceryTags,
  universalTags,
  onRemoveDish,
  onRemoveGrocery,
  onRemoveUniversal,
  onClearTagFilters,
}: ActiveFilterChipsProps) {
  const hasAny =
    selectedDishSlugs.length > 0 ||
    selectedGrocerySlugs.length > 0 ||
    selectedUniversalSlugs.length > 0

  if (!hasAny) return null

  const activeDishTags = dishTags.filter(
    (t) => t.slug && selectedDishSlugs.includes(t.slug)
  )
  const activeGroceryTags = groceryTags.filter((t) =>
    selectedGrocerySlugs.includes(t.slug)
  )
  const activeUniversalTags = universalTags.filter((t) =>
    selectedUniversalSlugs.includes(t.slug)
  )

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
      <span className="text-sm text-gray-600 font-medium">Filtered by:</span>

      {activeDishTags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name.split(' (')[0]}
          colorClass="bg-[#0038A8]/10 text-[#0038A8] border-[#0038A8]/30"
          onRemove={() => tag.slug && onRemoveDish(tag.slug)}
        />
      ))}

      {activeGroceryTags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          colorClass="bg-green-50 text-green-800 border-green-200"
          onRemove={() => onRemoveGrocery(tag.slug)}
        />
      ))}

      {activeUniversalTags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          colorClass="bg-purple-50 text-purple-800 border-purple-200"
          onRemove={() => onRemoveUniversal(tag.slug)}
        />
      ))}

      <button
        type="button"
        onClick={onClearTagFilters}
        className="text-sm text-red-600 hover:text-red-800 font-medium underline ml-1"
      >
        Clear all
      </button>
    </div>
  )
}
