'use client';

type Char = {
  name: string; class: number; base_level: number;
  sex: 'M' | 'F'; head_top: number; weapon: number; shield: number;
};

const JOB: Record<number, { label: string; color: string; abbr: string }> = {
  // ── Base / 1st ──────────────────────────────────────────────────
  0:    { label: 'Novice',          color: '#9ca3af', abbr: 'NOV' },
  1:    { label: 'Swordman',        color: '#ef4444', abbr: 'SWD' },
  2:    { label: 'Mage',            color: '#818cf8', abbr: 'MAG' },
  3:    { label: 'Archer',          color: '#4ade80', abbr: 'ARC' },
  4:    { label: 'Acolyte',         color: '#fbbf24', abbr: 'ACO' },
  5:    { label: 'Merchant',        color: '#fb923c', abbr: 'MER' },
  6:    { label: 'Thief',           color: '#a78bfa', abbr: 'THF' },
  // ── 2nd ─────────────────────────────────────────────────────────
  7:    { label: 'Knight',          color: '#ef4444', abbr: 'KNT' },
  8:    { label: 'Priest',          color: '#fbbf24', abbr: 'PRI' },
  9:    { label: 'Wizard',          color: '#818cf8', abbr: 'WIZ' },
  10:   { label: 'Blacksmith',      color: '#fb923c', abbr: 'BS'  },
  11:   { label: 'Hunter',          color: '#4ade80', abbr: 'HNT' },
  12:   { label: 'Assassin',        color: '#a78bfa', abbr: 'ASN' },
  14:   { label: 'Crusader',        color: '#ef4444', abbr: 'CRU' },
  15:   { label: 'Monk',            color: '#fbbf24', abbr: 'MNK' },
  16:   { label: 'Sage',            color: '#818cf8', abbr: 'SGE' },
  17:   { label: 'Rogue',           color: '#a78bfa', abbr: 'RGE' },
  18:   { label: 'Alchemist',       color: '#fb923c', abbr: 'ALC' },
  19:   { label: 'Bard',            color: '#34d399', abbr: 'BRD' },
  20:   { label: 'Dancer',          color: '#f472b6', abbr: 'DNC' },
  23:   { label: 'Super Novice',    color: '#9ca3af', abbr: 'SNV' },
  24:   { label: 'Gunslinger',      color: '#64748b', abbr: 'GUN' },
  25:   { label: 'Ninja',           color: '#475569', abbr: 'NNJ' },
  // ── Trans ────────────────────────────────────────────────────────
  4001: { label: 'High Novice',     color: '#9ca3af', abbr: 'HNV' },
  4008: { label: 'Lord Knight',     color: '#dc2626', abbr: 'LK'  },
  4009: { label: 'High Priest',     color: '#d97706', abbr: 'HP'  },
  4010: { label: 'High Wizard',     color: '#6366f1', abbr: 'HW'  },
  4011: { label: 'Whitesmith',      color: '#ea580c', abbr: 'WS'  },
  4012: { label: 'Sniper',          color: '#16a34a', abbr: 'SN'  },
  4013: { label: 'Assassin Cross',  color: '#7c3aed', abbr: 'SinX'},
  4015: { label: 'Paladin',         color: '#dc2626', abbr: 'PAL' },
  4016: { label: 'Champion',        color: '#d97706', abbr: 'CHP' },
  4017: { label: 'Professor',       color: '#6366f1', abbr: 'PRF' },
  4018: { label: 'Stalker',         color: '#7c3aed', abbr: 'STK' },
  4019: { label: 'Creator',         color: '#ea580c', abbr: 'CRT' },
  4020: { label: 'Clown',           color: '#34d399', abbr: 'CLW' },
  4021: { label: 'Gypsy',           color: '#f472b6', abbr: 'GYP' },
  // ── 3rd ─────────────────────────────────────────────────────────
  4054: { label: 'Rune Knight',     color: '#dc2626', abbr: 'RK'  },
  4055: { label: 'Warlock',         color: '#6366f1', abbr: 'WL'  },
  4056: { label: 'Ranger',          color: '#16a34a', abbr: 'RNG' },
  4057: { label: 'Arch Bishop',     color: '#d97706', abbr: 'AB'  },
  4058: { label: 'Mechanic',        color: '#ea580c', abbr: 'MC'  },
  4059: { label: 'Guillotine Cross',color: '#7c3aed', abbr: 'GX'  },
  4060: { label: 'Rune Knight',     color: '#b91c1c', abbr: 'RK'  },
  4061: { label: 'Warlock',         color: '#4f46e5', abbr: 'WL'  },
  4062: { label: 'Ranger',          color: '#15803d', abbr: 'RNG' },
  4063: { label: 'Arch Bishop',     color: '#b45309', abbr: 'AB'  },
  4064: { label: 'Mechanic',        color: '#c2410c', abbr: 'MC'  },
  4065: { label: 'Guillotine Cross',color: '#6d28d9', abbr: 'GX'  },
  4066: { label: 'Royal Guard',     color: '#dc2626', abbr: 'RG'  },
  4067: { label: 'Sorcerer',        color: '#6366f1', abbr: 'SC'  },
  4068: { label: 'Minstrel',        color: '#34d399', abbr: 'MIN' },
  4069: { label: 'Wanderer',        color: '#f472b6', abbr: 'WND' },
  4070: { label: 'Sura',            color: '#d97706', abbr: 'SUR' },
  4071: { label: 'Genetic',         color: '#ea580c', abbr: 'GEN' },
  4072: { label: 'Shadow Chaser',   color: '#7c3aed', abbr: 'SC'  },
  4073: { label: 'Royal Guard',     color: '#b91c1c', abbr: 'RG'  },
  4074: { label: 'Sorcerer',        color: '#4f46e5', abbr: 'SOR' },
  4075: { label: 'Minstrel',        color: '#059669', abbr: 'MIN' },
  4076: { label: 'Wanderer',        color: '#db2777', abbr: 'WND' },
  4077: { label: 'Sura',            color: '#b45309', abbr: 'SUR' },
  4078: { label: 'Genetic',         color: '#c2410c', abbr: 'GEN' },
  4079: { label: 'Shadow Chaser',   color: '#6d28d9', abbr: 'SC'  },
  // ── 4th ─────────────────────────────────────────────────────────
  4252: { label: 'Dragon Knight',   color: '#991b1b', abbr: 'DK'  },
  4253: { label: 'Meister',         color: '#9a3412', abbr: 'MST' },
  4254: { label: 'Shadow Cross',    color: '#581c87', abbr: 'SX'  },
  4255: { label: 'Arch Mage',       color: '#3730a3', abbr: 'AM'  },
  4256: { label: 'Cardinal',        color: '#92400e', abbr: 'CDL' },
  4257: { label: 'Windhawk',        color: '#14532d', abbr: 'WH'  },
  4258: { label: 'Imperial Guard',  color: '#991b1b', abbr: 'IG'  },
  4259: { label: 'Biolo',           color: '#9a3412', abbr: 'BIO' },
  4260: { label: 'Abyss Chaser',    color: '#581c87', abbr: 'AC'  },
  4261: { label: 'Elemental Master',color: '#3730a3', abbr: 'EM'  },
  4262: { label: 'Inquisitor',      color: '#92400e', abbr: 'INQ' },
  4263: { label: 'Troubadour',      color: '#14532d', abbr: 'TRB' },
  4264: { label: 'Trouvere',        color: '#9d174d', abbr: 'TRV' },
};

function getJob(classId: number) {
  return JOB[classId] ?? { label: `Class ${classId}`, color: '#6b7280', abbr: '???' };
}

export default function CharCard({ c }: { c: Char }) {
  const job = getJob(c.class);

  return (
    <div className="charCard" style={{ '--job-color': job.color } as React.CSSProperties}>
      <div className="charAvatar">
        <span className="charAbbr">{job.abbr}</span>
        {c.sex === 'F' && <span className="charSex">♀</span>}
      </div>
      <div className="charInfo">
        <span className="charJob">{job.label}</span>
        <span className="charName">{c.name}</span>
        <span className="charLv">Lv {c.base_level}</span>
      </div>
    </div>
  );
}
