const fs = require('fs');

let nav = fs.readFileSync('app/components/Navigation.tsx', 'utf8');

// Update desktop nav label
nav = nav.replace(
  '>Learn<',
  '>Food Culture<'
);

// Update mobile nav label
nav = nav.replace(
  '>Learn<',
  '>Food Culture<'
);

fs.writeFileSync('app/components/Navigation.tsx', nav);
console.log('Done. Verify:');
const lines = nav.split('\n');
lines.forEach((l, i) => { if (l.includes('Food Culture')) console.log(i, l.trim()); });
