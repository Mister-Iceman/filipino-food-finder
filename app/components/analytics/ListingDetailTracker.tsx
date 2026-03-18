'use client'

import { useEffect } from 'react'
import { useTracker } from './Tracker'

interface Props {
  listingId: number
  listingName: string
  listingCategory: string
  listingCity: string
}

export default function ListingDetailTracker({ listingId, listingName, listingCategory, listingCity }: Props) {
  const { trackInteraction } = useTracker()

  useEffect(() => {
    trackInteraction({
      interaction_type: 'listing_view',
      listing_id: listingId,
      listing_name: listingName,
      listing_category: listingCategory,
      listing_city: listingCity,
    })
  // Only fire once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
