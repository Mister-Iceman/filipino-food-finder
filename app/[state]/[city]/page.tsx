import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function CityPage({ params }: any) {
  const { state, city } = await params
  
  const { data } = await supabase
    .from('city_pages')
    .select('*')
    .eq('slug', `${state}/${city}`)
    .maybeSingle()

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center"><p>City guide coming soon</p></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">{data.city}, {data.state_full}</h1>
        <p className="text-xl mb-8">{data.intro_tagline}</p>
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <p className="mb-4">{data.intro_paragraph_1}</p>
          <p>{data.intro_paragraph_2}</p>
        </div>
        <div className="mt-8">
          <Link href="/guides" className="text-blue-600">← Back to Guides</Link>
        </div>
      </div>
    </div>
  )
}