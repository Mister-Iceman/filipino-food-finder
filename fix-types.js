const fs = require('fs');

const fix = (content) => content
  .replace(
    'export async function generateMetadata({ params }) {',
    'export async function generateMetadata({ params }: { params: { slug: string } }) {'
  )
  .replace(
    'export default async function ArticlePage({ params }) {',
    'export default async function ArticlePage({ params }: { params: { slug: string } }) {'
  )
  .replace(
    'export default async function NewsroomArticlePage({ params }) {',
    'export default async function NewsroomArticlePage({ params }: { params: { slug: string } }) {'
  );

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');
let newsroom = fs.readFileSync('app/newsroom/[slug]/page.tsx', 'utf8');

ckb = fix(ckb);
newsroom = fix(newsroom);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
fs.writeFileSync('app/newsroom/[slug]/page.tsx', newsroom);
console.log('Done. Verify CKB:');
console.log(ckb.split('\n').slice(11,14).join('\n'));
console.log('Verify Newsroom:');
console.log(newsroom.split('\n').slice(11,14).join('\n'));
