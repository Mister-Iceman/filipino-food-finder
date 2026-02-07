const SUPABASE_URL = "https://kjhufdervnyuayhiwqtc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaHVmZGVydm55dWF5aGl3cXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTYxNTIsImV4cCI6MjA4NTEzMjE1Mn0.A8SdKwY6rOjs6VeiyC3gr0BBGvIVNU3j24gjXbrrXDc";

async function fetchBatch(offset, limit) {
  const url = `${SUPABASE_URL}/rest/v1/listings?select=id,name,address_street,city,state,google_rating,google_reviews_count&order=id.asc&offset=${offset}&limit=${limit}`;
  const res = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
  return res.json();
}

function norm(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

async function main() {
  const b1 = await fetchBatch(0, 1000);
  const b2 = await fetchBatch(1000, 1000);
  const all = [...b1, ...b2];

  // === SEAFOOD CITY ===
  console.log("=== ALL SEAFOOD CITY SUPERMARKET ENTRIES ===\n");
  const sc = all.filter((r) => r.name === "Seafood City Supermarket");
  const scByCity = new Map();
  for (const r of sc) {
    const k = `${r.city}, ${r.state}`;
    if (!scByCity.has(k)) scByCity.set(k, []);
    scByCity.get(k).push(r);
  }
  for (const [city, members] of [...scByCity].sort((a, b) => a[0].localeCompare(b[0]))) {
    const hasDupeAddrs = new Set(members.map((m) => norm(m.address_street))).size < members.length;
    const tag = hasDupeAddrs ? " ** HAS DUPLICATES **" : "";
    console.log(`  ${city} (${members.length} entries)${tag}`);
    for (const r of members) {
      const rating = r.google_rating !== null ? `${r.google_rating} (${r.google_reviews_count} reviews)` : "NONE";
      console.log(`    ID: ${String(r.id).padEnd(5)} | ${(r.address_street || "").padEnd(38)} | Rating: ${rating}`);
    }
  }
  console.log(`\n  Total Seafood City entries: ${sc.length}\n`);

  // === ISLAND PACIFIC ===
  console.log("=== ALL ISLAND PACIFIC SUPERMARKET ENTRIES ===\n");
  const ip = all.filter((r) => r.name.startsWith("Island Pacific Supermarket"));
  const ipByCity = new Map();
  for (const r of ip) {
    const k = `${r.city}, ${r.state}`;
    if (!ipByCity.has(k)) ipByCity.set(k, []);
    ipByCity.get(k).push(r);
  }
  for (const [city, members] of [...ipByCity].sort((a, b) => a[0].localeCompare(b[0]))) {
    const hasDupeAddrs = new Set(members.map((m) => norm(m.address_street))).size < members.length;
    const tag = hasDupeAddrs ? " ** HAS DUPLICATES **" : "";
    console.log(`  ${city} (${members.length} entries)${tag}`);
    for (const r of members) {
      const rating = r.google_rating !== null ? `${r.google_rating} (${r.google_reviews_count} reviews)` : "NONE";
      console.log(`    ID: ${String(r.id).padEnd(5)} | ${(r.address_street || "").padEnd(38)} | Rating: ${rating}`);
    }
  }
  console.log(`\n  Total Island Pacific entries: ${ip.length}\n`);

  // === SHARED ADDRESSES ===
  console.log("=== SHARED ADDRESSES (same address between chains) ===\n");
  let shared = 0;
  for (const s of sc) {
    for (const i of ip) {
      if (norm(s.city) === norm(i.city) && norm(s.state) === norm(i.state) && norm(s.address_street) === norm(i.address_street)) {
        console.log(`  MATCH: ${s.address_street}, ${s.city} | SC id=${s.id} vs IP id=${i.id}`);
        shared++;
      }
    }
  }
  if (shared === 0) console.log("  None found.");
}

main().catch(console.error);
