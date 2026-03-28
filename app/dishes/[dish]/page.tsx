import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const DISH_INFO: Record<string, { name: string; description: string; category?: string; alsoKnownAs?: string }> = {
  adobo: {
    name: 'Adobo',
    description: 'Adobo is the unofficial national dish of the Philippines — meat braised in vinegar, soy sauce, garlic, and bay leaves until tender and deeply savory. Every family has their own version, from saucy chicken adobo to dry-style pork adobo flakes.',
  },
  lechon: {
    name: 'Lechon',
    description: 'Lechon is whole roasted pig slow-cooked over charcoal until the skin is shatteringly crisp and the meat is juicy and fall-off-the-bone tender. It is the undisputed centerpiece of Filipino celebrations and one of the most praised pork dishes in the world.',
  },
  sisig: {
    name: 'Sisig',
    description: 'Sisig is a sizzling Pampanga classic made from chopped pork seasoned with calamansi, chili, and onions, served on a scorching cast iron plate. What started as a humble bar snack has become one of the most beloved Filipino dishes both at home and around the world.',
  },
  lumpia: {
    name: 'Lumpia',
    description: 'Lumpia are Filipino spring rolls — crispy golden parcels of savory ground meat and vegetables wrapped in thin crepe-like skins and deep-fried to perfection. A fixture at every Filipino party table, they disappear faster than you can make them.',
  },
  'halo-halo': {
    name: 'Halo-Halo',
    description: "Halo-halo is the Philippines' iconic shaved ice dessert, layered with sweetened beans, jellies, fruits, leche flan, and ube ice cream, then drizzled with evaporated milk. The name means \"mix-mix\" in Tagalog — stir everything together for an explosion of color, texture, and flavor.",
  },
  pancit: {
    name: 'Pancit',
    description: 'Pancit is a broad family of Filipino noodle dishes rooted in Chinese culinary tradition and transformed over centuries into essential Filipino comfort food. Long noodles symbolize long life, making pancit an indispensable part of every birthday celebration.',
  },
  sinigang: {
    name: 'Sinigang',
    description: 'Sinigang is a bold, sour tamarind soup loaded with tender pork, shrimp, or fish alongside fresh vegetables in a bright, tangy broth. It is the defining taste of Filipino home cooking — deeply comforting, intensely flavorful, and endlessly restorative.',
  },
  'kare-kare': {
    name: 'Kare-Kare',
    description: "Kare-kare is a slow-simmered oxtail and vegetable stew in a rich, golden peanut sauce — one of the most labor-intensive and celebrated dishes in Filipino cuisine. It is always served alongside bagoong (fermented shrimp paste), whose sharp saltiness cuts perfectly through the stew's nutty richness.",
  },
  ube: {
    name: 'Ube',
    description: "Ube is purple yam — the vibrant, violet ingredient that has taken the world's dessert scene by storm with its striking color and gently sweet, vanilla-like flavor. From ube halaya and ube cake to ice cream, lattes, and cheesecake, it has become the most recognizable symbol of Filipino sweets.",
  },
  silog: {
    name: 'Silog',
    description: 'Silog is the beloved Filipino breakfast formula of sinangag (garlic fried rice) and itlog (fried egg) paired with a protein like tocino, tapa, or longganisa. Fast, filling, and infinitely customizable, it is the morning meal that powers Filipinos through the day.',
  },
  dinuguan: {
    name: 'Dinuguan (Pork Blood Stew)',
    description: 'Dinuguan is a rich, dark Filipino stew of pork meat and offal simmered in a savory sauce of pork blood, vinegar, garlic, and chili — sometimes called "chocolate meat" by those unfamiliar with its origins. Its bold, deeply earthy flavor is beloved in Filipino homes and carinderias alike, a dish that rewards the adventurous with intense depth and comfort. Dinuguan is traditionally served alongside puto, soft steamed rice cakes whose mild sweetness perfectly balances the stew\'s sharp, savory heat.',
  },
  tapsilog: {
    name: 'Tapsilog (Beef Tapa + Sinangag + Itlog)',
    description: 'Tapsilog is one of the most iconic Filipino breakfast plates — sweet, garlicky cured beef tapa pan-fried until caramelized, served alongside sinangag (garlic fried rice) and a sunny-side-up itlog (egg). The name is a portmanteau of its three components, part of the beloved silog family of Filipino morning meals that spans tapsilogan diners to family breakfast tables. Humble in ingredients but deeply satisfying in flavor, tapsilog has anchored Filipino mornings for generations.',
  },
  palabok: {
    name: 'Palabok (Filipino Noodles)',
    description: 'Palabok is a festive Filipino noodle dish featuring thin rice noodles blanketed in a vibrant golden-orange shrimp sauce and piled high with toppings — smoked fish flakes, hard-boiled eggs, crushed chicharon, and scallions. Its striking color and layered flavors make it a fixture at fiestas and celebrations throughout the Philippines. Closely related to pancit luglug, palabok is one of the most visually arresting and flavor-packed dishes in the entire Filipino culinary tradition.',
  },
  turon: {
    name: 'Turon (Banana Spring Rolls)',
    description: 'Turon is a beloved Filipino street food and dessert — ripe saba banana and jackfruit wrapped in a lumpia wrapper, rolled in brown sugar, and deep-fried until caramelized and shatteringly golden. The crisp shell gives way to a tender, sweet interior, with the caramelized sugar coating adding an irresistible crunch unique to this Filipino treat. Found at street stalls, school cafeterias, and Filipino bakeries, turon is one of the most nostalgic snacks in the Filipino experience.',
  },
  'peach-mango-pie': {
    name: 'Peach Mango Pie',
    description: 'The Peach Mango Pie is a Filipino fast food icon — a deep-fried, flaky pastry filled with warm peach and mango jam that became a cult obsession at Jollibee locations across the Philippines and America. Its blistered golden crust and sweet fruit filling have made it one of the most craved Filipino desserts in the diaspora, a taste of home that transcends fast food. Biting into a fresh, hot Peach Mango Pie straight from the fryer is a deeply nostalgic moment for Filipinos everywhere.',
  },
  'garlic-rice': {
    name: 'Garlic Rice (Sinangag)',
    description: "Sinangag, or garlic rice, is one of the most essential staples in Filipino cuisine — day-old steamed rice stir-fried in generous amounts of golden toasted garlic until every grain is fragrant and lightly crisp. It is the backbone of the silog breakfast tradition and the perfect companion to virtually any Filipino ulam (main dish). Simple as it sounds, a well-made sinangag with its toasty garlic perfume is one of the most comforting and addictive things in all of Filipino cooking.",
  },
  bibingka: {
    name: 'Bibingka',
    description: 'A traditional Filipino rice cake baked in clay pots lined with banana leaves, typically enjoyed during Christmas season and church festivals. Soft, slightly chewy, and topped with salted egg, kesong puti (white cheese), and grated coconut — bibingka is one of the most beloved holiday foods in Filipino culture.',
    category: 'Dessert / Kakanin',
    alsoKnownAs: 'Rice cake, Christmas cake',
  },
  pandesal: {
    name: 'Pandesal',
    description: 'The iconic Filipino bread roll — soft, slightly sweet, and dusted with breadcrumbs. Pandesal is eaten at breakfast across the Philippines and in Filipino-American households everywhere, often paired with coffee, kesong puti, or filled with everything from scrambled eggs to corned beef. It is the everyday bread of the Filipino people.',
    category: 'Bread / Bakery',
    alsoKnownAs: 'Pan de sal, Filipino bread roll',
  },
  balut: {
    name: 'Balut',
    description: 'A fertilized duck egg with a nearly developed embryo inside, boiled and eaten from the shell with salt, vinegar, or chili. Balut is one of the most iconic — and most talked about — Filipino street foods, beloved by locals and a rite of passage for adventurous eaters. Found at night markets, street stalls, and Filipino specialty stores across America.',
    category: 'Street Food / Specialty',
    alsoKnownAs: 'Fertilized duck egg, Filipino street food',
  },
}

