import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'From Rations to Riches: How American Influence Birthed Filipino Spaghetti and Fast Food | FilipinoFoodNearMe.org',
  description:
    'From Spam to banana ketchup to Jollibee — discover how American colonial influence and WWII rations permanently transformed Filipino comfort food.',
  keywords: [
    'Filipino spaghetti',
    'banana ketchup history',
    'Jollibee history',
    'American influence Filipino food',
    'WWII Filipino food',
    'Spam Filipino cuisine',
    'Maria Orosa',
    'corned beef silog',
    'Filipino comfort food',
    'Filipino food near me',
  ],
  alternates: {
    canonical: 'https://www.filipinofoodnearme.org/cultural-knowledge-base/from-rations-to-riches-american-influence-filipino-food',
  },
  openGraph: {
    title: 'From Rations to Riches: How American Influence Birthed Filipino Spaghetti and Fast Food',
    description:
      'From Spam to banana ketchup to Jollibee — discover how American colonial influence and WWII rations permanently transformed Filipino comfort food.',
    type: 'article',
    publishedTime: '2026-04-01',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/cultural-kb/rations-to-riches.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'From Rations to Riches: How American Influence Birthed Filipino Spaghetti and Fast Food',
  datePublished: '2026-04-01',
  dateModified: '2026-04-01',
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
  image: 'https://filipinofoodnearme.org/images/cultural-kb/rations-to-riches.jpg',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.filipinofoodnearme.org/cultural-knowledge-base/from-rations-to-riches-american-influence-filipino-food',
  },
}

export default function RationsToRichesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="from-rations-to-riches-american-influence-filipino-food" />

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
          <span className="text-gray-800">From Rations to Riches</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/cultural-kb/rations-to-riches.jpg"
          alt="From Rations to Riches: How American Influence Birthed Filipino Spaghetti and Fast Food — FilipinoFoodNearMe.org"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/cultural-kb/rations-to-riches.jpg
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          From Spam to banana ketchup to Jollibee &mdash; discover how American colonial influence and WWII rations permanently transformed Filipino comfort food.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── INTRO ── */}
          <p className="mb-6">
            While the Spanish brought deep historical changes to the Filipino palate, the American colonial period (beginning in 1898) and the subsequent events of World War II introduced a wave of modern industrialization and convenience that birthed an entirely new category of Filipino comfort food.
          </p>

          {/* ── CANNED GOODS ── */}
          <h2 className="mt-10 mb-4">🥫 The Canned Goods Revolution</h2>
          <p className="mb-6">
            During and after World War II, the influx of American military rations fundamentally changed the Filipino pantry. Canned goods like Spam, corned beef, and evaporated milk were introduced to the populace. Rather than eating these foods straight from the tin as intended, Filipinos applied their genius for adaptation. Today, sautéing canned corned beef with garlic and onions to serve over garlic fried rice (<strong>Corned Beef Silog</strong>) is a cherished national breakfast.
          </p>

          {/* ── BANANA KETCHUP ── */}
          <h2 className="mt-10 mb-4">🍌 The Birth of Banana Ketchup</h2>
          <p className="mb-6">
            During WWII, the Philippines faced a massive shortage of tomatoes, making traditional American ketchup impossible to produce. Enter <strong>Maria Orosa</strong>, a brilliant Filipina food technologist and war heroine. Utilizing the country&rsquo;s abundant supply of saba bananas, she mashed them with vinegar, sugar, and spices, adding red food coloring to mimic the look of tomato ketchup. The result was <strong>Banana Ketchup</strong> &mdash; a sweeter, tangier condiment that became a massive hit and remains a mandatory dipping sauce for fried foods today.
          </p>

          {/* ── FILIPINO SPAGHETTI ── */}
          <h2 className="mt-10 mb-4">🍝 Filipino Spaghetti and the Fast Food Phenomenon</h2>
          <p className="mb-6">
            American troops also introduced spaghetti, but the local adaptation is wildly different from its Italian-American ancestor. <strong>Filipino Spaghetti</strong> features a remarkably sweet sauce &mdash; often sweetened with sugar, condensed milk, and generous glugs of Banana Ketchup &mdash; and is heavily studded with sliced red hotdogs and ground meat.
          </p>
          <p className="mb-6">
            This love for American-style convenience, tailored to the Filipino sweet-and-savory tooth, paved the way for the country&rsquo;s fast-food giant, <strong>Jollibee</strong>. Combining American fast-food concepts with undeniably local flavors, Jollibee serves up fried chicken (Chickenjoy) alongside sweet spaghetti and rice. It stands as one of the few local fast-food chains in the world to successfully outcompete McDonald&rsquo;s on its home turf, symbolizing the ultimate fusion of American influence and Filipino culinary identity.
          </p>

        </div>

        {/* ── AFFILIATE CALLOUT: MAKE IT AT HOME ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Experience the ultimate Filipino kid&rsquo;s party at home. Start with{' '}
            <a
              href="https://amzn.to/4m1L2rM"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              authentic Jufran Banana Ketchup
            </a>
            {' '}&mdash; the iconic sweet-tangy condiment that defines the flavor of Filipino spaghetti. Then grab a{' '}
            <a
              href="https://amzn.to/4sSVSDo"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Filipino Spaghetti Sauce Mix
            </a>
            {' '}to nail that signature sweetness on your first try.
          </p>
        </aside>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Ready to taste the American-Filipino fusion?</p>
          <p className="text-purple-200 mb-6">
            Find Filipino restaurants near you that serve sweet spaghetti, silog breakfasts, and all the comfort food classics born from this unique cultural meeting.{' '}
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
