export type DishCategory = 'savory' | 'dessert'

export interface DishTag {
  id: number
  name: string
  slug: string | null
  category: DishCategory
  display_order: number
  is_active: boolean
  created_at?: string
}

export interface BusinessDishTag {
  id: string
  business_id: number
  dish_tag_id: number
  confirmed_count: number
  last_verified: string | null
  verified_by_owner: boolean
  created_at: string
  dish_tags?: DishTag
}

export interface ReviewDishTag {
  id: string
  rating_id: number
  dish_tag_id: number
  created_at: string
  dish_tags?: DishTag
}
