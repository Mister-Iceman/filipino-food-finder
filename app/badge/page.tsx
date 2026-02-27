import type { Metadata } from 'next'
import BadgePageClient from './BadgePageClient'

export const metadata: Metadata = {
  title: 'Embed Our Badge | FilipinoFoodNearMe.org',
  description: 'Display the FilipinoFoodNearMe.org community badge on your website to let customers know you\'re part of the directory.',
}

export default function BadgePage() {
  return <BadgePageClient />
}
