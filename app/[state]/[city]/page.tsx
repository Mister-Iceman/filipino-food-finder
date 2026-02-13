'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CityPage() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const state = params?.state as string
        const city = params?.city as string
        
        if (!state || !city) {
          setError('Missing parameters')
          return
        }

        const { data: result, error: err } = await supabase
          .from('city_pages')
          .select('*')
          .eq('slug', `${state}/${city}`)
          .single()

        if (err) {
          setError(err.message)
          return
        }

        setData(result)
      } catch (e: any) {
        setError(e.message)
      }
    }

    fetchData()
  }, [params])

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6">{data.city}, {data.state_full}</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-xl mb-4">{data.intro_tagline}</p>
          <p className="mb-4">{data.intro_paragraph_1}</p>
          <p>{data.intro_paragraph_2}</p>
        </div>
      </div>
    </div>
  )
}