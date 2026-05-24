const mobDetail = require('../public/mob_detail.json');
const mobFull   = require('../public/mob_full.json');
const wikiData  = require('../public/wiki_data.json');
const fs        = require('fs');

const mobById = {};
for (const m of mobFull) mobById[String(m.Id)] = m;

const maps = {};

// Reverse mob_detail: map -> mobs
for (const [mobId, detail] of Object.entries(mobDetail)) {
  const mob = mobById[mobId];
  if (!mob) continue;
  const seen = {};
  for (const { map, count } of detail.maps) {
    const base = map.split(',')[0];
    seen[base] = (seen[base] || 0) + count;
  }
  for (const [mapName, count] of Object.entries(seen)) {
    if (!maps[mapName]) maps[mapName] = { mobs: [], npcs: [] };
    maps[mapName].mobs.push({
      id: mob.Id, name: mob.Name, level: mob.Level,
      element: mob.Element, elementLevel: mob.ElementLevel, count
    });
  }
}

// Sort mobs by count desc
for (const m of Object.values(maps)) {
  m.mobs.sort((a, b) => b.count - a.count);
}

// Add NPCs from shops
for (const [, shops] of Object.entries(wikiData.shops)) {
  for (const shop of shops) {
    if (!maps[shop.map]) maps[shop.map] = { mobs: [], npcs: [] };
    if (!maps[shop.map].npcs.find(n => n.name === shop.npc)) {
      maps[shop.map].npcs.push({ name: shop.npc, x: shop.x, y: shop.y });
    }
  }
}

fs.writeFileSync('./public/map_index.json', JSON.stringify(maps));
console.log('Maps generated:', Object.keys(maps).length);
