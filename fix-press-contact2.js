const fs = require('fs');

let page = fs.readFileSync('app/newsroom/page.tsx', 'utf8');

page = page.replace(
  `<a href="mailto:info@filipinofoodnearme.org" title="info@filipinofoodnearme.org" onClick={(e) => { if (!window.location.protocol.includes('mailto')) { e.preventDefault(); navigator.clipboard.writeText('info@filipinofoodnearme.org').then(() => alert('Email copied: info@filipinofoodnearme.org')); }}}`,
  `<a href="mailto:info@filipinofoodnearme.org"`
);

// Add visible email below the button
page = page.replace(
  'Contact Press Team',
  'Contact Press Team</a>\n          <p className="text-xs text-gray-500 mt-2">info@filipinofoodnearme.org'
);

fs.writeFileSync('app/newsroom/page.tsx', page);
console.log('Done. Verify:');
const lines = page.split('\n');
const idx = lines.findIndex(l => l.includes('info@filipinofoodnearme.org') && l.includes('<p'));
console.log(lines[idx].trim());