export function generateStaticParams() {
  return Object.keys(DISH_INFO).map((dish) => ({ dish }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dish: string }>
}): Promise<Metadata> {
  const { dish } = await params
  const info = DISH_INFO[dish]
  if (!info) return { title: 'Dish Not Found | Filipino Food Near Me' }
  return {
    title: `Filipino Restaurants Known for ${info.name} | Filipino Food Near Me`,
    description: `Discover Filipino restaurants serving authentic ${info.name} near you. Browse our curated directory of ${info.name} spots across America.`,
    openGraph: {
      title: `Filipino Restaurants Known for ${info.name}`,
      description: `Find authentic ${info.name} at Filipino restaurants across the US.`,
    },
  }
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ dish: string }>
}) {
  const { dish } = await params
  const info = DISH_INFO[dish]
  if (!info) notFound()

  const { data: listings } = await supabase
    .from('listings')
    .select('id, name, slug, city, state, category_primary, google_rating, google_reviews_count')
    .ilike('review_keywords', `%${dish}%`)
    .order('google_rating', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:underline">Home</Link>
          {' / '}
          <Link href="/dishes" className="hover:underline">Dishes</Link>
          {' / '}
          <span>{info.name}</span>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Filipino Restaurants Known for {info.name}
        </h1>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-[#0038A8] rounded-lg p-6 mb-10">
          <p className="text-lg text-gray-700">{info.description}</p>
        </div>

        {!listings || listings.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-700 text-lg font-medium mb-2">
              No Filipino restaurants or businesses serving {info.name} are listed yet.
            </p>
            <p className="text-gray-500 mb-6">Know a spot? Help us grow the directory.</p>
            <Link
              href="/add-business"
              className="inline-block bg-[#0038A8] hover:bg-[#002a80] text-white font-bold px-6 py-3 rounded-lg transition"
            >
              Add a Business →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              {listings.length} {listings.length === 1 ? 'restaurant' : 'restaurants'} known for {info.name}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.slug}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600">
                    {listing.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">{listing.category_primary}</p>
                  {listing.google_rating && (
                    <div className="bg-yellow-50 inline-block px-3 py-1 rounded-lg mb-3">
                      <span className="text-yellow-500">★</span>
                      <span className="font-bold ml-1">{listing.google_rating}</span>
                      {listing.google_reviews_count && (
                        <span className="text-gray-500 text-sm ml-1">({listing.google_reviews_count})</span>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-gray-600">📍 {listing.city}, {listing.state}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More Filipino Dishes</h2>
          <Link href="/dishes" className="text-blue-600 hover:underline font-medium">
            Browse all dish pages →
          </Link>
        </div>
      </div>
    </div>
  )
}
