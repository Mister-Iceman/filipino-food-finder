const fs = require('fs');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');

ckb = ckb.replace(
  '<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>',
  '<h1 className={article.hero_image_url ? "sr-only" : "text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"}>{article.title}</h1>'
);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
console.log('Done. Verify:');
const lines = ckb.split('\n');
const idx = lines.findIndex(l => l.includes('sr-only'));
console.log(lines[idx]);
