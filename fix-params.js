const fs = require('fs');

const fix = (content) => content
  .replace(
    'export async function generateMetadata({ params }: { params: { slug: string } }) {',
    'export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;'
  )
  .replace(
    /const \{ data \} = await supabase\.from\('articles'\)\.select\('title, meta_title, meta_description, excerpt'\)\.eq\('slug', params\.slug\)/,
    "const { data } = await supabase.from('articles').select('title, meta_title, meta_description, excerpt').eq('slug', slug)"
  )
  .replace(
    /export default async function (\w+)\(\{ params \}: \{ params: \{ slug: string \} \}\)/,
    'export default async function $1({ params }: { params: Promise<{ slug: string }> })'
  )
  .replace(
    /const \{ data: article \} = await supabase/,
    'const { slug } = await params;\n  const { data: article } = await supabase'
  )
  .replace(/\.eq\('slug', params\.slug\)/g, ".eq('slug', slug)");

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');
let newsroom = fs.readFileSync('app/newsroom/[slug]/page.tsx', 'utf8');

ckb = fix(ckb);
newsroom = fix(newsroom);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
fs.writeFileSync('app/newsroom/[slug]/page.tsx', newsroom);

console.log('Done. Verify CKB generateMetadata:');
console.log(ckb.split('\n').slice(11,18).join('\n'));
console.log('\nVerify CKB default function:');
const lines = ckb.split('\n');
const idx = lines.findIndex(l => l.includes('export default async function'));
console.log(lines.slice(idx, idx+6).join('\n'));
