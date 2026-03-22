import type { Metadata } from 'next'
import AdvertiseWizard from '../components/advertise/AdvertiseWizard'

export const metadata: Metadata = {
  title: 'Advertise With Us — FilipinoFoodNearMe.org',
  description:
    'Feature your Filipino food business or event to a growing community across all 50 states. Founding Advertiser pricing — 30% off, locked in for life.',
  openGraph: {
    title: 'Advertise With Us — FilipinoFoodNearMe.org',
    description:
      'Feature your Filipino food business or event to a growing community across all 50 states. Founding Advertiser pricing — 30% off, locked in for life.',
    siteName: 'Filipino Food Near Me',
    locale: 'en_US',
    type: 'website',
  },
}

export default function AdvertisePage() {
  return <AdvertiseWizard />
}
