const fs = require('fs');

let page = fs.readFileSync('app/newsroom/page.tsx', 'utf8');

page = page.replace(
  `<a href="mailto:info@filipinofoodnearme.org"`,
  `<a href="mailto:info@filipinofoodnearme.org" title="info@filipinofoodnearme.org" onClick={(e) => { if (!window.location.protocol.includes('mailto')) { e.preventDefault(); navigator.clipboard.writeText('info@filipinofoodnearme.org').then(() => alert('Email copied: info@filipinofoodnearme.org')); }}}`
);

fs.writeFileSync('app/newsroom/page.tsx', page);
console.log('Done. Verify:');
const lines = page.split('\n');
const idx = lines.findIndex(l => l.includes('clipboard'));
console.log(lines[idx].trim());
