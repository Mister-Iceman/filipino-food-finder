const fs = require('fs');

let ckb = fs.readFileSync('app/cultural-knowledge-base/[slug]/page.tsx', 'utf8');

ckb = ckb.replace(
  '<div className="w-full h-48 md:h-64 overflow-hidden bg-gray-100">',
  '<div style={{maxHeight:"280px",overflow:"hidden",width:"100%",backgroundColor:"#f3f4f6"}}>'
);

fs.writeFileSync('app/cultural-knowledge-base/[slug]/page.tsx', ckb);
console.log('Done. Verify:');
const lines = ckb.split('\n');
const idx = lines.findIndex(l => l.includes('maxHeight'));
console.log(lines[idx]);
