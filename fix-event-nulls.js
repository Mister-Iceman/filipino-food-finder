const fs = require('fs');

// Fix 1 - submit-event/page.tsx - add null conversion before insert
let submit = fs.readFileSync('app/submit-event/page.tsx', 'utf8');
submit = submit.replace(
  `const { error: submitError } = await supabase
      .from('event_submissions')
      .insert([{
        ...formData,
        status: 'pending'
      }])`,
  `const cleanData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, v === '' ? null : v])
    )
    const { error: submitError } = await supabase
      .from('event_submissions')
      .insert([{
        ...cleanData,
        status: 'pending'
      }])`
);
fs.writeFileSync('app/submit-event/page.tsx', submit);
console.log('✓ submit-event/page.tsx fixed');

// Fix 2 - admin/events/create/route.ts - sanitize eventData before insert
let create = fs.readFileSync('app/api/admin/events/create/route.ts', 'utf8');
create = create.replace(
  `const { data, error } = await supabaseAdmin
    .from('events')
    .insert([body.eventData])
    .select()`,
  `const cleanData = Object.fromEntries(
    Object.entries(body.eventData).map(([k, v]) => [k, v === '' ? null : v])
  )
  const { data, error } = await supabaseAdmin
    .from('events')
    .insert([cleanData])
    .select()`
);
fs.writeFileSync('app/api/admin/events/create/route.ts', create);
console.log('✓ api/admin/events/create fixed');

// Fix 3 - admin/events/update/route.ts - sanitize eventData before update
let update = fs.readFileSync('app/api/admin/events/update/route.ts', 'utf8');
update = update.replace(
  `const { data, error } = await supabaseAdmin
    .from('events')
    .update(body.eventData)
    .eq('id', body.eventId)
    .select()`,
  `const cleanData = Object.fromEntries(
    Object.entries(body.eventData).map(([k, v]) => [k, v === '' ? null : v])
  )
  const { data, error } = await supabaseAdmin
    .from('events')
    .update(cleanData)
    .eq('id', body.eventId)
    .select()`
);
fs.writeFileSync('app/api/admin/events/update/route.ts', update);
console.log('✓ api/admin/events/update fixed');

console.log('\nAll 3 files fixed. Empty strings will now be sent as NULL to Supabase.');
