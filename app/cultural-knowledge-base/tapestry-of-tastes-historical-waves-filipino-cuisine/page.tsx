import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'A Tapestry of Tastes: The Historical Waves That Shaped the \'Original Fusion\' Cuisine | FilipinoFoodNearMe.org',
  description:
    'From pre-colonial adobo to Chinese pancit and Spanish kaldereta — trace the fascinating history that made Filipino cuisine the world\'s original fusion food.',
  keywords: [
    'Filipino food history',
    'Filipino fusion cuisine',
    'adobo origin',
    'Chinese influence Filipino food',
    'Spanish influence Filipino food',
    'Doreen Gamboa Fernandez',
    'Manila Acapulco galleon trade',
    'pre-colonial Filipino food',
    'Filipino cuisine culture',
    'Filipino food near me',
  ],
  alternates: {
    canonical: 'https://www.filipinofoodnearme.org/cultural-knowledge-base/tapestry-of-tastes-historical-waves-filipino-cuisine',
  },
  openGraph: {
    title: 'A Tapestry of Tastes: The Historical Waves That Shaped the \'Original Fusion\' Cuisine',
    description:
      'From pre-colonial adobo to Chinese pancit and Spanish kaldereta — trace the fascinating history that made Filipino cuisine the world\'s original fusion food.',
    type: 'article',
    publishedTime: '2026-03-26',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/cultural-kb/tapestry-of-tastes.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'A Tapestry of Tastes: The Historical Waves That Shaped the \'Original Fusion\' Cuisine',
  datePublished: '2026-03-26',
  dateModified: '2026-03-26',
  author: {
    '@type': 'Organization',
    name: 'FilipinoFoodNearMe.org',
    url: 'https://filipinofoodnearme.org',
  },
  publisher: {
    '@type': 'Organization',
    name: 'FilipinoFoodNearMe.org',
    url: 'https://filipinofoodnearme.org',
    logo: {
      '@type': 'ImageObject',
      url: 'https://filipinofoodnearme.org/logo.png',
    },
  },
  image: 'https://filipinofoodnearme.org/images/cultural-kb/tapestry-of-tastes.jpg',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.filipinofoodnearme.org/cultural-knowledge-base/tapestry-of-tastes-historical-waves-filipino-cuisine',
  },
}

