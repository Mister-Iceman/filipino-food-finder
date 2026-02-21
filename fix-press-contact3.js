const fs = require('fs');

let page = fs.readFileSync('app/newsroom/page.tsx', 'utf8');

// Find and replace the entire button section cleanly
page = page.replace(
  `<a href="mailto:info@filipinofoodnearme.org"`,
  `<a href="mailto:info@filipinofoodnearme.org"`
);

page = page.replace(
  `Contact Press Team</a>
          <p className="text-xs text-gray-500 mt-2">info@filipinofoodnearme.org
          </a>`,
  `Contact Press Team
          </a>
          <p className="text-xs text-gray-500 mt-2">info@filipinofoodnearme.org</p>`
);

fs.writeFileSync('app/newsroom/page.tsx', page);
console.log('Done. Verify lines 44-50:');
const lines = page.split('\n');
lines.slice(43, 50).forEach((l, i) => console.log(i+44, l));
