import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MakeItAtHome from '../../components/MakeItAtHome'

// ---------------------------------------------------------------------------
// Affiliate links keyed by partial slug match.
// Update the keys if your DB slugs differ from these patterns.
// ---------------------------------------------------------------------------
const MAKE_IT_AT_HOME_BY_SLUG: Array<{
  match: string  // substring that must appear in the article slug
  title?: string
  links: Array<{ label: string; url: string; note?: string }>
}> = [
  {
    match: 'kamayan',
    links: [
      { label: 'Frozen Banana Leaves',    url: 'https://amzn.to/3Oz4xLX', note: 'Essential for authentic kamayan' },
      { label: 'I Am a Filipino Cookbook', url: 'https://amzn.to/3ZZ09bu', note: 'By Nicole Ponseca, NYC kamayan pioneer' },
    ],
  },
  {
    // Matches slugs containing "silog" OR "beginner"
    match: 'silog|beginner',
    links: [
      { label: 'Silver Swan Soy Sauce',    url: 'https://amzn.to/4aZ1VP3', note: 'The Filipino pantry staple' },
      { label: 'Datu Puti Cane Vinegar',   url: 'https://amzn.to/4l7KUGT', note: 'For adobo and dipping sauces' },
      { label: 'Ube Extract',              url: 'https://amzn.to/46vlk8H', note: 'For ube desserts at home' },
      { label: 'I Am a Filipino Cookbook', url: 'https://amzn.to/3ZZ09bu', note: 'Best intro to Filipino cooking' },
    ],
  },
]

function getAffiliateLinks(slug: string) {
  return MAKE_IT_AT_HOME_BY_SLUG.find(({ match }) =>
    new RegExp(match).test(slug)
  ) ?? null
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabase.from('articles').select('title, meta_title, meta_description, excerpt').eq('slug', slug).single()
  if (!data) return { title: 'Article Not Found' }
  return {
    title: data.meta_title || data.title + ' | FilipinoFoodNearMe.org',
    description: data.meta_description || data.excerpt || '',
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const affiliateEntry = getAffiliateLinks(slug)

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!article) notFound()

  const { data: related } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, hero_image_url, read_time_minutes, tags')
    .eq('category', 'knowledge-base')
    .eq('status', 'published')
    .neq('slug', slug)
    .limit(3)

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cultural-knowledge-base" className="hover:text-purple-700">Cultural Knowledge Base</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{article.title}</span>
        </div>
      </div>

      {article.hero_image_url ? (
        <div style={{width:"100%",backgroundColor:"#f3f4f6"}}>
          <img src={article.hero_image_url} alt={article.title} style={{width:"100%",maxWidth:"100%",height:"auto",display:"block"}} />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-[#62438D] via-[#92345A] to-[#BF2F26]" />
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        )}

        <h1 className={article.hero_image_url ? "sr-only" : "text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"}>{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span className="font-medium text-gray-600">{article.author_name}</span>
          {article.published_at && (
            <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          )}
          {article.read_time_minutes && <span>{article.read_time_minutes} min read</span>}
        </div>

        {article.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-purple-400 pl-4 italic">{article.excerpt}</p>
        )}

        {article.content && (
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-gray-900 prose-a:text-purple-700 prose-ul:my-4 prose-li:text-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {affiliateEntry && (
          <MakeItAtHome title={affiliateEntry.title} links={affiliateEntry.links} />
        )}

        <div className="mt-14 bg-gradient-to-r from-[#62438D] to-[#92345A] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to Try It Yourself?</h3>
          <p className="text-purple-200 mb-6">Find Filipino restaurants, bakeries, and more near you.</p>
          <Link href="/directory" className="inline-block bg-white text-purple-800 font-bold px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors">Find Filipino Food Near Me</Link>
        </div>
      </div>

      {related && related.length > 0 && (
        <div className="bg-gray-50 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-6">Keep Exploring</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.id} href={'/cultural-knowledge-base/' + r.slug}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  {r.hero_image_url
                    ? <div className="h-36 overflow-hidden"><img src={r.hero_image_url} alt={r.title} className="w-full h-full object-cover" /></div>
                    : <div className="h-36 bg-gradient-to-br from-[#62438D] to-[#BF2F26] flex items-center justify-center"><span className="text-3xl">🍽️</span></div>
                  }
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-700 text-sm mb-1">{r.title}</h3>
                    {r.read_time_minutes && <p className="text-xs text-gray-400">{r.read_time_minutes} min read</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}