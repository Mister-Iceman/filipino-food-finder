const SUPABASE_URL = "https://kjhufdervnyuayhiwqtc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaHVmZGVydm55dWF5aGl3cXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTYxNTIsImV4cCI6MjA4NTEzMjE1Mn0.A8SdKwY6rOjs6VeiyC3gr0BBGvIVNU3j24gjXbrrXDc";

async function fetchBatch(offset, limit) {
  const url = `${SUPABASE_URL}/rest/v1/listings?select=id,name,address_street,city,state,zip,google_rating,google_reviews_count&order=id.asc&offset=${offset}&limit=${limit}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  return res.json();
}

function norm(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}
function normAddr(s) {
  return norm(s).replace(/\b(ste|suite|unit|apt|#)\b.*/, "").trim();
}

async function main() {
  // Fetch all
  const b1 = await fetchBatch(0, 1000);
  const b2 = await fetchBatch(1000, 1000);
  const all = [...b1, ...b2];
  console.log("Total listings:", all.length);

  // Group by name+city+state
  const groups = new Map();
  for (const r of all) {
    const key = `${norm(r.name)}|${norm(r.city)}|${norm(r.state)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  // Find address-level duplicates
  const dupes = [];
  for (const [key, members] of groups) {
    if (members.length < 2) continue;
    const addrMap = new Map();
    for (const m of members) {
      const ak = normAddr(m.address_street);
      let found = false;
      for (const [existAddr, grp] of addrMap) {
        if (existAddr.startsWith(ak) || ak.startsWith(existAddr) || existAddr === ak) {
          grp.push(m);
          found = true;
          break;
        }
      }
      if (!found) addrMap.set(ak, [m]);
    }
    for (const [, addrMembers] of addrMap) {
      if (addrMembers.length > 1) dupes.push(addrMembers);
    }
  }

  console.log(`\nDuplicate groups found: ${dupes.length}\n`);

  for (const group of dupes) {
    console.log("---");
    console.log(`NAME: ${group[0].name} | ${group[0].city}, ${group[0].state}`);
    for (const r of group) {
      const rating = r.google_rating !== null ? `${r.google_rating} (${r.google_reviews_count} reviews)` : "NONE";
      console.log(`  ID: ${String(r.id).padEnd(5)} | Addr: ${(r.address_street || "").padEnd(38)} | Rating: ${rating}`);
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log("Total duplicate groups:", dupes.length);
  console.log("Total records to remove (keeping 1 per group):", dupes.reduce((s, g) => s + g.length - 1, 0));
  console.log("Current total:", all.length);
  console.log("After dedup:", all.length - dupes.reduce((s, g) => s + g.length - 1, 0));
}

main().catch(console.error);
