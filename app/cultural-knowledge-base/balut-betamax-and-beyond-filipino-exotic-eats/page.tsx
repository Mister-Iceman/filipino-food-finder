import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'Balut, Betamax, and Beyond: The Adventurous Side of Filipino Exotic Eats | FilipinoFoodNearMe.org',
  description:
    'From balut to isaw to tamilok — explore the bold, zero-waste street food culture that makes Filipino cuisine one of the world\'s most adventurous.',
  keywords: [
    'balut',
    'betamax Filipino food',
    'isaw',
    'tamilok',
    'Filipino exotic food',
    'Filipino street food',
    'adidas chicken feet',
    'Filipino zero waste cooking',
    'Filipino adventurous eats',
    'Filipino food near me',
  ],
  alternates: {
    canonical: 'https://www.filipinofoodnearme.org/cultural-knowledge-base/balut-betamax-and-beyond-filipino-exotic-eats',
  },
  openGraph: {
    title: 'Balut, Betamax, and Beyond: The Adventurous Side of Filipino Exotic Eats',
    description:
      'From balut to isaw to tamilok — explore the bold, zero-waste street food culture that makes Filipino cuisine one of the world\'s most adventurous.',
    type: 'article',
    publishedTime: '2026-03-24',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/cultural-kb/balut-betamax-and-beyond.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Balut, Betamax, and Beyond: The Adventurous Side of Filipino Exotic Eats',
  datePublished: '2026-03-24',
  dateModified: '2026-03-24',
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
  image: 'https://filipinofoodnearme.org/images/cultural-kb/balut-betamax-and-beyond.jpg',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.filipinofoodnearme.org/cultural-knowledge-base/balut-betamax-and-beyond-filipino-exotic-eats',
  },
}

export default function BalutBetamaxAndBeyondPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="balut-betamax-and-beyond-filipino-exotic-eats" />

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
          <span className="text-gray-800">Balut, Betamax, and Beyond</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/cultural-kb/balut-betamax-and-beyond.jpg"
          alt="Balut, Betamax, and Beyond: The Adventurous Side of Filipino Exotic Eats — FilipinoFoodNearMe.org"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/cultural-kb/balut-betamax-and-beyond.jpg
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          From balut to isaw to tamilok &mdash; explore the bold, zero-waste street food culture that makes Filipino cuisine one of the world&rsquo;s most adventurous.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── INTRO ── */}
          <p className="mb-6">
            Filipino cuisine is famously resourceful, ensuring that absolutely nothing goes to waste. This zero-waste philosophy has given rise to a vibrant, gritty, and fiercely beloved street food culture that often challenges the uninitiated palate. For the adventurous foodie, the Philippines offers a thrilling culinary frontier.
          </p>

          {/* ── BALUT ── */}
          <h2 className="mt-10 mb-4">🥚 The Infamous Balut</h2>
          <p className="mb-6">
            No exotic food list is complete without <strong>Balut</strong>. This fertilized duck egg, incubated until the embryo is partially developed and then boiled, is a popular late-night street snack. Eating it is a ritual: you crack the top of the shell, sip the rich, savory broth inside, and then eat the yolk and embryo, usually seasoned with a pinch of rock salt or a splash of spicy vinegar. While it has been sensationalized on Western television, it is prized locally for its incredibly rich, velvety flavor and is considered a staple of Filipino street culture.
          </p>

          {/* ── STREET SKEWERS ── */}
          <h2 className="mt-10 mb-4">🍢 Street Skewers: Adidas and Betamax</h2>
          <p className="mb-6">
            Walk down any busy Manila street at dusk, and the smell of charcoal grills will lead you to vendors selling heavily marinated offal skewers. The names of these snacks showcase the legendary Filipino sense of humor:
          </p>
          <ul>
            <li>
              <strong>Betamax:</strong> Rectangular, coagulated blocks of chicken or pig&rsquo;s blood grilled on a stick, humorously named because they resemble the chunky black cassette tapes of the 1980s.
            </li>
            <li>
              <strong>Adidas:</strong> Grilled chicken feet, jokingly named after the famous shoe brand with three stripes.
            </li>
            <li>
              <strong>Isaw:</strong> Beautifully charred, spiraled chicken or pork intestines that are chewy, smoky, and best drowned in chili-infused vinegar.
            </li>
          </ul>

          {/* ── TAMILOK ── */}
          <h2 className="mt-10 mb-4">🌊 Regional Exotics: The Tamilok</h2>
          <p className="mb-6">
            Outside the capital, the provinces offer their own unique delicacies. In Palawan and Aklan, locals harvest <strong>Tamilok</strong>, often referred to as a woodworm or shipworm, though it is actually a type of saltwater clam. Extracted from rotting mangrove trees, it is eaten raw like a slimy oyster and marinated in a sharp vinegar <em>kinilaw</em> bath. It is a prized delicacy that tests the courage of tourists but rewards them with a taste of the sea.
          </p>

        </div>

        {/* ── AFFILIATE CALLOUT: MAKE IT AT HOME ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Want to recreate the smoky magic of Manila street food? You&rsquo;ll need the right gear. A{' '}
            <a
              href="https://amzn.to/4uV3UwY"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Japanese yakitori charcoal grill
            </a>
            {' '}delivers that authentic smokiness you can&rsquo;t get from gas. Pair it with{' '}
            <a
              href="https://amzn.to/4d7QPtJ"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              heavy-duty bamboo skewers
            </a>
            {' '}that won&rsquo;t burn through during grilling &mdash; essential for isaw, betamax, and adidas alike.
          </p>
        </aside>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Ready to taste the adventurous side of Filipino food?</p>
          <p className="text-purple-200 mb-6">
            Find Filipino restaurants and street food spots near you &mdash; from classic turo-turo carinderias to modern Filipino kitchens.{' '}
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
