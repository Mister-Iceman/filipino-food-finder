const fs = require('fs');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');

// Replace the notFound() call with a debug display
ckb = ckb.replace(
  'if (!article) notFound()',
  `if (!article) return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Debug: Article Not Found</h1>
      <p className="text-gray-600">Slug: {params.slug}</p>
    </div>
  )`
);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
console.log('Done - debug render added');
