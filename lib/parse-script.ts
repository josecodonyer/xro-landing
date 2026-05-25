/* Parsea comandos de script rAthena en líneas legibles en español. */

const STAT: Record<string, string> = {
  bStr: 'STR', bAgi: 'AGI', bVit: 'VIT', bInt: 'INT', bDex: 'DEX', bLuk: 'LUK',
  bAtk: 'ATK', bAtk2: 'ATK2', bDef: 'DEF', bMdef: 'MDEF',
  bMatk: 'MATK', bMaxHp: 'MaxHP', bMaxSp: 'MaxSP',
  bHit: 'Precisión', bFlee: 'Esquiva', bFlee2: 'Esquiva perfecta',
  bCritical: 'Crítico', bAspd: 'ASPD', bBaseLv: 'Nivel base',
};

const STAT_RATE: Record<string, string> = {
  bMaxHpRate: 'MaxHP', bMaxSpRate: 'MaxSP',
  bHpRecovRate: 'HP recovery', bSpRecovRate: 'SP recovery',
  bAtkRate: 'ATK', bMatkRate: 'MATK',
  bLongAtkRate: 'ranged damage', bShortAtkRate: 'melee damage',
  bCritAtkRate: 'critical damage',
  bMagicDamageReturn: 'magic reflect',
};

const RACE: Record<string, string> = {
  RC_Formless: 'Formless', RC_Undead: 'Undead',
  RC_Brute: 'Brute', RC_Plant: 'Plant', RC_Insect: 'Insect',
  RC_Fish: 'Fish', RC_Demon: 'Demon', RC_DemiHuman: 'Demi-Human',
  RC_Angel: 'Angel', RC_Dragon: 'Dragon', RC_Player: 'Player',
  RC_Boss: 'MVP/Boss',
};

const ELEMENT: Record<string, string> = {
  Ele_Neutral: 'Neutral', Ele_Water: 'Water', Ele_Earth: 'Earth',
  Ele_Fire: 'Fire', Ele_Wind: 'Wind', Ele_Poison: 'Poison',
  Ele_Holy: 'Holy', Ele_Dark: 'Dark', Ele_Ghost: 'Ghost',
  Ele_Undead: 'Undead',
};

const SIZE: Record<string, string> = {
  Size_Small: 'Small', Size_Medium: 'Medium', Size_Large: 'Large',
};

const SC_NAME: Record<string, string> = {
  SC_INCREASEAGI: 'Agility Up', SC_BLESSING: 'Blessing',
  SC_ASPERSIO: 'Aspersio', SC_GLORIA: 'Gloria', SC_ANGELUS: 'Angelus',
  SC_MAGNIFICAT: 'Magnificat', SC_ENDURE: 'Endure',
  SC_CONCENTRATION: 'Concentration', SC_LOUDEXCLAMATION: 'Loud Exclamation',
  SC_SPEARSQUALL: 'Spear Squall', SC_SPEARQUICKEN: 'Spear Quicken',
  SC_TWOHANDQUICKEN: 'Two-Hand Quicken',
};

function sign(n: number) { return n >= 0 ? `+${n}` : `${n}`; }
function pct(n: number)  { return n >= 0 ? `+${n}%` : `${n}%`; }

/* Strip C-style block comments and single-line comments. */
function stripComments(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

/* Extract all top-level statement strings (split on `;`). */
function statements(script: string): string[] {
  return stripComments(script)
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);
}

/* Try to parse a single Athena script statement into a human-readable line.
   Returns null if the statement is not recognised or not worth showing. */
