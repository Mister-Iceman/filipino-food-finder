const fs = require('fs');

let nav = fs.readFileSync('app/components/Navigation.tsx', 'utf8');

// Remove the duplicate Newsroom link at the bottom of mobile nav
nav = nav.replace(
  `<li>
                <Link href="/newsroom" className="block text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="/add-business"`,
  `<li>
                <Link href="/add-business"`
);

fs.writeFileSync('app/components/Navigation.tsx', nav);
console.log('Done. Verify - count of Newsroom occurrences:');
const matches = nav.match(/Newsroom/g);
console.log('Newsroom count:', matches ? matches.length : 0);
