const fs = require('fs');

const fix = (content) => content
  .replace(/article\.tags\.map\(\(tag\)/g, 'article.tags.map((tag: string)');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');
let newsroom = fs.readFileSync('app/newsroom/[slug]/page.tsx', 'utf8');

ckb = fix(ckb);
newsroom = fix(newsroom);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
fs.writeFileSync('app/newsroom/[slug]/page.tsx', newsroom);
console.log('Done. Verify CKB line 62:');
console.log(ckb.split('\n').slice(60,65).join('\n'));
