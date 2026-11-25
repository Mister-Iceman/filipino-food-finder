import type { Metadata } from 'next'
import ClaimListingClient from './ClaimListingClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    robots: 'noindex, nofollow',
  }
}

export default function ClaimListingPage() {
  return <ClaimListingClient />
}
