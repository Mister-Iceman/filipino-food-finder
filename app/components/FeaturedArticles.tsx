import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function FeaturedArticles() {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, hero_image_url, tags, read_time_minutes, category, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  if (!articles || articles.length === 0) return null

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-1">From the Cultural Knowledge Base</p>
            <h2 className="text-3xl font-bold text-gray-900">Learn About Filipino Food</h2>
            <p className="text-gray-500 mt-1">Stories, guides, and deep dives into the culture behind the cuisine.</p>
          </div>
          <Link
            href="/cultural-knowledge-base"
            className="hidden md:inline-block text-purple-700 font-semibold hover:text-purple-900 transition-colors text-sm"
          >
            View all articles →
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={'/' + (article.category === 'newsroom' ? 'newsroom' : 'cultural-knowledge-base') + '/' + article.slug}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
            >
              {/* Image */}
              {article.hero_image_url ? (
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img
                    src={article.hero_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className={
                  index === 0
                    ? "h-44 bg-gradient-to-br from-[#62438D] via-[#92345A] to-[#BF2F26] flex items-center justify-center"
                    : index === 1
                    ? "h-44 bg-gradient-to-br from-[#BF2F26] via-[#CB5B16] to-[#D1880D] flex items-center justify-center"
                    : "h-44 bg-gradient-to-br from-[#1A4A7A] via-[#62438D] to-[#92345A] flex items-center justify-center"
                }>
                  <span className="text-5xl">
                    {article.category === 'newsroom' ? '📰' : '🍽️'}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {/* Category badge */}
                <div className="flex items-center gap-2 mb-2">
                  {article.category === 'newsroom' ? (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">News</span>
                  ) : (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Learn</span>
                  )}
                  {article.tags && article.tags[0] && (
                    <span className="text-xs text-gray-400">{article.tags[0]}</span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors leading-snug mb-2">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                )}

                <div className="flex items-center justify-between">
                  {article.read_time_minutes && (
                    <span className="text-xs text-gray-400">{article.read_time_minutes} min read</span>
                  )}
                  <span className="text-xs font-semibold text-purple-700 group-hover:underline">Read more →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/cultural-knowledge-base" className="inline-block bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors">
            View All Articles
          </Link>
        </div>

      </div>
    </section>
  )
}
