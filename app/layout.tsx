import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import CookieConsent from "./components/CookieConsent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Filipino Food Near Me | The First Community Filipino Food Directory in America",
  description: "The first and only community-driven Filipino food directory. Find authentic Filipino restaurants, bakeries, grocery stores, and food trucks across all 50 states. Built by the community, for the community.",
  keywords: [
    "filipino food near me",
    "filipino restaurant",
    "filipino grocery store",
    "lumpia near me",
    "filipino bakery",
    "pinoy food",
    "authentic filipino cuisine",
    "filipino food truck",
    "pancit",
    "adobo",
    "halo halo",
    "jollibee",
    "goldilocks",
    "red ribbon",
    "community directory",
    "filipino american food",
  ],
  authors: [{ name: "Filipino Food Near Me" }],
  creator: "Filipino Food Near Me",
  publisher: "Filipino Food Near Me",
  openGraph: {
    title: "Filipino Food Near Me | First Community Filipino Food Directory",
    description: "The first and only community-driven Filipino food directory in America. Discover authentic Filipino cuisine across all 50 states.",
    siteName: 'Filipino Food Near Me',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Filipino Food Near Me | First Community Filipino Food Directory",
    description: "Discover authentic Filipino restaurants, bakeries, and grocery stores across America.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-500 focus:text-gray-900 focus:font-bold focus:rounded"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  )
}