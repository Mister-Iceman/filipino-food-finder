const fs = require('fs');

let page = fs.readFileSync('app/newsroom/page.tsx', 'utf8');

page = page.replace(
  `<a href="mailto:info@filipinofoodnearme.org"
            className="whitespace-nowrap bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-purple-800 transition-colors text-sm">
            Contact Press Team
          </a>
          <p className="text-xs text-gray-500 mt-2">info@filipinofoodnearme.org</p>`,
  `<div className="flex flex-col items-start gap-1">
            <p className="text-sm font-semibold text-gray-700">Press Inquiries:</p>
            <p className="text-purple-700 font-bold text-base select-all">info@filipinofoodnearme.org</p>
            <p className="text-xs text-gray-400">Copy the email above to reach our press team</p>
          </div>`
);

fs.writeFileSync('app/newsroom/page.tsx', page);
console.log('Done. Verify:');
const lines = page.split('\n');
const idx = lines.findIndex(l => l.includes('Press Inquiries'));
console.log(lines.slice(idx, idx+4).join('\n'));
