import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function CityPage({ 
  params 
}: { 
  params: Promise<{ state: string; city: string }> 
}) {
  const { state, city } = await params
  const slug = `${state}/${city}`

  const { data: cityPage } = await supabase
    .from('city_pages')
    .select('city, state_full, intro_tagline, intro_paragraph_1')
    .eq('slug', slug)
    .single()

  if (!cityPage) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/guides" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Guides
        </Link>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {cityPage.city}, {cityPage.state_full}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-xl text-gray-600 mb-4">
            {cityPage.intro_tagline}
          </p>
          <p className="text-gray-700">
            {cityPage.intro_paragraph_1}
          </p>
        </div>
      </div>
    </div>
  )
}