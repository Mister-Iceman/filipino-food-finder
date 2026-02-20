const fs = require('fs');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');

ckb = ckb.replace(
  'w-full h-72 md:h-96 overflow-hidden bg-gray-100',
  'w-full h-48 md:h-64 overflow-hidden bg-gray-100'
);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
console.log('Done. Verify:');
const lines = ckb.split('\n');
const idx = lines.findIndex(l => l.includes('overflow-hidden bg-gray-100'));
console.log(lines[idx]);
