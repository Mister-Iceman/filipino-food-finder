const fs = require('fs');

const content = `import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabase.from('articles').select('title, meta_title, meta_description, excerpt').eq('slug', slug).single()
  if (!data) return { title: 'Not Found' }
  return {
    title: data.meta_title || data.title + ' | FilipinoFoodNearMe.org Newsroom',
    description: data.meta_description || data.excerpt || '',
  }
}

export default async function NewsroomArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!article) notFound()

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/newsroom" className="hover:text-purple-700">Newsroom</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{article.title}</span>
        </div>
      </div>

      <div className="bg-[#62438D] text-white text-center py-2">
        <span className="text-xs font-bold uppercase tracking-widest">Press Release — For Immediate Release</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

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

        <div className="mt-12 border border-purple-100 bg-purple-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">Media Contact</h3>
          <p className="text-sm text-gray-600">FilipinoFoodNearMe.org</p>
          <p className="text-sm text-gray-600">Email: <a href="mailto:info@filipinofoodnearme.org" className="text-purple-700 hover:underline">info@filipinofoodnearme.org</a></p>
          <p className="text-sm text-gray-600">Website: <a href="https://www.filipinofoodnearme.org" className="text-purple-700 hover:underline">www.filipinofoodnearme.org</a></p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/newsroom" className="text-sm text-purple-700 hover:underline">← Back to Newsroom</Link>
        </div>
      </div>
    </div>
  )
}`;

fs.writeFileSync('app/newsroom/[slug]/page.tsx', content);
console.log('Done. Size:', fs.statSync('app/newsroom/[slug]/page.tsx').size, 'bytes');
console.log('Verify notFound line:');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('notFound()'));
console.log(lines.slice(idx-1, idx+2).join('\n'));
