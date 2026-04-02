import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cultural Knowledge Base | FilipinoFoodNearMe.org',
  description: 'Learn about Filipino food and culture. Guides, stories, and deep dives into the dishes, traditions, and communities that make Filipino cuisine unique.',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 86400

export default async function CulturalKnowledgeBasePage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, hero_image_url, tags, read_time_minutes, published_at, featured')
    .eq('category', 'knowledge-base')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const featured = articles?.filter(a => a.featured) || []
  const rest = articles?.filter(a => !a.featured) || []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div data-section="cultural-kb" className="bg-gradient-to-br from-[#62438D] via-[#92345A] to-[#BF2F26] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-3">FilipinoFoodNearMe.org</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cultural Knowledge Base</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Discover the stories, dishes, and traditions behind Filipino food culture — from kamayan feasts to your first silog breakfast.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Featured Articles */}
        {featured.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-6">Featured</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map(article => (
                <Link key={article.id} href={'/cultural-knowledge-base/' + article.slug}
                  className="group block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  {article.hero_image_url && (
                    <div className="h-52 overflow-hidden bg-gray-100">
                      <img src={article.hero_image_url} alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  {!article.hero_image_url && (
                    <div className="h-52 bg-gradient-to-br from-[#62438D] to-[#92345A] flex items-center justify-center">
                      <span className="text-5xl">🇵🇭</span>
                    </div>
                  )}
                  <div className="p-6">
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2">{article.title}</h3>
                    {article.excerpt && <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt}</p>}
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                      {article.read_time_minutes && <span>{article.read_time_minutes} min read</span>}
                      {article.published_at && <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-6">All Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/*
              ── STANDARD PATTERN: Static Cultural Knowledge Base Article Card ─
              • Image: public/images/[article-slug]-hero.png (NOT a gradient)
              • Card href points to /culture/[article-slug]
              • Hero image on the article page has the title baked in — no h1
              • To add future static articles: copy this card block and update
                href, src, alt, title text, excerpt, and read time accordingly
              ────────────────────────────────────────────────────────────────── */}
            <Link href="/culture/new-wave-filipino-american-cuisine"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/new-wave-filipino-american-cuisine-hero.png"
                  alt="The New Wave of Filipino-American Cuisine: From Turo-Turo to Michelin Stars"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">New Wave</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  The New Wave of Filipino-American Cuisine: From Turo-Turo to Michelin Stars
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  Explore how Filipino-American cuisine evolved from humble turo-turo counters to Michelin-starred restaurants. Discover ube culture, merienda traditions, and street food sensations.
                </p>
                <p className="text-xs text-gray-400 mt-2">10 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/sabaw-season-filipino-soups-stews"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/sabaw-season-filipino-soups-stews-hero.png"
                  alt="Sabaw Season: The Ultimate Guide to Filipino Soups and Stews for the Soul"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Culture &amp; Food</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  Sabaw Season: The Ultimate Guide to Filipino Soups and Stews for the Soul
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  When the weather turns cold or you&rsquo;re craving the culinary equivalent of a warm hug, nothing beats a Filipino soup or stew. Explore the ultimate Filipino comfort foods.
                </p>
                <p className="text-xs text-gray-400 mt-2">10 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/regional-masterpieces-filipino-food"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/regional-masterpieces.jpg"
                  alt="Regional Masterpieces: Discovering Filipino Food from Pampanga to Mindanao"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Regional Food</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  Regional Masterpieces: Discovering Filipino Food from Pampanga to Mindanao
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  A culinary journey across Luzon, Visayas, and Mindanao &mdash; exploring the regional dishes that go far beyond adobo and pancit.
                </p>
                <p className="text-xs text-gray-400 mt-2">9 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/ultimate-sawsawan-guide"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/ultimate-sawsawan-guide.jpg"
                  alt="The Ultimate Sawsawan Guide: How Condiments and Dipping Sauces Define Filipino Cuisine"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Culture &amp; Food</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  The Ultimate Sawsawan Guide: How Condiments and Dipping Sauces Define Filipino Cuisine
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  Discover sawsawan &mdash; the Filipino art of dipping sauces that puts flavor in the hands of the diner.
                </p>
                <p className="text-xs text-gray-400 mt-2">8 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/filipino-sweet-tooth-desserts-bakery"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/beyond-ube.jpg"
                  alt="Beyond Ube: The Ultimate Guide to Filipino Desserts, Kakanin, and Kapeng Barako"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Desserts &amp; Bakery</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  Beyond Ube: The Ultimate Guide to Filipino Desserts, Kakanin, and Kapeng Barako
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  From halo-halo to pandesal, explore the vibrant world of Filipino sweets, sticky rice cakes, and bakery culture across America.
                </p>
                <p className="text-xs text-gray-400 mt-2">8 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/golden-crunch-lumpia-cultural-history"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/lumpia-golden-crunch.jpg"
                  alt="The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Street Food &amp; Culture</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  The Golden Crunch: A Cultural History of Lumpia, from Ancient Origins to Global Sensation
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  From Chinese roots to Filipino fiestas and diaspora comfort food, explore why lumpia became one of the most beloved and recognizable dishes in Filipino culture.
                </p>
                <p className="text-xs text-gray-400 mt-2">9 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/balut-betamax-and-beyond-filipino-exotic-eats"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/cultural-kb/balut-betamax-and-beyond.jpg"
                  alt="Balut, Betamax, and Beyond: The Adventurous Side of Filipino Exotic Eats"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Street Food &amp; Culture</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  Balut, Betamax, and Beyond: The Adventurous Side of Filipino Exotic Eats
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  From balut to isaw to tamilok &mdash; explore the bold, zero-waste street food culture that makes Filipino cuisine one of the world&rsquo;s most adventurous.
                </p>
                <p className="text-xs text-gray-400 mt-2">7 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/long-life-of-pancit-filipino-noodle-culture"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/cultural-kb/long-life-pancit.jpg"
                  alt="The Long Life of Pancit: Unraveling the Philippines' Noodle Culture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Culture &amp; Food</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  The Long Life of Pancit: Unraveling the Philippines&rsquo; Noodle Culture
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  From birthday celebrations to regional variations &mdash; discover why pancit noodles are the most culturally significant dish in Filipino cuisine.
                </p>
                <p className="text-xs text-gray-400 mt-2">8 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/sour-power-and-sawsawan-acidity-in-filipino-cooking"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/cultural-kb/sour-power.jpg"
                  alt="Sour Power and Sawsawan: The Science and Soul of Acidity in Filipino Cooking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Culture &amp; Food</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  Sour Power and Sawsawan: The Science and Soul of Acidity in Filipino Cooking
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  Explore how vinegar, calamansi, tamarind, and sawsawan dipping sauces define the bold, mouth-puckering soul of Filipino cuisine.
                </p>
                <p className="text-xs text-gray-400 mt-2">9 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/tapestry-of-tastes-historical-waves-filipino-cuisine"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/cultural-kb/tapestry-of-tastes.jpg"
                  alt="A Tapestry of Tastes: The Historical Waves That Shaped the Original Fusion Cuisine"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">History &amp; Culture</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  A Tapestry of Tastes: The Historical Waves That Shaped the &lsquo;Original Fusion&rsquo; Cuisine
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  From pre-colonial adobo to Chinese pancit and Spanish kaldereta &mdash; trace the history that made Filipino cuisine the world&rsquo;s original fusion food.
                </p>
                <p className="text-xs text-gray-400 mt-2">9 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/merienda-culture-filipino-snacks-street-food"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/cultural-kb/merienda.jpg"
                  alt="Merienda Culture and the Vibrant Streets: A Deep Dive into Filipino Snacks and Street Food"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Street Food &amp; Culture</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  &lsquo;Merienda&rsquo; Culture and the Vibrant Streets: A Deep Dive into Filipino Snacks and Street Food
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  From taho vendors to fishball carts to kwek-kwek &mdash; explore the beloved merienda culture and vibrant street food scene that defines everyday Filipino life.
                </p>
                <p className="text-xs text-gray-400 mt-2">9 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/rise-and-shine-guide-to-filipino-breakfast-almusal"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/cultural-kb/rise-and-shine.jpg"
                  alt="Rise and Shine: The Ultimate Guide to Almusal and the Filipino Breakfast Universe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Culture &amp; Food</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  Rise and Shine: The Ultimate Guide to &lsquo;Almusal&rsquo; and the Filipino Breakfast Universe
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  From silog plates to champorado with tuyo &mdash; explore the hearty, carb-heavy world of Filipino breakfast culture and why almusal is a way of life.
                </p>
                <p className="text-xs text-gray-400 mt-2">9 min read</p>
              </div>
            </Link>

            <Link href="/cultural-knowledge-base/from-rations-to-riches-american-influence-filipino-food"
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src="/images/cultural-kb/rations-to-riches.jpg"
                  alt="From Rations to Riches: How American Influence Birthed Filipino Spaghetti and Fast Food"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">History &amp; Culture</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">
                  From Rations to Riches: How American Influence Birthed Filipino Spaghetti and Fast Food
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  From Spam to banana ketchup to Jollibee &mdash; discover how American colonial influence and WWII rations permanently transformed Filipino comfort food.
                </p>
                <p className="text-xs text-gray-400 mt-2">8 min read</p>
              </div>
            </Link>

            {rest.map(article => (
                <Link key={article.id} href={'/cultural-knowledge-base/' + article.slug}
                  className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  {article.hero_image_url && (
                    <div className="h-40 overflow-hidden bg-gray-100">
                      <img src={article.hero_image_url} alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  {!article.hero_image_url && (
                    <div className="h-40 bg-gradient-to-br from-[#62438D] to-[#BF2F26] flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                  <div className="p-4">
                    {article.tags && article.tags.length > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{article.tags[0]}</span>
                    )}
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors mt-2 mb-1">{article.title}</h3>
                    {article.excerpt && <p className="text-gray-500 text-xs line-clamp-2">{article.excerpt}</p>}
                    {article.read_time_minutes && <p className="text-xs text-gray-400 mt-2">{article.read_time_minutes} min read</p>}
                  </div>
                </Link>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {(!articles || articles.length === 0) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Articles Coming Soon</h2>
            <p className="text-gray-500 max-w-md mx-auto">We're writing guides, stories, and deep dives into Filipino food culture. Check back soon — or explore the directory in the meantime.</p>
            <Link href="/directory" className="inline-block mt-6 bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors">Browse the Directory</Link>
          </div>
        )}

        {/* Explore Filipino Dishes */}
        <div className="mt-16 mb-16">
          <h2 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-6">Explore Filipino Dishes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { slug: 'adobo', name: 'Adobo' },
              { slug: 'lechon', name: 'Lechon' },
              { slug: 'sinigang', name: 'Sinigang' },
              { slug: 'kare-kare', name: 'Kare-Kare' },
              { slug: 'pancit', name: 'Pancit' },
              { slug: 'lumpia', name: 'Lumpia' },
              { slug: 'halo-halo', name: 'Halo-Halo' },
              { slug: 'sisig', name: 'Sisig' },
              { slug: 'ube', name: 'Ube' },
              { slug: 'dinuguan', name: 'Dinuguan' },
              { slug: 'tapsilog', name: 'Tapsilog' },
              { slug: 'palabok', name: 'Palabok' },
            ].map((dish) => (
              <Link
                key={dish.slug}
                href={`/dishes/${dish.slug}`}
                className="block text-center py-3 px-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 hover:text-purple-700 text-gray-700 font-medium text-sm transition-all"
              >
                {dish.name}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to Find Filipino Food Near You?</h3>
          <p className="text-purple-200 mb-6">Browse the directory and support Filipino food businesses in your city.</p>
          <Link href="/directory" className="inline-block bg-white text-purple-800 font-bold px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors">Explore the Directory</Link>
        </div>
      </div>
    </div>
  )
}
