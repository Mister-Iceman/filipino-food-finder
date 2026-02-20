const fs = require('fs');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');
let newsroom = fs.readFileSync('app/newsroom/[slug]/page.tsx', 'utf8');

const fix = (content) => content
  .replace('process.env.NEXT_PUBLIC_SUPABASE_URL,', 'process.env.NEXT_PUBLIC_SUPABASE_URL!,')
  .replace('process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY', 'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!');

ckb = fix(ckb);
newsroom = fix(newsroom);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
fs.writeFileSync('app/newsroom/[slug]/page.tsx', newsroom);
console.log('Fixed. Verify:');
console.log(ckb.split('\n').slice(4,8).join('\n'));
