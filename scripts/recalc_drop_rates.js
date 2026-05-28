/**
 * Recalculates pct values in public/mob_detail.json with current xRO server rates.
 *
 * Server rates (drops.conf):
 *   item_rate_equip:      800  (x8 — weapons & armor)
 *   item_rate_card:       900  (x9 — cards on normal mobs)
 *   item_rate_card_boss:  500  (x5 — cards on boss/MVP mobs)
 *   Everything else:      800  (x8 — common items, no change)
 *
 * Usage: node scripts/recalc_drop_rates.js
 */

const fs   = require('fs');
const path = require('path');

const EQUIP_MULT      = 800  / 100;   // 8
const CARD_MULT       = 900  / 100;   // 9
const CARD_BOSS_MULT  = 500  / 100;   // 5
const COMMON_MULT     = 800  / 100;   // 8 (unchanged, just for clarity)

const EQUIP_TYPES = new Set(['Weapon', 'Armor', 'Ammo']);

// Boss/MVP mob IDs extracted from rAthena mob_db.yml
const BOSS_IDS = new Set([
  1038,1039,1046,1059,1086,1087,1112,1115,1147,1150,1157,1159,1190,1251,1252,
  1272,1312,1373,1389,1399,1418,1492,1502,1511,1518,1583,1623,1630,1646,1647,
  1648,1649,1650,1651,1658,1685,1688,1708,1719,1734,1751,1766,1767,1768,1779,
  1785,1813,1817,1832,1871,1874,1876,1885,1917,1956,1957,1980,2022,2052,2068,
  2075,2087,2094,2095,2096,2097,2098,2099,2100,2101,2102,2103,2104,2105,2106,
  2107,2108,2109,2110,2111,2112,2113,2131,2156,2165,2187,2188,2189,2190,2194,
  2202,2212,2235,2236,2237,2238,2239,2240,2241,2249,2251,2253,2255,2306,2319,
  2341,2352,2362,2441,2442,2475,2476,2483,2529,2532,2533,2534,2535,2564,2942,
  2996,3000,3029,3073,3074,3097,3124,3181,3190,3220,3221,3222,3223,3224,3225,
  3240,3241,3242,3243,3244,3245,3246,3254,3426,3427,3428,3429,3430,3450,3473,
  3505,3621,3628,3633,3658,3659,3741,3757,3758,3796,3804,3810,
  20273,20277,20340,20346,20381,20419,20421,20422,20601,20620,20621,20642,20648,
  20659,20667,20668,20811,20843,20928,20934,20943,21301,21314,21316,21317,
  21360,21361,21395,
]);

function mult(type, mobId) {
  if (type === 'Card')           return BOSS_IDS.has(mobId) ? CARD_BOSS_MULT : CARD_MULT;
  if (EQUIP_TYPES.has(type))     return EQUIP_MULT;
  return COMMON_MULT;
}

const detailPath = path.join(__dirname, '../public/mob_detail.json');
const data = JSON.parse(fs.readFileSync(detailPath, 'utf8'));

for (const [mobIdStr, mob] of Object.entries(data)) {
  const mobId = parseInt(mobIdStr, 10);
  for (const drop of (mob.drops || [])) {
    const m   = mult(drop.type, mobId);
    drop.pct  = Math.min(100, parseFloat((drop.basePct * m).toFixed(4)));
  }
}

fs.writeFileSync(detailPath, JSON.stringify(data), 'utf8');
console.log('mob_detail.json updated with new drop rates.');
