import { supabase } from '@/lib/supabase'

export const revalidate = 0

async function getRestaurants() {
  const { data } = await supabase.from('restaurants').select('*')
  return data || []
}

export default async function Home() {
  const restaurants = await getRestaurants()

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50">
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Filipino Food Near Me</h1>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">Restaurants</a>
            <a href="#" className="hover:underline">About</a>
          </div>
        </div>
      </nav>
      <section className="py-20 px-4 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Discover Authentic Filipino Cuisine
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Find the best Filipino restaurants in your area
        </p>
        <div className="max-w-2xl mx-auto">
          <input type="text" placeholder="Enter your location..." className="w-full px-6 py-4 rounded-full text-lg border-2 border-red-300 focus:border-red-500 outline-none" />
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Featured Restaurants</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gradient-to-br from-yellow-400 to-red-400" />
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">{r.name}</h4>
                  <p className="text-gray-600 mb-2">{r.cuisine_type} • {r.price_range}</p>
                  <p className="text-sm text-gray-500 mb-3">{r.city}</p>
                  <p className="text-gray-700 line-clamp-2">{r.description}</p>
                  <div className="mt-4 flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 font-semibold">{r.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}