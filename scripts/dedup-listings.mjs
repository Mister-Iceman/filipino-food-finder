import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kjhufdervnyuayhiwqtc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaHVmZGVydm55dWF5aGl3cXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTYxNTIsImV4cCI6MjA4NTEzMjE1Mn0.A8SdKwY6rOjs6VeiyC3gr0BBGvIVNU3j24gjXbrrXDc"
);

// Fetch all listings (paginated)
async function fetchAll() {
  const all = [];
  const pageSize = 1000;
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .range(offset, offset + pageSize - 1)
      .order("id", { ascending: true });
    if (error) throw error;
    all.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

// Normalize a string for comparison
function normalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Normalize address: strip suite/unit info for comparison
function normalizeAddress(str) {
  if (!str) return "";
  return normalize(str)
    .replace(/\b(ste|suite|unit|apt|#)\b.*/, "")
    .trim();
}

// Score a value: non-null, non-empty string is better
function hasValue(v) {
  return v !== null && v !== undefined && v !== "";
}

// Score a record by data completeness
function scoreRecord(rec) {
  const fields = [
    "phone", "website", "google_maps_url", "category_secondary",
    "google_rating", "google_reviews_count", "hours",
    "instagram_url", "facebook_url", "tiktok_url", "x_url"
  ];
  let score = 0;
  for (const f of fields) {
    if (hasValue(rec[f])) score++;
  }
  // Bonus for having google rating (strong signal of data quality)
  if (hasValue(rec.google_rating)) score += 5;
  // Bonus for detailed google_maps_url (place URL > search URL)
  if (hasValue(rec.google_maps_url) && rec.google_maps_url.includes("/place/")) score += 3;
  return score;
}

// Merge fields from secondary records into the primary (keeper)
function mergeRecords(keeper, duplicates) {
  const merged = { ...keeper };
  const mergeable = [
    "phone", "website", "google_maps_url", "category_secondary",
    "google_rating", "google_reviews_count", "hours",
    "instagram_url", "facebook_url", "tiktok_url", "x_url"
  ];

  for (const dup of duplicates) {
    for (const field of mergeable) {
      // If keeper doesn't have a value but dup does, take it
      if (!hasValue(merged[field]) && hasValue(dup[field])) {
        merged[field] = dup[field];
      }
      // For google_rating and google_reviews_count, prefer the higher/more recent value
      if (field === "google_reviews_count" && hasValue(dup[field]) && hasValue(merged[field])) {
        if (dup[field] > merged[field]) {
          merged[field] = dup[field];
          // Also take the rating from the same record with more reviews
          if (hasValue(dup.google_rating)) {
            merged.google_rating = dup.google_rating;
          }
        }
      }
      // For google_maps_url, prefer /place/ URLs over /search/ URLs
      if (field === "google_maps_url" && hasValue(dup[field])) {
        if (!merged[field]?.includes("/place/") && dup[field].includes("/place/")) {
          merged[field] = dup[field];
        }
      }
    }
  }

  return merged;
}

async function main() {
  console.log("Fetching all listings...");
  const listings = await fetchAll();
  console.log(`Fetched ${listings.length} listings.`);

  // Group by normalized (name + city + state)
  const groups = new Map();
  for (const listing of listings) {
    const key = `${normalize(listing.name)}|${normalize(listing.city)}|${normalize(listing.state)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(listing);
  }

  // Also check for address-level duplicates within same-name groups
  // (e.g., two "Seafood City Supermarket" in National City, CA at different addresses)
  const finalGroups = new Map();
  for (const [key, members] of groups) {
    if (members.length === 1) continue; // no duplicates

    // Sub-group by normalized address
    const addrGroups = new Map();
    for (const m of members) {
      const addrKey = normalizeAddress(m.address_street);
      let matched = false;
      for (const [existingAddr, group] of addrGroups) {
        // Check if addresses are similar (one starts with the other)
        if (existingAddr.startsWith(addrKey) || addrKey.startsWith(existingAddr) ||
            existingAddr === addrKey) {
          group.push(m);
          matched = true;
          break;
        }
      }
      if (!matched) {
        addrGroups.set(addrKey, [m]);
      }
    }

    for (const [addrKey, addrMembers] of addrGroups) {
      if (addrMembers.length > 1) {
        const groupKey = `${key}|${addrKey}`;
        finalGroups.set(groupKey, addrMembers);
      }
    }
  }

  console.log(`\nFound ${finalGroups.size} duplicate groups:\n`);

  const updates = []; // { id, data }
  const deletes = []; // ids to delete

  for (const [key, members] of finalGroups) {
    // Sort by score descending — best record first
    members.sort((a, b) => scoreRecord(b) - scoreRecord(a));
    const keeper = members[0];
    const dupes = members.slice(1);
    const dupeIds = dupes.map((d) => d.id);

    console.log(`  "${keeper.name}" — ${keeper.city}, ${keeper.state} (${keeper.address_street})`);
    console.log(`    Keeper: id=${keeper.id} (score=${scoreRecord(keeper)})`);
    for (const d of dupes) {
      console.log(`    Remove: id=${d.id} (score=${scoreRecord(d)}) — ${d.address_street}`);
    }

    const merged = mergeRecords(keeper, dupes);

    // Only update if merged differs from keeper
    const fieldsToCheck = [
      "phone", "website", "google_maps_url", "category_secondary",
      "google_rating", "google_reviews_count", "hours",
      "instagram_url", "facebook_url", "tiktok_url", "x_url"
    ];
    const changes = {};
    let hasChanges = false;
    for (const f of fieldsToCheck) {
      if (merged[f] !== keeper[f]) {
        changes[f] = merged[f];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      updates.push({ id: keeper.id, data: changes });
      console.log(`    Merging fields:`, Object.keys(changes).join(", "));
    }

    deletes.push(...dupeIds);
    console.log("");
  }

  console.log(`\nSummary:`);
  console.log(`  Records to update (merge data): ${updates.length}`);
  console.log(`  Records to delete: ${deletes.length}`);
  console.log(`  Final listing count: ${listings.length - deletes.length}`);

  if (deletes.length === 0) {
    console.log("\nNo duplicates found. Exiting.");
    return;
  }

  // Execute updates
  console.log("\nApplying updates...");
  let updateSuccess = 0;
  for (const u of updates) {
    const { error } = await supabase
      .from("listings")
      .update(u.data)
      .eq("id", u.id);
    if (error) {
      console.error(`  Failed to update id=${u.id}:`, error.message);
    } else {
      updateSuccess++;
    }
  }
  console.log(`  Updated ${updateSuccess}/${updates.length} records.`);

  // Execute deletes in batches
  console.log("Deleting duplicates...");
  const batchSize = 50;
  let deleteSuccess = 0;
  for (let i = 0; i < deletes.length; i += batchSize) {
    const batch = deletes.slice(i, i + batchSize);
    const { error } = await supabase
      .from("listings")
      .delete()
      .in("id", batch);
    if (error) {
      console.error(`  Failed to delete batch:`, error.message);
    } else {
      deleteSuccess += batch.length;
    }
  }
  console.log(`  Deleted ${deleteSuccess}/${deletes.length} records.`);

  console.log("\nDeduplication complete!");
}

main().catch(console.error);
