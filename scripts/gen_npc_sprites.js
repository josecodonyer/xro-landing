/**
 * Generates public/npc_sprites.json
 * Maps each NPC name → { id, url } using divine-pride's NpcIdentity list.
 *
 * Usage:
 *   DIVINE_PRIDE_API_KEY=<your_key> node scripts/gen_npc_sprites.js
 *
 * Get an API key at: https://www.divine-pride.net/forum (your profile → API key)
 */

const fs = require('fs');
const wikiData = require('../public/wiki_data.json');

const API_KEY = process.env.DIVINE_PRIDE_API_KEY;
if (!API_KEY) {
  console.error('Error: Set DIVINE_PRIDE_API_KEY environment variable.');
  console.error('  DIVINE_PRIDE_API_KEY=yourkey node scripts/gen_npc_sprites.js');
  process.exit(1);
}

// Collect all unique NPC names from wiki_data shops
const npcNames = new Set();
for (const shops of Object.values(wikiData.shops)) {
  for (const shop of shops) {
    if (shop.npc) npcNames.add(shop.npc);
  }
}
console.log(`Found ${npcNames.size} unique NPC names`);

async function main() {
  // divine-pride NpcIdentity — returns { "id": "AegisName", ... } or array
  // The full list endpoint: GET /api/database/NpcIdentity
  const identityUrl = `https://www.divine-pride.net/api/database/NpcIdentity?apiKey=${API_KEY}`;
  console.log('Fetching NpcIdentity list from divine-pride...');

  let identities;
  try {
    const res = await fetch(identityUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    identities = await res.json();
  } catch (err) {
    console.error('Failed to fetch NpcIdentity list:', err.message);
    process.exit(1);
  }

  // Build id→displayName from display names via individual NPC lookups
  // NpcIdentity returns { id: aegisName } — we also need display names,
  // so we'll fetch each candidate NPC to get its display name.
  // Build aegis→id map first:
  const aegisToId = {};
  if (Array.isArray(identities)) {
    for (const entry of identities) {
      aegisToId[entry.aegisName ?? entry.name] = entry.id;
    }
  } else {
    // plain object: { "id": "AEGIS_NAME", ... }
    for (const [id, aegis] of Object.entries(identities)) {
      aegisToId[aegis] = parseInt(id);
    }
  }

  console.log(`NpcIdentity list has ${Object.keys(aegisToId).length} entries`);

  const sprites = {};
  let found = 0;

  // Strategy 1: direct name match (display name === our NPC name)
  // divine-pride NPC names often match iRO display names for common shop NPCs
  for (const npcName of npcNames) {
    // Try exact match
    if (aegisToId[npcName] !== undefined) {
      const id = aegisToId[npcName];
      sprites[npcName] = {
        id,
        url: `https://static.divine-pride.net/images/mobs/png/${id}.png`,
      };
      found++;
      continue;
    }

    // Try aegis-style: "Tool Dealer" → "TOOL_DEALER"
    const aegisGuess = npcName.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
    if (aegisToId[aegisGuess] !== undefined) {
      const id = aegisToId[aegisGuess];
      sprites[npcName] = {
        id,
        url: `https://static.divine-pride.net/images/mobs/png/${id}.png`,
      };
      found++;
      continue;
    }
  }

  // Strategy 2: for unmatched names, try individual divine-pride search
  const unmatched = [...npcNames].filter(n => !sprites[n]);
  if (unmatched.length > 0) {
    console.log(`Searching individually for ${unmatched.length} unmatched NPCs...`);
    for (const npcName of unmatched) {
      try {
        const searchUrl = `https://www.divine-pride.net/api/database/npc?name=${encodeURIComponent(npcName)}&apiKey=${API_KEY}&language=0`;
        const res = await fetch(searchUrl);
        if (!res.ok) continue;
        const results = await res.json();
        const match = Array.isArray(results) ? results[0] : results;
        if (match?.id) {
          sprites[npcName] = {
            id: match.id,
            url: `https://static.divine-pride.net/images/mobs/png/${match.id}.png`,
          };
          found++;
          console.log(`  ✓ ${npcName} → id ${match.id}`);
        }
        // Rate limit: 200ms between requests
        await new Promise(r => setTimeout(r, 200));
      } catch {
        // silently skip
      }
    }
  }

  fs.writeFileSync('./public/npc_sprites.json', JSON.stringify(sprites, null, 2));
  console.log(`\nDone: ${found}/${npcNames.size} NPC sprites resolved → public/npc_sprites.json`);

  const missing = [...npcNames].filter(n => !sprites[n]);
  if (missing.length > 0) {
    console.log(`\nUnresolved (${missing.length}):`);
    missing.forEach(n => console.log(`  - ${n}`));
  }
}

main();
