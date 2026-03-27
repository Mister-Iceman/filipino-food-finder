import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'Sour Power and Sawsawan: The Science and Soul of Acidity in Filipino Cooking | FilipinoFoodNearMe.org',
  description:
    'Explore how vinegar, calamansi, tamarind, and sawsawan dipping sauces define the bold, mouth-puckering soul of Filipino cuisine.',
  keywords: [
    'sawsawan',
    'Filipino vinegar',
    'sinigang souring agents',
    'calamansi',
    'tamarind',
    'Filipino acidity',
    'sinamak',
    'pinakurat',
    'palapa condiment',
    'Filipino food near me',
  ],
  alternates: {
    canonical: 'https://www.filipinofoodnearme.org/cultural-knowledge-base/sour-power-and-sawsawan-acidity-in-filipino-cooking',
  },
  openGraph: {
    title: 'Sour Power and Sawsawan: The Science and Soul of Acidity in Filipino Cooking',
    description:
      'Explore how vinegar, calamansi, tamarind, and sawsawan dipping sauces define the bold, mouth-puckering soul of Filipino cuisine.',
    type: 'article',
    publishedTime: '2026-03-26',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/cultural-kb/sour-power.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Sour Power and Sawsawan: The Science and Soul of Acidity in Filipino Cooking',
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
  image: 'https://filipinofoodnearme.org/images/cultural-kb/sour-power.jpg',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.filipinofoodnearme.org/cultural-knowledge-base/sour-power-and-sawsawan-acidity-in-filipino-cooking',
  },
}

export default function SourPowerAndSawsawanPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="sour-power-and-sawsawan-acidity-in-filipino-cooking" />

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
          <span className="text-gray-800">Sour Power and Sawsawan</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/cultural-kb/sour-power.jpg"
          alt="Sour Power and Sawsawan: The Science and Soul of Acidity in Filipino Cooking — FilipinoFoodNearMe.org"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/cultural-kb/sour-power.jpg
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          Explore how vinegar, calamansi, tamarind, and sawsawan dipping sauces define the bold, mouth-puckering soul of Filipino cuisine.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── INTRO ── */}
          <p className="mb-6">
            When culinary experts decode the Filipino flavor profile, they point to a dynamic balance of sweet (<em>tamis</em>), salty (<em>alat</em>), and sour (<em>asim</em>). But if there is one flavor that truly defines the soul of traditional Filipino cooking, it is the unapologetic, mouth-puckering brilliance of sourness.
          </p>

          {/* ── LINAMNAM ── */}
          <h2 className="mt-10 mb-4">Linamnam vs. Umami</h2>
          <p className="mb-6">
            In understanding Filipino flavors, one must understand the concept of <strong>linamnam</strong>. While similar to the Japanese concept of umami (a savory taste associated with amino acids), linamnam goes a step further. According to noted artist and chef Claude Tayag, while Filipino cuisine utilizes basic tastes, linamnam actually evokes an emotion &mdash; specifically <em>kilig</em> (excitement or a thrilling shudder). This deep, emotionally satisfying savoriness is often achieved by cutting rich, fatty meats with sharp acidity.
          </p>

          {/* ── PRESERVATION ── */}
          <h2 className="mt-10 mb-4">The Preservation Factor</h2>
          <p className="mb-6">
            The Filipino obsession with acidity was born out of sheer necessity. Before the advent of modern refrigeration, the indigenous peoples of the hot, humid tropical archipelago needed a way to keep meat and fish from spoiling. Vinegar (<em>suka</em>) became the ultimate preservative. Acidulation causes the complex protein networks in meat and fish to unravel, while simultaneously killing microbes, making the food safe to eat and extending its shelf life.
          </p>
          <p className="mb-6">
            The Philippines boasts an astonishing variety of native vinegars fermented from local flora. <strong>Sukang tuba</strong> is made by fermenting the sap from a coconut tree, while <strong>Nipa palm vinegar</strong> is labor-intensively tapped from the stalks of palm plants. In the Ilocos region, <strong>Sukang Iloko</strong> is made from fermented sugarcane, offering a sweet, tangy flavor profile.
          </p>

          {/* ── SINIGANG ── */}
          <h2 className="mt-10 mb-4">The Souring Agents of Sinigang</h2>
          <p className="mb-6">
            This love for sour flavors is most famously showcased in <strong>Sinigang</strong>, a beloved comfort soup. Unlike Western soups that rely on savory, long-simmered bone broths, Sinigang is deeply tart. While tamarind (<em>sampalok</em>) is the most common souring agent, the true beauty of the dish lies in its regional adaptability. Depending on the province, cooks will sour the broth using calamansi (a native citrus resembling a cross between a lime and a lemon), kamias (bilimbi), guava, or <strong>batuan</strong> &mdash; a fruit heavily utilized in the Visayas (like Iloilo and Negros) that provides a complex, fruity acidity.
          </p>

          {/* ── SAWSAWAN ── */}
          <h2 className="mt-10 mb-4">The Art of Sawsawan (Dipping Sauces)</h2>
          <p className="mb-6">
            In Filipino dining, a dish is rarely considered &ldquo;finished&rdquo; when it leaves the kitchen. Instead, the power is handed to the diner through <strong>sawsawan</strong> (dipping sauces). Doreen Gamboa Fernandez noted that sawsawan is a tool for &ldquo;indigenization&rdquo; &mdash; allowing Filipinos to take any food and customize it to their exact personal preference.
          </p>
          <p className="mb-6">
            A standard table will feature <strong>Toyomansi</strong> (soy sauce and calamansi), but regional variations are spectacular. In the Visayas, you will find <strong>Sinamak</strong>, a cane vinegar heavily infused with garlic, onions, peppercorns, and siling labuyo (bird&rsquo;s-eye chilies). In Mindanao, you will find <strong>Pinakurat</strong>, an incredibly spicy condiment made from fermented coconut sap. Also hailing from Mindanao is <strong>Palapa</strong>, a crucial Maranao condiment made from pounded sakurab (a native white scallion), ginger, turmeric, toasted coconut, and chilies.
          </p>

        </div>

        {/* ── AFFILIATE CALLOUT: MAKE IT AT HOME ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Experience the real tang of the islands at home! Build your own sawsawan station with{' '}
            <a
              href="https://amzn.to/47pFmSw"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              a set of ceramic condiment dipping bowls
            </a>
            {' '}and stock up on{' '}
            <a
              href="https://amzn.to/4rTHol5"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              authentic Filipino coconut vinegar or Pinakurat
            </a>
            .
          </p>
        </aside>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Ready to experience Filipino flavor in full?</p>
          <p className="text-purple-200 mb-6">
            Find Filipino restaurants near you &mdash; from sinigang specialists to modern sawsawan bars.{' '}
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
