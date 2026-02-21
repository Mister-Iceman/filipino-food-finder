const fs = require('fs');

let page = fs.readFileSync('app/admin/events/page.tsx', 'utf8');

// Fix update - using \r\n to match Windows line endings
page = page.replace(
  "{\r\n          password: ADMIN_PASSWORD,\r\n          eventId: editingId,\r\n          eventData: formData\r\n        })",
  "{\r\n          password: ADMIN_PASSWORD,\r\n          eventId: editingId,\r\n          eventData: Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, v === '' ? null : v]))\r\n        })"
);

// Fix create - using \r\n to match Windows line endings
page = page.replace(
  "{\r\n          password: ADMIN_PASSWORD,\r\n          eventData: formData\r\n        })",
  "{\r\n          password: ADMIN_PASSWORD,\r\n          eventData: Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, v === '' ? null : v]))\r\n        })"
);

fs.writeFileSync('app/admin/events/page.tsx', page);
console.log('Done. Verify:');
const lines = page.split('\n');
lines.forEach((l,i)=>{ if(l.includes('fromEntries')) console.log(i+1, l.trim()); });
