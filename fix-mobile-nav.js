const fs = require('fs');

let nav = fs.readFileSync('app/components/Navigation.tsx', 'utf8');

// Fix mobile nav - rename Learn to Food Culture and add Newsroom after
nav = nav.replace(
  `<Link href="/cultural-knowledge-base" className="block text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/states"`,
  `<Link href="/cultural-knowledge-base" className="block text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Food Culture
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="block text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="/states"`
);

fs.writeFileSync('app/components/Navigation.tsx', nav);
console.log('Done. Verify:');
const lines = nav.split('\n');
lines.forEach((l,i)=>{ if(l.includes('Food Culture')||l.includes('Newsroom')||l.includes('Learn')) console.log(i+1, l.trim()); });
