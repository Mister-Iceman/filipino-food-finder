import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'Beyond Ube: The Ultimate Guide to Filipino Desserts, Kakanin, and Kapeng Barako | FilipinoFoodNearMe.org',
  description:
    'From halo-halo to pandesal, explore the vibrant world of Filipino sweets, sticky rice cakes, and bakery culture across America.',
  keywords: [
    'Filipino desserts',
    'halo-halo',
    'kakanin',
    'bibingka',
    'suman',
    'pandesal',
    'ensaymada',
    'kapeng barako',
    'ube',
    'Filipino bakery near me',
    'Filipino sweets',
    'Filipino food near me',
  ],
  openGraph: {
    title: 'Beyond Ube: The Ultimate Guide to Filipino Desserts, Kakanin, and Kapeng Barako',
    description:
      'From halo-halo to pandesal, explore the vibrant world of Filipino sweets, sticky rice cakes, and bakery culture across America.',
    type: 'article',
    publishedTime: '2026-03-13',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/filipino-sweet-tooth-desserts-bakery-hero.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Beyond Ube: The Ultimate Guide to Filipino Desserts, Kakanin, and Kapeng Barako',
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
  image: 'https://filipinofoodnearme.org/images/filipino-sweet-tooth-desserts-bakery-hero.png',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://filipinofoodnearme.org/cultural-knowledge-base/filipino-sweet-tooth-desserts-bakery/',
  },
}

export default function FilipinoSweetToothPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="filipino-sweet-tooth-desserts-bakery" />

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
          <span className="text-gray-800">Beyond Ube: Filipino Desserts &amp; Bakery</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/filipino-sweet-tooth-desserts-bakery-hero.png"
          alt="Filipino desserts — halo-halo, bibingka, pandesal, ensaymada, and kapeng barako — Beyond Ube — FilipinoFoodNearMe.org"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/filipino-sweet-tooth-desserts-bakery-hero.png
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          From halo-halo to pandesal, explore the vibrant world of Filipino sweets, sticky rice cakes, and bakery culture across America.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── INTRO ── */}
          <p className="mb-6">
            While the savory flavors of Filipino cuisine are gaining worldwide recognition, no culinary journey is complete without exploring the vibrant, deeply comforting world of Filipino sweets and baked goods. In the Philippines, dessert isn&rsquo;t an after-dinner afterthought &mdash; it is woven into the very fabric of daily life.
          </p>

          {/* ── HALO-HALO ── */}
          <h2 className="mt-10 mb-4">🍧 Halo-Halo: The Undisputed King of Summer</h2>
          <p className="mb-6">
            If there is one dessert that perfectly encapsulates the beautiful, chaotic melting pot of Filipino culture, it is <strong>Halo-Halo</strong>. Translating literally to &ldquo;mix-mix,&rdquo; this towering dessert is a masterclass in contrasting textures and flavors.
          </p>
          <p className="mb-6">
            It starts with a base of finely shaved ice and evaporated milk, layered with sweetened red beans, jackfruit (<em>langka</em>), chewy tapioca pearls (<em>sago</em>), gelatin (<em>gulaman</em>), and toasted young rice (<em>pinipig</em>). The crowning glory: a thick slice of creamy leche flan and a generous scoop of vibrant purple Ube ice cream. To eat it correctly, you must aggressively mix everything together until it becomes a slushy, sweet, and refreshing treat.
          </p>
        </div>

        {/* ── AFFILIATE CALLOUT: HALO-HALO ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Halo-halo is surprisingly easy to recreate at home with the right equipment. An{' '}
            <a
              href="https://amzn.to/4dm24i5"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Electric Ice Shaver/Crusher
            </a>
            {' '}produces the perfectly fluffy, fine-shaved ice that defines the real thing. And{' '}
            <a
              href="https://amzn.to/4rt6zLa"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Tall Halo-Halo Glasses
            </a>
            {' '}let you show off all those gorgeous, colorful layers before you mix.
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── KAKANIN ── */}
          <h2 className="mt-10 mb-4">🍚 Kakanin: The Art of the Sticky Rice Cake</h2>
          <p className="mb-6">
            Long before ovens were introduced by Spanish colonizers, indigenous Filipinos were steaming and roasting glutinous rice, coconut milk, and root crops to create <strong>Kakanin</strong> (derived from <em>kanin</em>, meaning rice).
          </p>
          <p className="mb-6">
            <strong>Bibingka</strong> is a spongy, slightly sweet rice cake traditionally cooked in terra cotta pots lined with banana leaves, topped with butter, grated coconut, and a slice of salted duck egg (<em>itlog na maalat</em>) for a perfect sweet-and-salty balance. <strong>Suman</strong> is glutinous rice cooked in coconut milk, tightly wrapped in banana leaves, and steamed. <strong>Sapin-Sapin</strong> is a mesmerizing multi-colored layered dessert made from rice flour and coconut milk, prized for its dense, chewy, gelatinous texture.
          </p>

          {/* ── PANADERIA ── */}
          <h2 className="mt-10 mb-4">🥐 Panaderia Culture: Pandesal and Ensaymada</h2>
          <p className="mb-6">
            Walk into any neighborhood Filipino bakery (<em>panaderia</em>) in cities like Los Angeles, Jersey City, or Daly City, and the smell of freshly baked bread is intoxicating. <strong>Pandesal</strong> (salt bread) &mdash; despite the name &mdash; is subtly sweet and pillowy, perfect for dipping into your morning coffee. For something more indulgent, the <strong>Ensaymada</strong> is slathered in softened butter, dipped in sugar, and generously topped with finely grated cheese.
          </p>

          {/* ── KAPENG BARAKO ── */}
          <h2 className="mt-10 mb-4">☕ Kapeng Barako and Tsokolate</h2>
          <p className="mb-6">
            The Philippines has a rich, often overlooked coffee and cacao culture. <strong>Kapeng Barako</strong> (meaning &ldquo;macho&rdquo; coffee) is a rare, strong-flavored Liberica coffee varietal grown in the mountains of Batangas &mdash; it perfectly cuts through the sweetness of Filipino pastries. Traditional <strong>Tsokolate</strong> is made by melting pure roasted cacao tablets (<em>tablea</em>) in boiling water or milk, resulting in a thick, rich, earthy hot chocolate brought to the Philippines via the Acapulco-Manila galleon trade.
          </p>
        </div>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Find the freshest panaderias and dessert cafes near you</p>
          <p className="text-purple-200 mb-6">
            Browse our local directory at FilipinoFoodNearMe.org to find Filipino bakeries and dessert spots in your area!
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