export default function TapestryOfTastesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="tapestry-of-tastes-historical-waves-filipino-cuisine" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cultural-knowledge-base" className="hover:text-purple-700">Cultural Knowledge Base</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">A Tapestry of Tastes</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/cultural-kb/tapestry-of-tastes.jpg"
          alt="A Tapestry of Tastes: The Historical Waves That Shaped the Original Fusion Cuisine — FilipinoFoodNearMe.org"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/cultural-kb/tapestry-of-tastes.jpg
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          From pre-colonial adobo to Chinese pancit and Spanish kaldereta &mdash; trace the fascinating history that made Filipino cuisine the world&rsquo;s original fusion food.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── INTRO ── */}
          <p className="mb-6">
            As the late, great Filipino food historian Doreen Gamboa Fernandez once wrote, &ldquo;Writing about food should not be left to newspaper food columnists, or to restaurant reporters. It should be taken from us by historians of the culture... For it is an act of understanding, an extension of experience. If one can savor the word, then one can swallow the world.&rdquo;
          </p>
          <p className="mb-6">
            To truly understand Filipino cuisine &mdash; often described as one of the world&rsquo;s earliest fusion cuisines &mdash; you must look at the historical timeline of the Philippine archipelago. The dining table is a living record of maritime trade, ancient migrations, and centuries of colonization.
          </p>

          {/* ── PRE-COLONIAL ── */}
          <h2 className="mt-10 mb-4">The Pre-Colonial Era and the Truth About Adobo</h2>
          <p className="mb-6">
            Long before any Western ships reached the islands, the indigenous peoples of the Philippines (descendants of Austronesian and Malay migrations) had established a robust food culture based on the natural bounty of the land and sea. Early culinary methods relied on boiling, steaming, and roasting over open fires.
          </p>
          <p className="mb-6">
            Perhaps the biggest misconception in global gastronomy is the origin of <strong>Adobo</strong>. While the name is undeniably Spanish, the dish itself is completely indigenous to the Philippines. Long before Spanish colonization, native Filipinos were already preserving their meats and seafood by simmering them in a marinade of native vinegar and salt. When the Spanish colonizers arrived and witnessed this local cooking method, they called it <em>adobo</em>, derived from the Spanish verb &ldquo;adobar,&rdquo; which means to marinate. Today, the &ldquo;standard&rdquo; Filipino adobo has evolved to include vinegar, soy sauce, garlic, bay leaves, and black peppercorns, but its soul remains entirely pre-colonial.
          </p>

          {/* ── CHINESE ── */}
          <h2 className="mt-10 mb-4">The Chinese Trading Influence</h2>
          <p className="mb-6">
            The arrival of the Chinese in the Philippines predates the Spanish by at least five centuries. By the 10th century, Chinese merchants from the Fujian province were regularly trading with the locals. They brought with them ingredients that permanently altered the Filipino pantry, most notably <strong>soy sauce</strong> (<em>toyo</em>), which was incorporated into indigenous cuisine long before European contact.
          </p>
          <p className="mb-6">
            The linguistic impact of these early Chinese settlers on Filipino food is massive. Numerous staple dishes derive their names from the Hokkien dialect. For example, <strong>pancit</strong> (noodles), <strong>lumpia</strong> (spring rolls), <strong>siopao</strong> (steamed pork buns), <strong>siomai</strong> (dumplings), and <strong>taho</strong> (silken tofu with syrup) are all Hokkien loanwords that have been completely integrated into the Filipino culinary identity.
          </p>

          {/* ── SPANISH/MEXICAN ── */}
          <h2 className="mt-10 mb-4">The Spanish and Mexican Infusion</h2>
          <p className="mb-6">
            When the Spanish arrived in the 16th century, they brought a culinary shift that lasted over 300 years. Through the Manila-Acapulco galleon trade, the Spanish introduced New World crops from Mexico and the Americas, including tomatoes, corn, and potatoes. They also introduced the practice of sautéing (<em>gisa</em>) with garlic and onions, as well as slow-braised meat stews. Iconic celebratory dishes like <strong>Kaldereta</strong> (a rich tomato-based stew with liver spread) and <strong>Leche Flan</strong> (a rich custard dessert) trace their lineage back to this colonial era.
          </p>

        </div>

        {/* ── AFFILIATE CALLOUT: MAKE IT AT HOME ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Want to explore the deep historical roots of Filipino cooking? Pick up a copy of{' '}
            <a
              href="https://amzn.to/4ddUy8Z"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              &ldquo;Tikim: Essays on Philippine Food and Culture&rdquo; by Doreen G. Fernandez
            </a>
            {' '}and equip your kitchen with a{' '}
            <a
              href="https://amzn.to/4lUMdte"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              traditional bamboo steamer
            </a>
            {' '}for authentic preparation.
          </p>
        </aside>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Ready to taste history on a plate?</p>
          <p className="text-purple-200 mb-6">
            Find Filipino restaurants near you &mdash; where centuries of culinary history come alive in every bite.{' '}
            <span className="italic">Kain tayo!</span>
          </p>
          <Link
            href="/directory"
            className="inline-block bg-white text-purple-800 font-bold px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Find Filipino Food Near Me
          </Link>
        </div>

        {/* ── AMAZON ASSOCIATE DISCLAIMER ── */}
        <p className="mt-8 text-xs text-gray-400 leading-relaxed text-center">
          As an Amazon Associate, FilipinoFoodNearMe.org earns from qualifying purchases made through links in this article at no extra cost to you. Thank you for supporting our mission to share Filipino culture!
        </p>

      </div>
    </div>
  )
}