function parseStatement(stmt: string): string | null {

  // ── bonus bStat, N ──────────────────────────────────────────────────────
  {
    const m = stmt.match(/^bonus\s+(b\w+)\s*,\s*(-?\d+)$/);
    if (m) {
      const [, key, raw] = m;
      const n = parseInt(raw);
      if (STAT[key])      return `${sign(n)} ${STAT[key]}`;
      if (STAT_RATE[key]) return `${pct(n)} ${STAT_RATE[key]}`;

      if (key === 'bAllStats') return `${sign(n)} to all stats`;
      if (key === 'bCastrate') return n < 0
        ? `${pct(-n)} cast time reduction`
        : `${pct(n)} cast time increase`;
      if (key === 'bFixedCastrate') return n < 0
        ? `${pct(-n)} fixed cast reduction`
        : `${pct(n)} fixed cast increase`;
      if (key === 'bVariableCastrate') return n < 0
        ? `${pct(-n)} variable cast reduction`
        : `${pct(n)} variable cast increase`;
      if (key === 'bNoRegen')   return 'No HP/SP regeneration';
      if (key === 'bSPGainValue') return n > 0 ? `+${n} SP on hit` : null;
      if (key === 'bHPGainValue') return n > 0 ? `+${n} HP on hit` : null;
      if (key === 'bAddItemDropRate') return `${pct(n)} item drop rate`;
    }
  }

  // ── bonus2 bAddRace / bSubRace / bAddEle / bSubEle / bAddSize ─────────
  {
    const m = stmt.match(/^bonus2\s+(\w+)\s*,\s*(\w+)\s*,\s*(-?\d+)$/);
    if (m) {
      const [, key, arg, raw] = m;
      const n = parseInt(raw);
      if (key === 'bAddRace' && RACE[arg]) return `${pct(n)} damage vs ${RACE[arg]}`;
      if (key === 'bSubRace' && RACE[arg]) return `${pct(n)} resistance vs ${RACE[arg]}`;
      if (key === 'bMagicAddRace' && RACE[arg]) return `${pct(n)} magic damage vs ${RACE[arg]}`;
      if (key === 'bAddEle'  && ELEMENT[arg]) return `${pct(n)} ${ELEMENT[arg]} damage`;
      if (key === 'bSubEle'  && ELEMENT[arg]) return `${pct(n)} ${ELEMENT[arg]} resistance`;
      if (key === 'bMagicAtkEle' && ELEMENT[arg]) return `${pct(n)} ${ELEMENT[arg]} magic damage`;
      if (key === 'bAddSize' && SIZE[arg]) return `${pct(n)} damage vs ${SIZE[arg]} enemies`;
      if (key === 'bAddRaceDropRate' && RACE[arg]) return `${pct(n)} drop rate from ${RACE[arg]}`;
      if (key === 'bSPGainRace' && RACE[arg]) return `+${n} SP on kill ${RACE[arg]}`;
      if (key === 'bHPGainRace' && RACE[arg]) return `+${n} HP on kill ${RACE[arg]}`;
    }
  }

  // ── itemheal rand(X,Y), rand(A,B) ─────────────────────────────────────
  {
    const m = stmt.match(/^itemheal\s+(.+?)\s*,\s*(.+)$/);
    if (m) {
      const [, hpRaw, spRaw] = m;
      const hp = parseRange(hpRaw);
      const sp = parseRange(spRaw);
      const parts: string[] = [];
      if (hp) parts.push(`Recover ${hp} HP`);
      if (sp) parts.push(`Recover ${sp} SP`);
      return parts.join(' y ') || null;
    }
  }

  // ── sc_start SC_NAME, duration, level, val4 ───────────────────────────
  {
    const m = stmt.match(/^sc_start\s+(SC_\w+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) {
      const [, sc, durMs, lv] = m;
      const name = SC_NAME[sc] ?? sc.replace('SC_', '').replace(/_/g, ' ').toLowerCase();
      const dur  = parseInt(durMs);
      const lvn  = parseInt(lv);
      const durStr = dur >= 60000 ? `${dur / 1000 | 0}s` : '';
      return `Grants ${name}${lvn > 1 ? ` Lv ${lvn}` : ''}${durStr ? ` (${durStr})` : ''}`;
    }
  }

  // ── getitem / getitem2 ─────────────────────────────────────────────────
  {
    const m = stmt.match(/^getitem\s+(\w+)\s*,\s*(\d+)/);
    if (m) return `Gives ${m[2]}× ${m[1].replace(/_/g, ' ')}`;
  }

  return null;
}

function parseRange(expr: string): string | null {
  const r = expr.trim();
  if (r === '0') return null;
  const m = r.match(/^rand\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (m) return `${m[1]}~${m[2]}`;
  if (/^\d+$/.test(r) && parseInt(r) > 0) return r;
  return null;
}

/* Public API: parse a full item script into a list of readable effect lines. */
export function parseItemScript(script: string): string[] {
  if (!script?.trim()) return [];
  return statements(script)
    .map(parseStatement)
    .filter((l): l is string => l !== null);
}
