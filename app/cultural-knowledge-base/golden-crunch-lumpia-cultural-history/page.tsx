import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation | FilipinoFoodNearMe.org',
  description:
    'From ancient Chinese origins to Filipino-American tables — the cultural history of lumpia, its many variations, and why it\'s always the first dish to disappear.',
  keywords: [
    'lumpia',
    'lumpiang shanghai',
    'Filipino spring rolls',
    'Filipino food history',
    'lumpiang gulay',
    'lumpiang ubod',
    'Filipino-American food',
    'National Lumpia Day',
    'Filipino diaspora food',
    'Filipino food near me',
  ],
  openGraph: {
    title: 'The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation',
    description:
      'From ancient Chinese origins to Filipino-American tables — the cultural history of lumpia, its many variations, and why it\'s always the first dish to disappear.',
    type: 'article',
    publishedTime: '2026-03-20',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/lumpia-golden-crunch.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation',
  datePublished: '2026-03-20',
  dateModified: '2026-03-20',
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
  image: 'https://filipinofoodnearme.org/images/lumpia-golden-crunch.jpg',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://filipinofoodnearme.org/cultural-knowledge-base/golden-crunch-lumpia-cultural-history/',
  },
}

export default function GoldenCrunchLumpiaCulturalHistoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="golden-crunch-lumpia-cultural-history" />

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
          <span className="text-gray-800">The Golden Crunch: A Cultural History of Lumpia</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/lumpia-golden-crunch.jpg"
          alt="The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/lumpia-golden-crunch.jpg
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          From ancient Chinese origins to Filipino-American tables &mdash; the cultural history of <em>lumpia</em>, its many variations, and why it&rsquo;s always the first dish to disappear.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── INTRO ── */}
          <p className="mb-6">
            Whether you are attending a family reunion, a neighborhood fiesta, a birthday, or a wedding, there is one universal truth in Filipino dining: the golden, deep-fried spring rolls known as <strong>lumpia</strong> are almost always the first to vanish from the table. Crisp on the outside and incredibly savory on the inside, lumpia is a certified crowd-pleaser that embodies the warmth, hospitality, and communal joy of the Philippines.
          </p>

          {/* ── ANCIENT ORIGINS ── */}
          <h2 className="mt-10 mb-4">🏺 The Ancient Origins of the Spring Roll</h2>
          <p className="mb-6">
            While lumpia is undeniably a cornerstone of Philippine cuisine today, its ancestral roots trace back to ancient China. Originally, Chinese seasonal celebrations called for wraps or pancakes filled with fresh produce to herald the arrival of a new year. As maritime trade flourished across Southeast Asia, Chinese merchants and immigrants brought these culinary concepts to the Philippine archipelago. Over time, the dish evolved and adapted to the specific customs, preferences, and available ingredients of the islands &mdash; transforming into lumpia, characterized by their distinctively thin crepe wrappers that, when deep-fried, blister into a light, shattering, and crispy crunch.
          </p>

          {/* ── ANATOMY OF LUMPIA ── */}
          <h2 className="mt-10 mb-4">🥢 The Anatomy of Lumpia: From Shanghai to Ubod</h2>
          <p className="mb-6">
            The beauty of lumpia lies in its vast versatility, reflecting the rich agricultural diversity of the Philippines.
          </p>
          <p className="mb-6">
            <strong>Lumpiang Shanghai</strong> is the classic &mdash; a golden, cigar-shaped egg roll filled with a savory mixture of ground pork, minced onions, garlic, carrots, and seasonings like black pepper and soy sauce, rolled thin and deep-fried until perfectly golden.
          </p>
          <p className="mb-6">
            <strong>Lumpiang Gulay</strong> is the plant-based option, relying on a hearty mix of local produce with no meat.
          </p>
          <p className="mb-6">
            <strong>Lumpiang Ubod</strong> (Fresh Lumpia) proves that lumpia doesn&rsquo;t always need to be fried. These unfried rolls use a soft crepe-like wrapper filled with saut&eacute;ed vegetables &mdash; julienned jicama, green beans, carrots, lettuce, and <em>ubod</em> (heart of palm).
          </p>

        </div>

        {/* ── AFFILIATE CALLOUT 1: DEEP FRYER + FOOD PROCESSOR ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Fry large batches of Lumpiang Shanghai to golden perfection with a{' '}
            <a
              href="https://amzn.to/41jSvce"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Deep Fryer
            </a>
            {' '}&mdash; no more babysitting a pot of oil. Speed up your prep with a{' '}
            <a
              href="https://amzn.to/40Fwncd"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Food Processor
            </a>
            {' '}to mince carrots, onions, and garlic in seconds.
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── SOCIAL RITUAL ── */}
          <h2 className="mt-10 mb-4">🤝 The Magic Is in the Making: A Social Ritual</h2>
          <p className="mb-6">
            What truly elevates lumpia from a simple appetizer to a cultural phenomenon is how it is prepared. Making lumpia is a time-intensive practice &mdash; each roll wrapped individually &mdash; so the process has become deeply tied to holidays and family gatherings. In Filipino households, lumpia is rarely made solo. Large batches are rolled by several hands in a makeshift assembly line before frying. Gathering friends, aunties, and cousins around the kitchen table turns cooking into an event of shared storytelling and laughter. The charm of lumpia lies not just in its incredible taste, but in the way it brings people together.
          </p>

          {/* ── SAWSAWAN PAIRING ── */}
          <h2 className="mt-10 mb-4">🥣 The Perfect Pairing: Sawsawan</h2>
          <p className="mb-6">
            No plate of lumpia is complete without the proper <em>sawsawan</em> (dipping sauce). A fresh batch can be eaten as-is, but is most often served with sweet and sour sauce, sweet chili sauce, or a simple dip of soy sauce and spiced vinegar. The uniquely Filipino pairing is <strong>Banana Ketchup</strong> &mdash; a sweet and tangy condiment invented during a World War II tomato shortage &mdash; which has become the mandatory dipping sauce for Lumpiang Shanghai at children&rsquo;s parties and family feasts.
          </p>

        </div>

        {/* ── AFFILIATE CALLOUT 2: DIPPING BOWLS + BANANA KETCHUP ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Serve your array of dips in style with{' '}
            <a
              href="https://amzn.to/4saLhmU"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Ceramic Condiment Dipping Bowls
            </a>
            {' '}&mdash; perfect for keeping sauces neatly separated on the table. And no lumpia spread is complete without a bottle of{' '}
            <a
              href="https://amzn.to/4bE0Q0p"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Filipino Banana Ketchup
            </a>
            {' '}&mdash; the classic condiment for Lumpiang Shanghai.
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── GOING GLOBAL ── */}
          <h2 className="mt-10 mb-4">✈️ Going Global: Comfort Food for the Diaspora</h2>
          <p className="mb-6">
            As Filipinos migrated across the globe, they brought their beloved lumpia with them. Today, lumpia is a wildly popular comfort food among Filipino Americans and Overseas Filipino Workers. Because large batches can be easily rolled and frozen for later, it serves as an accessible, nostalgic reminder of home-cooked meals and family celebrations. From pop-up food trucks in California to Filipino-fusion bistros in New York, lumpia has successfully crossed over into the Western mainstream &mdash; the perfect entry-level gateway dish to introduce non-Filipinos to Philippine cuisine.
          </p>

          {/* ── NATIONAL LUMPIA DAY ── */}
          <h2 className="mt-10 mb-4">🗓️ Celebrating National Lumpia Day</h2>
          <p className="mb-6">
            The global love for this crispy delicacy sparked its very own unofficial holiday: <strong>National Lumpia Day</strong>, celebrated annually on March 16th. Originating within the Filipino-American community, it was created to honor the cultural heritage, family bonding, and culinary joy that lumpia represents. On this day, Filipino-owned restaurants, food trucks, and bakeries across the country host lumpia-rolling workshops, offer discounted platters of Lumpiang Shanghai, and feature creative fusion variations to celebrate the dish&rsquo;s incredible adaptability.
          </p>

          <p className="mb-6">
            Craving a fresh batch of lumpia but don&rsquo;t have the time to roll them yourself? Use our interactive directory at FilipinoFoodNearMe.org to find the crispiest, most authentic lumpia served at Filipino restaurants and markets in your neighborhood today!
          </p>

        </div>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Ready to find the crispiest lumpia near you?</p>
          <p className="text-purple-200 mb-6">
            Skip the rolling and go straight to the eating &mdash; find Filipino restaurants and markets serving authentic Lumpiang Shanghai in your city.{' '}
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
