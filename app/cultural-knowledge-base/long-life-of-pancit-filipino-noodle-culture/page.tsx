import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'
import WhereToTryThis from '../../components/cultural-kb/WhereToTryThis'

export const metadata: Metadata = {
  title: 'The Long Life of Pancit: Unraveling the Philippines\' Noodle Culture | FilipinoFoodNearMe.org',
  description:
    'From birthday celebrations to regional variations — discover why pancit noodles are the most culturally significant dish in Filipino cuisine.',
  keywords: [
    'pancit',
    'Filipino noodles',
    'pancit bihon',
    'pancit canton',
    'pancit malabon',
    'pancit batil patong',
    'pancit molo',
    'Filipino birthday food',
    'mami noodle soup',
    'Filipino food near me',
  ],
  alternates: {
    canonical: 'https://www.filipinofoodnearme.org/cultural-knowledge-base/long-life-of-pancit-filipino-noodle-culture',
  },
  openGraph: {
    title: 'The Long Life of Pancit: Unraveling the Philippines\' Noodle Culture',
    description:
      'From birthday celebrations to regional variations — discover why pancit noodles are the most culturally significant dish in Filipino cuisine.',
    type: 'article',
    publishedTime: '2026-03-26',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/cultural-kb/long-life-pancit.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Long Life of Pancit: Unraveling the Philippines\' Noodle Culture',
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
  image: 'https://filipinofoodnearme.org/images/cultural-kb/long-life-pancit.jpg',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.filipinofoodnearme.org/cultural-knowledge-base/long-life-of-pancit-filipino-noodle-culture',
  },
}

export default function LongLifeOfPancitPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="long-life-of-pancit-filipino-noodle-culture" />

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
          <span className="text-gray-800">The Long Life of Pancit</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/cultural-kb/long-life-pancit.jpg"
          alt="The Long Life of Pancit: Unraveling the Philippines' Noodle Culture — FilipinoFoodNearMe.org"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/cultural-kb/long-life-pancit.jpg
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          From birthday celebrations to regional variations &mdash; discover why pancit noodles are the most culturally significant dish in Filipino cuisine.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── INTRO ── */}
          <p className="mb-6">
            Noodles are universally beloved, but in the Philippines, Pancit holds a sacred place at the center of the dining table. Introduced by Chinese traders centuries ago, the noodle was quickly embraced and localized, evolving into a dish that is deeply embedded in Filipino culture and celebrations.
          </p>

          {/* ── SYMBOLISM ── */}
          <h2 className="mt-10 mb-4">The Symbolism of the Noodle</h2>
          <p className="mb-6">
            If you attend a Filipino birthday party, graduation, or Noche Buena (Christmas Eve feast), you are guaranteed to find a massive platter of pancit. Inherited from Chinese tradition, the long, unbroken strands of the noodles symbolize wishes for good health, prosperity, and a long life. For this reason, it is practically considered bad luck to celebrate a milestone without it!
          </p>

          {/* ── MA MON LUK ── */}
          <h2 className="mt-10 mb-4">The Legend of Ma Mon Luk</h2>
          <p className="mb-6">
            While stir-fried noodles are a staple, noodle soups also have a fascinating history in the Philippines. In the early 20th century, a Cantonese immigrant named Ma Mon Luk arrived in the Philippines. To make a living, he created a comforting chicken noodle soup using Chinese egg noodles and sold it on the streets, calling it <strong>Mami</strong>. He ingeniously marketed his soup by offering free samples to students, providing them with a cheap, quick, and filling midday snack. Today, Mami is an iconic comfort food, representing the seamless integration of Chinese entrepreneurship into everyday Filipino life.
          </p>

          {/* ── REGIONAL VARIATIONS ── */}
          <h2 className="mt-10 mb-4">A Noodle for Every Region</h2>
          <p className="mb-6">
            Because the Philippines is a vast archipelago, the concept of pancit splintered into dozens of regional variations.
          </p>
          <ul>
            <li>
              <strong>Pancit Bihon &amp; Canton:</strong> The most ubiquitous versions. Bihon uses thin, translucent rice noodles, while Canton utilizes thicker, yellow egg noodles, often stir-fried with soy sauce, cabbage, carrots, and bits of chicken or shrimp.
            </li>
            <li>
              <strong>Pancit Malabon:</strong> Hailing from Malabon, this dish uses thick rice noodles tossed in a vibrant, orange shrimp-based sauce colored with annatto seeds (atsuete), lavishly topped with smoked fish, crushed pork rinds, and hard-boiled eggs.
            </li>
            <li>
              <strong>Pancit Batil Patong:</strong> A masterpiece from Tuguegarao in Cagayan Valley, this unique dish features noodles topped with minced carabao (water buffalo) meat, crushed pork-rind cracklings, and a fried egg, served with a side of egg drop soup.
            </li>
            <li>
              <strong>Pancit Molo:</strong> Originating from Molo, Iloilo, this isn&rsquo;t a stir-fry at all. It is a comforting soup featuring meat-filled wonton dumplings swimming in a rich chicken broth.
            </li>
          </ul>

        </div>

        {/* ── AFFILIATE CALLOUT: MAKE IT AT HOME ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Ready to stir-fry your own long-life noodles? You&rsquo;ll need a{' '}
            <a
              href="https://amzn.to/4tazAfS"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              heavy-duty carbon steel wok
            </a>
            {' '}to get that perfect &ldquo;wok hei&rdquo; flavor. Pair it with{' '}
            <a
              href="https://amzn.to/4uZ1f5m"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              authentic pancit bihon rice noodles
            </a>
            {' '}for the real thing.
          </p>
        </aside>

        <WhereToTryThis dishName="Pancit" />

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Ready to taste authentic pancit near you?</p>
          <p className="text-purple-200 mb-6">
            Find Filipino restaurants serving the real thing &mdash; from classic bihon to regional specialties.{' '}
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
