import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleReadTracker from '../../components/ArticleReadTracker'

export const metadata: Metadata = {
  title: 'The Floral Devotion of May: Unveiling the History, Pageantry, and Culinary Traditions of Flores de Mayo | FilipinoFoodNearMe.org',
  description:
    'Explore the rich history, pageantry, and mouth-watering culinary traditions of Flores de Mayo and the Santacruzan — the beloved month-long Filipino Catholic festival honoring the Blessed Virgin Mary.',
  keywords: [
    'Flores de Mayo',
    'Santacruzan',
    'Filipino festivals',
    'Filipino food traditions',
    'kakanin',
    'champorado',
    'Filipino Catholic festival',
    'Flores de Mayo food',
    'Filipino cultural traditions',
    'May festival Philippines',
  ],
  openGraph: {
    title: 'The Floral Devotion of May: Unveiling the History, Pageantry, and Culinary Traditions of Flores de Mayo',
    description:
      'Explore the rich history, pageantry, and mouth-watering culinary traditions of Flores de Mayo and the Santacruzan — the beloved month-long Filipino Catholic festival honoring the Blessed Virgin Mary.',
    type: 'article',
    publishedTime: '2026-05-04',
    authors: ['FilipinoFoodNearMe.org'],
    images: ['/images/cultural-kb/Culinary-Traditions-of-Flores-de-Mayo.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline:
    'The Floral Devotion of May: Unveiling the History, Pageantry, and Culinary Traditions of Flores de Mayo',
  datePublished: '2026-05-04',
  dateModified: '2026-05-04',
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
  image:
    'https://filipinofoodnearme.org/images/cultural-kb/Culinary-Traditions-of-Flores-de-Mayo.jpg',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://filipinofoodnearme.org/cultural-knowledge-base/flores-de-mayo/',
  },
}

export default function FloresDeMayoPage() {
  return (
    <div className="min-h-screen bg-white">
      <ArticleReadTracker articleSlug="flores-de-mayo" />

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
          <span className="text-gray-800">Flores de Mayo</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', backgroundColor: '#f3f4f6' }}>
        <img
          src="/images/cultural-kb/Culinary-Traditions-of-Flores-de-Mayo.jpg"
          alt="A festive spread of traditional Filipino Flores de Mayo foods including floral kakanin, champorado, pancit, lumpia, boiled corn, and kamote, surrounded by roses and sampaguita flowers."
          style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/*
        ── STANDARD PATTERN: Cultural Knowledge Base Article ──────────────────
        • Hero image: public/images/cultural-kb/Culinary-Traditions-of-Flores-de-Mayo.jpg
        • Hero image has the article title baked in as text — NO separate h1
        • Tags row, h1 title, and author/date/byline are intentionally absent
        • Hero flows directly into the excerpt (italic blockquote) below
        • Index card uses the hero image — NOT a gradient placeholder
        ────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Excerpt — first thing after hero, no title block above it */}
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">
          Explore the rich history, pageantry, and mouth-watering culinary traditions of Flores de Mayo and the Santacruzan &mdash; the beloved month-long Filipino Catholic festival honoring the Blessed Virgin Mary.
        </p>

        {/* ── INTRO ── */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">
          <p className="mb-6">
            Welcome back to the filipinofoodnearme.org cultural knowledge base! As the intense heat of the Philippine summer reaches its peak, the arrival of May transforms the archipelago into a vibrant tapestry of faith, color, and community. The sweet scent of blooming sampaguitas (the Philippine national flower), kalachuchis, and roses floats through the air, signaling the start of the merriest and most beautiful month of the year.
          </p>
          <p className="mb-6">
            For Filipinos, May is synonymous with <strong>Flores de Mayo</strong> (Flowers of May), a month-long Catholic devotion honoring the Blessed Virgin Mary, and the <strong>Santacruzan</strong>, a grand, culminating religio-historical pageant. But beyond the beautiful gowns, brass bands, and floral arches, this festival is deeply intertwined with a rich culinary tradition. From daily communal snacks shared in rural chapels to lavish feasts prepared by the Filipino-American diaspora, the food of Flores de Mayo sustains the physical and social bonds of the community.
          </p>
          <p className="mb-6">
            Whether you are a food enthusiast, a cultural historian, or someone searching our directory for a taste of this festive season, let us explore the history, symbolism, and mouth-watering treats that define the &ldquo;Queen of Philippine Festivals.&rdquo;
          </p>

          {/* ── SECTION 1: HISTORY AND PAGEANTRY ── */}
          <h2 className="mt-10 mb-4">👑 The History and Pageantry of the Santacruzan</h2>
          <p className="mb-6">
            The origins of Flores de Mayo in the Philippines can be traced back to the 19th-century Spanish colonial era. The custom began to spread shortly after the Vatican&rsquo;s 1854 proclamation of the dogma of the Immaculate Conception. The festival truly took root in local culture following the 1867 publication of <em>Flores de Maria</em> (Flowers of Mary) by Filipino priest Mariano Sevilla. His translation and guidelines resonated deeply with the Filipino affinity for the natural world, linking the blooming of May flowers and the first monsoon rains with divine grace.
          </p>
          <p className="mb-6">
            The celebration climaxes on the last day of May with the <strong>Santacruzan</strong> (from the Spanish <em>santa cruz</em>, meaning &ldquo;holy cross&rdquo;). This glittering procession commemorates the legendary discovery of the True Cross in Jerusalem by Queen Helena of Constantinople (known locally as Reyna Elena) and her son, Emperor Constantine the Great, in AD 324.
          </p>
          <p className="mb-6">
            During the procession, the community&rsquo;s beautiful young women, known as <em>sagalas</em>, represent various biblical figures, historical characters, and Marian titles &mdash; such as Reyna Esperanza (Queen of Hope), Reyna Caridad (Queen of Charity), and the highly anticipated Reyna Elena, who carries a small crucifix. Escorted by brass bands and devotees holding lighted candles, the pageant is a breathtaking visual catechism that teaches history and faith through art and community participation.
          </p>

          {/* ── SECTION 2: THE DAILY ALAY ── */}
          <h2 className="mt-10 mb-4">🌸 The Daily Alay and the Agape Meal</h2>
          <p className="mb-6">
            While the Santacruzan provides the grand finale, the true spiritual and communal core of Flores de Mayo lies in the daily <strong>Alay</strong> (offering). Every afternoon throughout the 31 days of May, children and devotees gather in parish churches or small, temporary bamboo structures known as <em>tuklong</em> or <em>munting kapilya</em>. Dressed in their Sunday best, children march down the aisles to sprinkle fragrant petals and offer bouquets at the altar of the Virgin Mary.
          </p>
          <p className="mb-6">
            These religious devotions are inextricably linked to the consumption of food. After the prayers and hymns, the community shares in an &ldquo;agape meal&rdquo; &mdash; a feast intended to foster Christian fellowship and provide sustenance. The responsibility of hosting these daily meals falls upon designated local families or sponsors, affectionately known as the <strong>Hermanos and Hermanas</strong>.
          </p>
          <p className="mb-4">The menu for these daily gatherings focuses on heartiness, accessibility, and the agricultural bounty of the season:</p>
          <ul className="mb-6">
            <li className="mb-3"><strong>Boiled Staples:</strong> Reflecting the simplicity of rural life, the daily merienda often includes boiled sweet corn, kamote (sweet potatoes), and cassava, simply served with a side of grated coconut or a sprinkle of sugar.</li>
            <li><strong>Comforting Porridges:</strong> To provide warmth, especially after the cooling May rains arrive, large pots of <strong>Arroz Caldo</strong> (a savory chicken and ginger rice porridge) and <strong>Champorado</strong> (a sweet, thick chocolate rice porridge) are frequently served to the children and attendees.</li>
          </ul>
        </div>

        {/* ── AFFILIATE CALLOUT: CHAMPORADO ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Bring it Home:</strong> Want to recreate the comforting warmth of a daily agape meal? Stock your pantry with premium{' '}
            <a
              href="https://www.amazon.com/s?k=pure+tablea+cacao+philippines"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Pure Tablea Cacao
            </a>
            {' '}to simmer your own rich, authentic Champorado for the family!
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── SECTION 3: ILOILO ── */}
          <h2 className="mt-10 mb-4">🍲 Regional Culinary Masterpieces: A Spotlight on Iloilo</h2>
          <p className="mb-6">
            The beauty of Filipino festivals lies in their regional diversity. In Barangay Bucaya, San Joaquin, in the province of Iloilo, the culinary offerings for Flores de Mayo are highly distinct and eagerly anticipated. Local culinary experts take charge of preparing specific specialty dishes that have become essential to the community&rsquo;s celebration:
          </p>
          <ul className="mb-6">
            <li className="mb-3"><strong>Twisted Bitsu-Bitsu:</strong> This beloved local specialty is a fried dough made from rice flour and water, shaped into long cylinders, twisted, and deep-fried until perfectly golden. It is then heavily coated in a rich, earthy syrup made from <em>mascobado</em> (unrefined brown sugar).</li>
            <li className="mb-3"><strong>Paduya:</strong> A comforting sweet soup consisting of glutinous rice balls, sliced bananas, and camote (sweet potato), all enriched with rich <em>gata</em> (coconut milk) and sugar.</li>
            <li><strong>Festive Arozcaldo:</strong> The local version of this savory glutinous rice porridge is often tinted with food coloring to match the festive mood, sautéed with pungent garlic, onion, and ginger, and garnished generously with hard-boiled eggs and fried garlic.</li>
          </ul>

          {/* ── SECTION 4: FLORAL KAKANIN ── */}
          <h2 className="mt-10 mb-4">🍡 The Art and Symbolism of Floral Kakanin</h2>
          <p className="mb-6">
            No Filipino festival is complete without <strong>Kakanin</strong> (native delicacies made from sticky rice and coconut), but during Flores de Mayo, these treats undergo a beautiful, thematic transformation.
          </p>
          <p className="mb-6">
            To reflect the floral theme of the month, culinary artisans painstakingly mold and craft rice cakes into intricate flower shapes. You will often find <strong>Flower-Shaped Puto</strong> (steamed rice cakes made from fermented rice dough) dyed in pastel shades of purple (ube) and green (pandan), topped with a savory slice of cheese or salted egg to balance the sweetness. Another favorite is <strong>Flower-Shaped Kutsinta</strong>, a jelly-like, amber-colored rice cake flavored with lye water and atsuete (annatto), served with freshly grated coconut.
          </p>
          <p className="mb-6">
            Beyond their beauty, the inherent &ldquo;stickiness&rdquo; of these glutinous rice treats carries deep sociological meaning. The viscous, chewy texture of delicacies like <strong>Biko</strong> (sweet rice topped with caramelized coconut curds), <strong>Sapin-Sapin</strong> (a vibrant, multi-layered sweet), and <strong>Palitaw</strong> (flat rice patties coated in sesame and coconut) serves as a powerful metaphor for the strong, unbreakable bonds of family and community.
          </p>
        </div>

        {/* ── AFFILIATE CALLOUT: KAKANIN ── */}
        <aside className="my-8 rounded-xl bg-purple-50 border border-purple-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            🛒 <strong>Bring it Home:</strong> Ready to craft your own beautiful floral kakanin? You will need authentic{' '}
            <a
              href="https://www.amazon.com/s?k=glutinous+rice+flour+filipino"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Glutinous Rice Flour
            </a>
            {', '}a high-quality{' '}
            <a
              href="https://www.amazon.com/s?k=bamboo+steamer"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              Bamboo Steamer
            </a>
            {', and a set of '}
            <a
              href="https://www.amazon.com/s?k=flower+shaped+silicone+molds+baking"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-purple-700 font-semibold underline hover:text-purple-900"
            >
              flower-shaped silicone molds
            </a>
            {' '}to create your edible masterpieces!
          </p>
        </aside>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700">

          {/* ── SECTION 5: PABITIN AND FEAST ── */}
          <h2 className="mt-10 mb-4">🎉 The Pabitin and the Grand Fiesta Feast</h2>
          <p className="mb-6">
            As the month draws to a close, the religious and formal aspects of the Santacruzan give way to joyous neighborhood festivities. For the youth, the absolute highlight is the <strong>Pabitin</strong> game. A square trellis made of bamboo is erected and heavily tied with goodies, candies, sachets of crackers, and fresh fruits. The trellis is suspended from a tree branch or pole and raised and lowered repeatedly, sending the children jumping into the air to enthusiastically snatch as many treats as they can.
          </p>
          <p className="mb-6">
            Meanwhile, the adults gather for the grand <em>handaan</em> (feast). Whether hosted by the town Mayor or pooled together by the community, the post-procession banquet features the heavyweights of Filipino celebration cuisine. The tables sag under the weight of <strong>Lechon</strong> (a whole spit-roasted young pig with crackling skin), towering platters of <strong>Pancit</strong> (stir-fried noodles symbolizing long life), crispy <strong>Lumpia</strong> (fried spring rolls), and <strong>Jamon en dulce</strong> (roasted ham decorated with pineapple and cherries).
          </p>

          {/* ── SECTION 6: DIASPORA ── */}
          <h2 className="mt-10 mb-4">🌍 Keeping the Devotion Alive in the Diaspora</h2>
          <p className="mb-6">
            The spirit of Flores de Mayo has not remained confined to the Philippine archipelago. For the global Filipino diaspora, recreating this festival is a vital way to stay connected to their heritage and introduce the culture to their new communities.
          </p>
          <p className="mb-6">
            At the Immaculate Conception Church in Durham, North Carolina, the Filipino community has been celebrating Flores de Mayo since May 1987. Families volunteer to host the daily devotions in their homes, sharing prayers, Marian hymns, and potluck meals. On the last Sunday of May, they host a grand fiesta and procession, complete with traditional <em>barong tagalogs</em> and <em>mestiza</em> gowns, ensuring the younger generation experiences the beauty of the Santacruzan. Similarly, in places like Jersey City, the annual Santacruzan is accompanied by massive flea markets and food vendors selling crispy pork belly and vibrant buko pandan desserts.
          </p>

          {/* ── CLOSING SECTION ── */}
          <h2 className="mt-10 mb-4">A Celebration of Faith and Flavor</h2>
          <p className="mb-6">
            Flores de Mayo is a breathtaking testament to the Filipino people&rsquo;s enduring faith, creativity, and love for community. From the humblest boiled sweet potato shared after a neighborhood prayer to the grandest slice of lechon served at the Santacruzan feast, every bite taken during the month of May is infused with history, hospitality, and gratitude.
          </p>
          <p className="mb-6">
            Ready to experience the flavors of the fiesta? Use our interactive directory here at filipinofoodnearme.org to find a local Filipino bakery, caterer, or restaurant offering classic kakanin, pancit, and lechon so you can bring the joy of Flores de Mayo to your own dining table!
          </p>
        </div>

        {/* ── CLOSING CTA ── */}
        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <p className="text-xl font-semibold mb-2">Find Filipino fiesta food near you</p>
          <p className="text-purple-200 mb-6">
            Use our restaurant locator at FilipinoFoodNearMe.org to find Filipino bakeries, caterers, and restaurants celebrating the flavors of the season.
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
          Disclaimer: As an Amazon Associate, filipinofoodnearme.org earns from qualifying purchases made through the links in this article at no extra cost to you. Thank you for supporting our cultural knowledge base!
        </p>

      </div>
    </div>
  )
}
