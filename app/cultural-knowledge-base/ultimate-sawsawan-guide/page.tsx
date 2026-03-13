import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'The Ultimate Sawsawan Guide: How Condiments and Dipping Sauces Define Filipino Cuisine | FilipinoFoodNearMe.org',
  description:
    'Discover sawsawan — the Filipino art of dipping sauces that puts flavor in the hands of the diner.',
  keywords: [
    'sawsawan',
    'Filipino dipping sauces',
    'Filipino condiments',
    'bagoong',
    'toyomansi',
    'banana ketchup',
    'Filipino vinegar',
    'sinamak',
    'patis fish sauce',
    'calamansi',
    'Filipino food near me',
  ],
  openGraph: {
    title: 'The Ultimate Sawsawan Guide: How Condiments and Dipping Sauces Define Filipino Cuisine',
    description:
      'Discover sawsawan — the Filipino art of dipping sauces that puts flavor in the hands of the diner.',
    type: 'article',
    publishedTime: '2026-03-13',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/ultimate-sawsawan-guide-hero.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Ultimate Sawsawan Guide: How Condiments and Dipping Sauces Define Filipino Cuisine',
  datePublished: '2026-03-13',
  dateModified: '2026-03-13',
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
  image: 'https://filipinofoodnearme.org/images/ultimate-sawsawan-guide-hero.png',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://filipinofoodnearme.org/cultural-knowledge-base/ultimate-sawsawan-guide/',
  },
}

