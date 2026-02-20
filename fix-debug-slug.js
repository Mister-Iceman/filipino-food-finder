const fs = require('fs');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');

ckb = ckb.replace(
  `if (!article) return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Debug: Article Not Found</h1>
      <p className="text-gray-600">Slug: {params.slug}</p>
    </div>
  )`,
  'if (!article) notFound()'
);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
console.log('Done. Verify:');
const lines = ckb.split('\n');
const idx = lines.findIndex(l => l.includes('notFound'));
console.log(lines.slice(idx-1, idx+2).join('\n'));
