import type { Metadata } from 'next'
import ClaimListingClient from './ClaimListingClient'

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}

export default function ClaimListingPage() {
  return <ClaimListingClient />
}
