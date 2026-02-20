const fs = require('fs');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');

ckb = ckb.replace(
  '<img src={article.hero_image_url} alt={article.title} style={{width:"100%",height:"280px",objectFit:"cover",display:"block"}} />',
  '<img src={article.hero_image_url} alt={article.title} style={{width:"100%",maxWidth:"100%",height:"auto",display:"block"}} />'
);

// Also remove the constraining div wrapper
ckb = ckb.replace(
  '<div style={{maxHeight:"280px",overflow:"hidden",width:"100%",backgroundColor:"#f3f4f6"}}>',
  '<div style={{width:"100%",backgroundColor:"#f3f4f6"}}>'
);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
console.log('Done. Verify img:');
const lines = ckb.split('\n');
const idx = lines.findIndex(l => l.includes('hero_image_url') && l.includes('style'));
console.log(lines[idx]);
