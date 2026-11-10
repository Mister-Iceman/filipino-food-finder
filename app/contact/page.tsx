import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
  alternates: {
    canonical: 'https://filipinofoodnearme.org/contact/',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
