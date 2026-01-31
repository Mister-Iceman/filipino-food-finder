import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  const { data: listings } = await supabase
    .from('listings')
    .select('id, name, city, state, updated_at')
  
  const baseUrl = 'https://filipinofoodnearme.org'
  
  const listingUrls = listings?.map((listing) => ({
    url: `${baseUrl}/directory`,
    lastModified: listing.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
}