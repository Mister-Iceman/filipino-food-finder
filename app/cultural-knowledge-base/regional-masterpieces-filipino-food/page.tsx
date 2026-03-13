import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'Regional Masterpieces: Discovering Filipino Food from Pampanga to Mindanao | FilipinoFoodNearMe.org',
  description:
    'A culinary journey across Luzon, Visayas, and Mindanao — exploring the regional dishes that go far beyond adobo and pancit.',
  keywords: [
    'Filipino regional food',
    'Pampanga cuisine',
    'Ilocos food',
    'Visayas food',
    'Mindanao cuisine',
    'Sisig Pampanga',
    'Lechon Cebu',
    'Pinapaitan',
    'Pyanggang Manok',
    'Filipino food near me',
    'Filipino regional dishes',
  ],
  openGraph: {
    title: 'Regional Masterpieces: Discovering Filipino Food from Pampanga to Mindanao',
    description:
      'A culinary journey across Luzon, Visayas, and Mindanao — exploring the regional dishes that go far beyond adobo and pancit.',
    type: 'article',
    publishedTime: '2026-03-13',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/regional-masterpieces-filipino-food-hero.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Regional Masterpieces: Discovering Filipino Food from Pampanga to Mindanao',
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
  image: 'https://filipinofoodnearme.org/images/regional-masterpieces-filipino-food-hero.png',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://filipinofoodnearme.org/cultural-knowledge-base/regional-masterpieces-filipino-food/',
  },
}

export default function RegionalMasterpiecesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="regional-masterpieces-filipino-food" />

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
          <span className="text-gray-800">Regional Masterpieces: Filipino Food</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/Regional_Masterpieces.png"
          alt="Regional Masterpieces - Filipino food from Luzon, Visayas, and Mindanao"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/regional-masterpieces-filipino-food-hero.png
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          A culinary journey across Luzon, Visayas, and Mindanao &mdash; exploring the regional dishes that go far beyond adobo and pancit.
        </p>

        {/* ── INTRO ── */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">
          <p className="mb-6">
            When first exploring the rich world of Filipino-American dining, it&rsquo;s easy to assume the cuisine revolves entirely around a few nationwide heavyweights like Adobo, Pancit, and Lumpia. But the Philippines is a sprawling, tropical archipelago of over 7,000 islands and more than 140 distinct ethno-linguistic groups. Assuming Filipino food is one homogenous cuisine is like assuming all American food is just hamburgers.
          </p>
          <p className="mb-6">
            Geography, centuries of maritime trade, local agriculture, and regional climates have birthed incredibly distinct flavor profiles. Here&rsquo;s a culinary road trip across the three major island groups &mdash; Luzon, Visayas, and Mindanao.
          </p>

          {/* ── SECTION 1: LUZON ── */}
          <h2 className="mt-10 mb-4">🏔️ Luzon: The Masters of Earthy Stews and Bold Bitterness</h2>
          <p className="mb-6">
            In the mountainous, northwestern region of Ilocos, the harsh terrain fostered a culture of extreme resourcefulness and a love for <em>pait</em> (bitterness). The crown jewel is <strong>Pinapaitan</strong> &mdash; a rich, savory, and aggressively bitter stew made from goat or beef offal, spiced with ginger, garlic, and chilies. The region is also famous for <strong>Pinakbet</strong>, a hearty stew of indigenous vegetables like bitter melon (ampalaya), eggplant, and okra, deeply flavored with fermented fish paste (bagoong isda).
          </p>
          <p className="mb-6">
            Moving to Central Luzon, the province of Pampanga is widely recognized as the &ldquo;Culinary Capital of the Philippines.&rdquo; Pampanga is the birthplace of <strong>Sisig</strong> &mdash; originally conceived as a resourceful way to utilize boiled pig&rsquo;s head, the meat is finely chopped, grilled, and served on a sizzling cast-iron platter, dressed with calamansi juice, onions, chicken liver, and chili. Anthony Bourdain famously predicted it would take the world by storm.
          </p>
        </div>

        {/* ── AFFILIATE CALLOUT: LUZON ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Pinakbet and Sisig both reward the right tools. A well-seasoned{' '}
            <a
              href="https://amzn.to/4rt4UFq"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Carbon Steel Wok
            </a>
            {' '}delivers the intense, high-heat sear that gives Pinakbet its smoky depth. For crushing ginger, garlic, and aromatics the traditional way, a{' '}
            <a
              href="https://amzn.to/3P5nGoZ"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Granite Mortar &amp; Pestle
            </a>
            {' '}is indispensable.
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">
          {/* ── SECTION 2: VISAYAS ── */}
          <h2 className="mt-10 mb-4">🌊 Visayas: The Purity of the Sea and the Art of Roasting</h2>
          <p className="mb-6">
            In Cebu and the surrounding islands, seafood is celebrated through <strong>SuToKil</strong> &mdash; a trifecta of preparation styles: <em>Su</em> (Sugba) meaning grilled over charcoal, <em>To</em> (Tinola) meaning a comforting ginger broth soup, and <em>Kil</em> (Kinilaw) meaning fresh raw fish &ldquo;cooked&rdquo; in coconut vinegar, calamansi, ginger, and chilies &mdash; the Filipino answer to ceviche.
          </p>
          <p className="mb-6">
            No discussion of the Visayas is complete without <strong>Lechon Cebu</strong>. Lechoneros stuff the pig&rsquo;s cavity with lemongrass, garlic, scallions, sea salt, and black peppercorns, then spit-roast it over charcoal for hours. The skin is basted with coconut water to achieve a glass-like crunch. The meat is so flavorful that asking for dipping sauce in Cebu is considered an insult to the chef.
          </p>

          {/* ── SECTION 3: MINDANAO ── */}
          <h2 className="mt-10 mb-4">🌶️ Mindanao: The Spice Route and Coconut Curries</h2>
          <p className="mb-6">
            Historically untouched by Spanish colonial rule, Mindanao&rsquo;s food shares deep ties with neighboring Malaysia and Indonesia, reflecting a rich Islamic and indigenous heritage. The cuisine relies on complex spice pastes, turmeric, galangal, lemongrass, and rich coconut milk (<em>gata</em>).
          </p>
          <p className="mb-6">
            The Maranao people have their own magnificent version of <strong>Beef Rendang</strong> &mdash; an intricate beef curry slowly caramelized in coconut milk and spices until exceptionally tender. From the Tausug people of Sulu comes <strong>Pyanggang Manok</strong>: chicken braised in <em>pamapa itum</em>, a dark paste made from burnt coconut meat ground with lemongrass, ginger, and garlic, resulting in a mysterious black hue and a smoky, nutty, complex flavor.
          </p>
        </div>

        {/* ── AFFILIATE CALLOUT: MINDANAO ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Make It At Home:</strong> Mindanao-style curries start with the right pantry staples. High-quality{' '}
            <a
              href="https://amzn.to/4rvV8Cq"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Turmeric Powder
            </a>
            {' '}gives your curry paste its golden color and earthy warmth. And always reach for{' '}
            <a
              href="https://amzn.to/4urZRb1"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Premium Canned Coconut Milk
            </a>
            {' '}&mdash; the richness of the coconut makes or breaks these slow-cooked dishes.
          </p>
        </aside>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Find regional Filipino food near you</p>
          <p className="text-purple-200 mb-6">
            Use our restaurant locator at FilipinoFoodNearMe.org to search for regional specialty restaurants in your city.
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
