import type { Metadata } from 'next'
import ClaimListingClient from './ClaimListingClient'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://www.filipinofoodnearme.org/listings/${params.slug}`,
    },
  }
}

export default function ClaimListingPage() {
  return <ClaimListingClient />
}
