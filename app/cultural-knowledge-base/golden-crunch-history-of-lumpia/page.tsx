import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

const HERO_IMAGE_SRC = '/images/golden-crunch-history-of-lumpia-hero-placeholder.svg'

// Replace these with the final Amazon affiliate URLs when ready.
const affiliateLinks = {
  deepFryer: 'https://www.amazon.com/',
  foodProcessor: 'https://www.amazon.com/',
  dippingBowls: 'https://www.amazon.com/',
  bananaKetchup: 'https://www.amazon.com/',
}

export const metadata: Metadata = {
  title: 'The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation | FilipinoFoodNearMe.org',
  description:
    'Explore the history of lumpia, from its ancient roots to its role at Filipino celebrations, diaspora tables, and modern Filipino-American food culture.',
  keywords: [
    'lumpia',
    'Lumpiang Shanghai',
    'Lumpiang Ubod',
    'Filipino spring rolls',
    'Filipino appetizers',
    'banana ketchup',
    'sawsawan',
    'National Lumpia Day',
    'Filipino food culture',
    'Filipino food near me',
  ],
  openGraph: {
    title: 'The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation',
    description:
      'Explore the history of lumpia, from its ancient roots to its role at Filipino celebrations, diaspora tables, and modern Filipino-American food culture.',
    type: 'article',
    publishedTime: '2026-03-19',
    authors: ['FilipinoFoodNearMe.org'],
    images: [HERO_IMAGE_SRC],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation',
  datePublished: '2026-03-19',
  dateModified: '2026-03-19',
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
  image: `https://filipinofoodnearme.org${HERO_IMAGE_SRC}`,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://filipinofoodnearme.org/cultural-knowledge-base/golden-crunch-history-of-lumpia/',
  },
}

export default function GoldenCrunchHistoryOfLumpiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="golden-crunch-history-of-lumpia" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cultural-knowledge-base" className="hover:text-purple-700">Cultural Knowledge Base</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">The Golden Crunch: A Cultural History of Lumpia</span>
        </div>
      </div>

      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src={HERO_IMAGE_SRC}
          alt="The Golden Crunch: A Cultural History of Lumpia hero placeholder"
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          Crisp on the outside and deeply savory within, lumpia is more than a party favorite. It is a story of migration, adaptation, and the communal joy at the heart of Filipino food culture.
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">
          <p className="mb-6">
            Welcome back to the <em>filipinofoodnearme.org</em> cultural knowledge base. Whether you are at a family reunion, a neighborhood fiesta, a birthday, or a wedding, there is one universal truth in Filipino dining: the golden, deep-fried spring rolls known as <strong>lumpia</strong> are almost always the first to vanish from the table.
          </p>
          <p className="mb-6">
            Lumpia is a certified crowd-pleaser, but its staying power goes well beyond crunch. It embodies Filipino hospitality, adaptability, and the kind of communal cooking that turns a kitchen into a place of storytelling and laughter. To understand why lumpia has become such an iconic cultural ambassador for Filipino Americans, we need to look at both its history and the social rituals surrounding it.
          </p>

          <h2 className="mt-10 mb-4">🥢 The Ancient Origins of the Spring Roll</h2>
          <p className="mb-6">
            While lumpia is undeniably a cornerstone of Philippine cuisine today, its ancestral roots trace back to ancient China, where thin wraps and pancakes filled with seasonal produce marked festive occasions and the arrival of a new year.
          </p>
          <p className="mb-6">
            As maritime trade flourished across Southeast Asia, Chinese merchants and immigrants brought these culinary techniques to the Philippine archipelago. Over time, Filipinos adapted them to local ingredients, tastes, and customs. In the Philippines, the dish evolved into <strong>lumpia</strong>, known for its thin wrappers that blister beautifully when fried and crackle with a light, shattering crispness.
          </p>
          <p className="mb-6">
            It may not have originated in the Philippines, but the adaptation was so complete and so beloved that lumpia is now inseparable from Filipino culinary identity. Like many defining Filipino dishes, it tells a story of outside influence transformed into something unmistakably local.
          </p>

          <h2 className="mt-10 mb-4">🌯 The Anatomy of Lumpia: From Shanghai to Ubod</h2>
          <p className="mb-6">
            One reason lumpia endures across generations is its incredible versatility. The category stretches from party food to everyday comfort to celebratory fresh rolls, with each version reflecting regional ingredients and household preference.
          </p>
          <p className="mb-6">
            <strong>Lumpiang Shanghai</strong> is the version most people picture first: slim, cigar-shaped rolls filled with seasoned ground pork, minced onion, garlic, carrots, and black pepper, then fried until deeply golden. They are often sliced into party-sized pieces and served in large platters that seem to disappear in minutes.
          </p>
          <p className="mb-6">
            <strong>Lumpiang Gulay</strong> leans into vegetables, offering a hearty, plant-forward filling that highlights the agricultural abundance of the islands. <strong>Lumpiang Ubod</strong>, or fresh lumpia, proves the dish does not need a fryer to be memorable. Wrapped in a soft crepe-like skin, it features sauteed vegetables such as jicama, green beans, carrots, lettuce, and heart of palm, then finishes with a sweet-savory sauce and crushed peanuts.
          </p>
          <p className="mb-6">
            Together, these styles show that lumpia is less a single recipe than a whole family of dishes united by wrapping, sharing, and contrast: crisp against tender, savory against bright, richness balanced by dipping sauce.
          </p>
        </div>

        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Bring It Home:</strong> Frying a big batch of Lumpiang Shanghai for your next party? A family-sized{' '}
            <a
              href={affiliateLinks.deepFryer}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              deep fryer
            </a>
            {' '}helps you keep the rolls evenly crisp, while a sturdy{' '}
            <a
              href={affiliateLinks.foodProcessor}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              food processor
            </a>
            {' '}makes quick work of carrots, onions, and garlic for the filling.
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">
          <h2 className="mt-10 mb-4">🤲 The Magic Is in the Making: A Social Ritual</h2>
          <p className="mb-6">
            What elevates lumpia from a simple appetizer to a cultural phenomenon is not just the finished roll, but the way it gets made. Because each piece must be filled, rolled, and sealed by hand, lumpia naturally invites group work. In Filipino households, that turns preparation into a social ritual.
          </p>
          <p className="mb-6">
            Large batches are often assembled before holidays and parties, with relatives and friends gathered around the kitchen table in an informal assembly line. Someone spoons filling, someone folds, someone seals the edges with water or egg wash, and someone keeps the conversation going. The process is repetitive in the best way, giving people space to gossip, laugh, swap stories, and pass culinary knowledge from one generation to the next.
          </p>
          <p className="mb-6">
            This is part of why lumpia feels bigger than finger food. It is not only a dish served at celebrations. It is also a dish created through celebration. The memory of making it together becomes inseparable from the taste itself.
          </p>

          <h2 className="mt-10 mb-4">🍋 The Perfect Pairing: Sawsawan</h2>
          <p className="mb-6">
            No plate of lumpia is complete without the proper <em>sawsawan</em>, or dipping sauce. Filipino food culture gives the diner agency, and lumpia is the perfect crunchy vehicle for personalizing each bite.
          </p>
          <p className="mb-6">
            Some households reach for sweet and sour sauce. Others prefer sweet chili sauce, soy sauce sharpened with calamansi, or spiced vinegar for a brighter, more assertive edge. Another beloved Filipino pairing is <strong>banana ketchup</strong>, the sweet-tangy condiment born from wartime resourcefulness that has become a nostalgic fixture at children&apos;s parties, family feasts, and potluck tables.
          </p>
          <p className="mb-6">
            That range of dipping options is part of lumpia&apos;s genius. The roll itself provides crunch and savory depth, while the sawsawan lets every diner decide whether the next bite should skew sweeter, sharper, or saltier.
          </p>
        </div>

        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Bring It Home:</strong> Turn lumpia night into a proper sawsawan spread with a set of{' '}
            <a
              href={affiliateLinks.dippingBowls}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              ceramic dipping bowls
            </a>
            {' '}and a bottle of authentic{' '}
            <a
              href={affiliateLinks.bananaKetchup}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Filipino banana ketchup
            </a>
            {' '}for that classic party-table pairing.
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">
          <h2 className="mt-10 mb-4">🌍 Going Global: Comfort Food for the Diaspora</h2>
          <p className="mb-6">
            As Filipinos migrated across the globe, they brought lumpia with them. For Filipino Americans and overseas Filipinos, it became more than an appetizer. It became an edible link to home, family gatherings, and celebrations left behind.
          </p>
          <p className="mb-6">
            Lumpia is especially suited to diaspora life because it can be rolled in large quantities and frozen for later, making it practical for busy households while still carrying deep emotional resonance. A tray of lumpia can anchor a birthday party in California, a church potluck in New Jersey, or a holiday gathering in Las Vegas with the same feeling of familiarity and pride.
          </p>
          <p className="mb-6">
            It has also crossed successfully into the American mainstream. From pop-ups and food trucks to Filipino fusion menus in major cities, lumpia is often the gateway dish that introduces newcomers to the broader world of Filipino cuisine. Its format is familiar, but its flavor profile opens the door to something richer and more specific.
          </p>

          <h2 className="mt-10 mb-4">🎉 March 16 and the Modern Lumpia Moment</h2>
          <p className="mb-6">
            Within Filipino-American food culture, March 16 has become widely associated with <strong>National Lumpia Day</strong>, an unofficial celebration of the dish and everything it represents: cultural heritage, family labor, hospitality, and joy.
          </p>
          <p className="mb-6">
            The spirit of the day makes perfect sense. Lumpia is one of the most recognizable, shareable, and beloved Filipino foods in the United States. Restaurants and food creators often use the occasion to spotlight classic platters, creative fusion versions, and the larger story of Filipino identity through food.
          </p>
        </div>

        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Ready for your next golden bite?</p>
          <p className="text-purple-200 mb-6">
            Craving a fresh batch of lumpia but not in the mood to roll it yourself? Use our directory to find Filipino restaurants, bakeries, and markets serving crispy, crowd-pleasing lumpia near you.
          </p>
          <Link
            href="/directory"
            className="inline-block bg-white text-purple-800 font-bold px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Find Filipino Food Near Me
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400 leading-relaxed text-center">
          As an Amazon Associate, FilipinoFoodNearMe.org earns from qualifying purchases made through links in this article at no extra cost to you. Thank you for supporting our mission to share Filipino culture!
        </p>
      </div>
    </div>
  )
}
