const fs = require('fs');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');

ckb = ckb.replace(
  '<img src={article.hero_image_url} alt={article.title} className="w-full h-full object-cover" />',
  '<img src={article.hero_image_url} alt={article.title} style={{width:"100%",height:"280px",objectFit:"cover",display:"block"}} />'
);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
console.log('Done. Verify:');
const lines = ckb.split('\n');
const idx = lines.findIndex(l => l.includes('objectFit'));
console.log(lines[idx]);
