export interface BusinessOwner {
  id: string
  listing_id: number
  owner_email: string
  owner_name: string | null
  is_primary: boolean
  claimed_at: string
  dashboard_token: string
  created_at: string
}

export interface OwnerListing {
  id: number
  name: string
  slug: string
  address_street: string
  city: string
  state: string
  zip: string
  category_primary: string
  is_claimed: boolean
}

export interface TagStatus {
  tag_id: number
  confirmed_count: number
  verified_by_owner: boolean
}

export interface OwnerDashboardData {
  owner: Pick<BusinessOwner, 'listing_id' | 'owner_email' | 'owner_name' | 'is_primary' | 'claimed_at'>
  listing: OwnerListing
  dish_tag_statuses: TagStatus[]
  grocery_tag_statuses: TagStatus[]
  universal_tag_statuses: TagStatus[]
}

export interface PendingClaim {
  id: string
  listing_id: number
  listing_name: string
  listing_city: string
  listing_state: string
  owner_name: string
  owner_role: string
  owner_email: string
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at: string | null
}
