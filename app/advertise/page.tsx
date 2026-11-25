import type { Metadata } from 'next'
import AdvertiseWizard from '../components/advertise/AdvertiseWizard'
import { getNetworkStats } from '../../lib/site-stats'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Advertise With Us — FilipinoFoodNearMe.org',
  description:
    'Feature your Filipino food business or event to a growing community across the U.S. Founding Advertiser pricing — 30% off, locked in for life.',
  openGraph: {
    title: 'Advertise With Us — FilipinoFoodNearMe.org',
    description:
      'Feature your Filipino food business or event to a growing community across the U.S. Founding Advertiser pricing — 30% off, locked in for life.',
    siteName: 'Filipino Food Near Me',
    locale: 'en_US',
    type: 'website',
  },
}

export default async function AdvertisePage() {
  const stats = await getNetworkStats()
  return <AdvertiseWizard stats={stats} />
}
