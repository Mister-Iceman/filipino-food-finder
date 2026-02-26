export interface GroceryTag {
  id: number
  name: string
  slug: string
  emoji: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface UniversalTag {
  id: number
  name: string
  slug: string
  emoji: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface BusinessGroceryTag {
  id: string
  business_id: number
  grocery_tag_id: number
  confirmed_count: number
  last_verified: string | null
  verified_by_owner: boolean
  created_at: string
  grocery_tags?: GroceryTag
}

export interface BusinessUniversalTag {
  id: string
  business_id: number
  universal_tag_id: number
  confirmed_count: number
  last_verified: string | null
  verified_by_owner: boolean
  created_at: string
  universal_tags?: UniversalTag
}

// Map: business_id → Map<tag_id, confirmed_count>
export type BusinessTagMap = Map<number, Map<number, number>>