export default function UltimateSawsawanGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="ultimate-sawsawan-guide" />

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
          <span className="text-gray-800">The Ultimate Sawsawan Guide</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/ultimate-sawsawan-guide-hero.png"
          alt="Filipino sawsawan dipping sauces — vinegar, toyomansi, bagoong, banana ketchup — The Ultimate Sawsawan Guide — FilipinoFoodNearMe.org"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/ultimate-sawsawan-guide-hero.png
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          Discover <em>sawsawan</em> &mdash; the Filipino art of dipping sauces that puts flavor in the hands of the diner.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── INTRO ── */}
          <p className="mb-6">
            If you&rsquo;ve ever sat down at a traditional Filipino table, you may have noticed something quietly extraordinary happen before anyone takes a single bite. Someone reaches for a small bowl, pours in a splash of vinegar, adds a squeeze of native citrus, crushes a clove of garlic, and tears a bird&rsquo;s-eye chili into the mix. No recipe was consulted.
          </p>
          <p className="mb-6">
            This is the art of <strong>sawsawan</strong> (dipping sauces). In the Philippines, a dish is rarely considered &ldquo;finished&rdquo; when it leaves the kitchen. The ultimate power is handed to the diner, who customizes the flavor profile to their exact specifications.
          </p>

          {/* ── PHILOSOPHY ── */}
          <h2 className="mt-10 mb-4">🧠 The Philosophy of Sawsawan</h2>
          <p className="mb-6">
            In many Western fine-dining cultures, asking for a condiment can be seen as an insult to the chef. Filipino food culture turns this entirely on its head. Food historian Doreen G. Fernandez wrote that sawsawan is a tool for &ldquo;indigenization&rdquo; &mdash; a way for Filipinos to take any food and apply their own personalized flavor to it. Sawsawan is passed down through generations not through written recipes, but through observation and practice.
          </p>

          {/* ── FIVE FLAVOR PILLARS ── */}
          <h2 className="mt-10 mb-4">⚖️ The Five Flavor Pillars</h2>
          <p className="mb-6">
            Filipino cuisine is built on five core flavor principles: <em>tamis</em> (sweet), <em>asim</em> (sour), <em>alat</em> (salty), <em>pait</em> (bitter), and <em>linamnam</em> (deep, emotionally satisfying umami). The sawsawan station is your toolkit for balancing these elements.
          </p>

          {/* ── SUKA ── */}
          <h2 className="mt-10 mb-4">🍶 Suka — Vinegar and Spiced Vinegars</h2>
          <p className="mb-6">
            Vinegar is the undisputed king of Filipino condiments. The Philippines boasts native vinegars from coconut sap, sugar cane, palm, and pineapple. <strong>Sinamak</strong> from Bacolod is a fierce spiced sugarcane vinegar steeped with garlic, ginger, peppercorns, and bird&rsquo;s-eye chilies. <strong>Pinakurat</strong> from Mindanao is made from fermented coconut sap. A splash of spiced vinegar is mandatory with deep-fried dishes like Crispy Pata or Lechon Kawali.
          </p>
        </div>

        {/* ── AFFILIATE CALLOUT: SUKA ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Set up your own sawsawan station at home. A set of{' '}
            <a
              href="https://amzn.to/4saLhmU"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Ceramic Condiment Dipping Bowls
            </a>
            {' '}keeps your sauces neatly separated and looks beautiful on the table. Stock up on authentic{' '}
            <a
              href="https://amzn.to/4sJMYaL"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Filipino Coconut Vinegar / Pinakurat
            </a>
            {' '}&mdash; once you taste the real thing, regular vinegar won&rsquo;t cut it.
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── TOYO, PATIS, CALAMANSI ── */}
          <h2 className="mt-10 mb-4">🍋 Toyo, Patis, and Calamansi</h2>
          <p className="mb-6">
            Soy sauce (<em>toyo</em>) provides an earthy, salty base, almost always paired with <strong>calamansi</strong> &mdash; a native Philippine citrus offering bright, floral sourness that tastes like a cross between a lime and a tangerine. The resulting <strong>Toyomansi</strong> is the ultimate dipping sauce for grilled meats. For a deeper, funkier saltiness, Filipinos turn to <strong>Patis</strong> (fish sauce), which provides umami depth that plain salt cannot achieve.
          </p>

          {/* ── BAGOONG ── */}
          <h2 className="mt-10 mb-4">🦐 Bagoong — Fermented Seafood Paste</h2>
          <p className="mb-6">
            Perhaps the most polarizing but beloved condiment, bagoong is made from fermented shrimp (<em>bagoong alamang</em>) or small fish. It is an absolute necessity alongside <strong>Kare-Kare</strong> (oxtail stew in peanut sauce), and the traditional dip for crunchy slices of unripe green mango.
          </p>

          {/* ── BANANA KETCHUP ── */}
          <h2 className="mt-10 mb-4">🍌 Banana Ketchup</h2>
          <p className="mb-6">
            During World War II, food technologist and war heroine <strong>Maria Orosa</strong> ingeniously utilized the country&rsquo;s abundant saba bananas to create <strong>Banana Ketchup</strong> &mdash; mashing them with vinegar, sugar, and spices, and adding red food coloring. Today it is the mandatory dipping sauce for Lumpiang Shanghai, the glaze for Filipino street barbecue, and the secret ingredient in sweet Filipino spaghetti.
          </p>
        </div>

        {/* ── AFFILIATE CALLOUT: BANANA KETCHUP ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> No Filipino pantry is complete without a bottle of{' '}
            <a
              href="https://amzn.to/4bE0Q0p"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Jufran Banana Ketchup
            </a>
            {' '}&mdash; the essential dipping sauce for Lumpiang Shanghai and the secret ingredient in Filipino spaghetti.
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── REGIONAL TREASURES ── */}
          <h2 className="mt-10 mb-4">🗺️ Regional Treasures</h2>
          <p className="mb-6">
            In Mindanao, the defining condiment is <strong>Palapa</strong> &mdash; a spicy mixture of sakurab (native white scallion), ginger, and chilies. In Manila&rsquo;s streets, <strong>Manong&rsquo;s Sauce</strong> reigns &mdash; a sweet, savory, tangy brown sauce made from cornstarch, brown sugar, soy sauce, and garlic, served with fishballs, squid balls, and kwek-kwek (fried quail eggs).
          </p>
        </div>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Ready to put your sawsawan knowledge to work?</p>
          <p className="text-purple-200 mb-6">
            The next time you order from a spot on FilipinoFoodNearMe.org, ask for extra calamansi, toyo, and suka &mdash; and don&rsquo;t be afraid to play with your food.{' '}
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
