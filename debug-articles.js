const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env.local manually
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) process.env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'found' : 'MISSING');
  console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'found' : 'MISSING');

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, status')
    .eq('slug', '10-filipino-dishes-every-food-lover-should-try')
    .eq('status', 'published')
    .single();

  console.log('data:', JSON.stringify(data));
  console.log('error:', JSON.stringify(error));
}

test();
