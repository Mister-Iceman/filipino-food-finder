import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsroom | FilipinoFoodNearMe.org',
  description: 'Press releases, announcements, and media resources for FilipinoFoodNearMe.org — the free, community-powered Filipino food directory across all 50 states.',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 3600

export default async function NewsroomPage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, hero_image_url, tags, read_time_minutes, published_at')
    .eq('category', 'newsroom')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#3A2060] via-[#62438D] to-[#92345A] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-3">FilipinoFoodNearMe.org</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Newsroom</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">Press releases, announcements, and media resources. For press inquiries, contact info@filipinofoodnearme.org</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Press Kit */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Press Kit</h2>
            <p className="text-gray-500 text-sm">Site description, key facts, and media contact information for journalists and editors.</p>
          </div>
          <a href="mailto:info@filipinofoodnearme.org"
            className="whitespace-nowrap bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-purple-800 transition-colors text-sm">
            Contact Press Team</a>
          <p className="text-xs text-gray-500 mt-2">info@filipinofoodnearme.org
          </a>
        </div>

        {/* Articles */}
        {articles && articles.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-6">Press Releases & Announcements</h2>
            {articles.map(article => (
              <Link key={article.id} href={'/newsroom/' + article.slug}
                className="group flex gap-6 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                {article.hero_image_url && (
                  <div className="hidden md:block w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img src={article.hero_image_url} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {article.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1">{article.title}</h3>
                  {article.excerpt && <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt}</p>}
                  <div className="flex gap-3 mt-3 text-xs text-gray-400">
                    {article.published_at && <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
                    {article.read_time_minutes && <span>{article.read_time_minutes} min read</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Press Releases Coming Soon</h2>
            <p className="text-gray-500 max-w-md mx-auto">For immediate press inquiries, reach us at info@filipinofoodnearme.org</p>
          </div>
        )}
      </div>
    </div>
  )
}
