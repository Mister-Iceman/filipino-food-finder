import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Filipino Dishes | Filipino Food Near Me',
  description: 'Find Filipino restaurants known for specific dishes. Discover the best spots for adobo, lechon, sisig, lumpia, halo-halo, and more across America.',
  openGraph: {
    title: 'Browse Filipino Dishes | Filipino Food Near Me',
    description: 'Find Filipino restaurants known for adobo, lechon, sisig, lumpia, halo-halo, and more.',
  },
}

const DISHES = [
  { slug: 'adobo',     name: 'Adobo',     emoji: '🍖', tagline: 'The unofficial national dish' },
  { slug: 'lechon',    name: 'Lechon',    emoji: '🐷', tagline: 'Whole roasted pig, the celebratory centerpiece' },
  { slug: 'sisig',     name: 'Sisig',     emoji: '🍳', tagline: 'Sizzling chopped pork from Pampanga' },
  { slug: 'lumpia',    name: 'Lumpia',    emoji: '🥢', tagline: 'Crispy Filipino spring rolls' },
  { slug: 'halo-halo', name: 'Halo-Halo', emoji: '🍧', tagline: 'The iconic shaved ice dessert' },
  { slug: 'pancit',    name: 'Pancit',    emoji: '🍜', tagline: 'Stir-fried noodles for long life' },
  { slug: 'sinigang',  name: 'Sinigang',  emoji: '🍲', tagline: 'Sour tamarind soup' },
  { slug: 'kare-kare', name: 'Kare-Kare', emoji: '🥜', tagline: 'Rich peanut oxtail stew' },
  { slug: 'ube',       name: 'Ube',       emoji: '🟣', tagline: 'Purple yam — the flavor of Filipino sweets' },
  { slug: 'silog',         name: 'Silog',             emoji: '🍚', tagline: 'Garlic fried rice breakfast plates' },
  { slug: 'dinuguan',      name: 'Dinuguan',          emoji: '🖤', tagline: 'Dark savory pork blood stew' },
  { slug: 'tapsilog',      name: 'Tapsilog',          emoji: '🥩', tagline: 'Beef tapa, garlic rice, and egg' },
  { slug: 'palabok',       name: 'Palabok',           emoji: '🍝', tagline: 'Rice noodles in golden shrimp sauce' },
  { slug: 'turon',         name: 'Turon',             emoji: '🍌', tagline: 'Caramelized banana spring rolls' },
  { slug: 'peach-mango-pie', name: 'Peach Mango Pie', emoji: '🥧', tagline: 'The iconic Jollibee fried fruit pie' },
  { slug: 'garlic-rice',   name: 'Garlic Rice',       emoji: '🧄', tagline: 'Toasted garlic sinangag' },
]

export default function DishesIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:underline">Home</Link>
          {' / '}
          <span>Dishes</span>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">Browse by Filipino Dish</h1>

        <p className="text-xl text-gray-600 mb-10">
          Find Filipino restaurants known for specific dishes. From adobo and lechon to halo-halo and ube — discover where to eat your favorites across America.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISHES.map((dish) => (
            <Link
              key={dish.slug}
              href={`/dishes/${dish.slug}`}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-[#0038A8]"
            >
              <div className="text-4xl mb-3">{dish.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 hover:text-blue-600">
                {dish.name}
              </h2>
              <p className="text-gray-500 text-sm">{dish.tagline}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Looking for something else?</h2>
          <p className="text-gray-600 mb-6">Browse the full directory of Filipino restaurants, bakeries, and grocery stores.</p>
          <Link
            href="/directory"
            className="inline-block bg-[#0038A8] hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            Browse Full Directory
          </Link>
        </div>
      </div>
    </div>
  )
}
