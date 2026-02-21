import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function LatestNews() {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, published_at')
    .eq('category', 'newsroom')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)

  if (!articles || articles.length === 0) return null

  const latest = articles[0]

  return (
    <section className="bg-[#3A2060] py-6 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">Latest News</span>
          <p className="text-white font-medium text-sm md:text-base line-clamp-1">{latest.title}</p>
        </div>
        <Link href={'/newsroom/' + latest.slug}
          className="whitespace-nowrap text-yellow-400 hover:text-yellow-300 text-sm font-bold transition-colors">
          Read More →
        </Link>
      </div>
    </section>
  )
}