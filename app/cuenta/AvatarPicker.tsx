'use client';

import { useState, useTransition } from 'react';
import { selectAvatarAction } from './actions';
import { hairColorHex } from '@/lib/avatar-shared';
import styles from './cuenta.module.css';

type Char = {
  char_id: number;
  name: string;
  class: number;
  base_level: number;
  sex: 'M' | 'F';
  hair: number;
  hair_color: number;
  clothes_color: number;
  head_top: number;
  head_mid: number;
  head_bottom: number;
  weapon: number;
  shield: number;
};

const JOB: Record<number, { label: string; color: string; abbr: string }> = {
  0:    { label: 'Novice',           color: '#9ca3af', abbr: 'NOV' },
  1:    { label: 'Swordman',         color: '#ef4444', abbr: 'SWD' },
  2:    { label: 'Mage',             color: '#818cf8', abbr: 'MAG' },
  3:    { label: 'Archer',           color: '#4ade80', abbr: 'ARC' },
  4:    { label: 'Acolyte',          color: '#fbbf24', abbr: 'ACO' },
  5:    { label: 'Merchant',         color: '#fb923c', abbr: 'MER' },
  6:    { label: 'Thief',            color: '#a78bfa', abbr: 'THF' },
  7:    { label: 'Knight',           color: '#ef4444', abbr: 'KNT' },
  8:    { label: 'Priest',           color: '#fbbf24', abbr: 'PRI' },
  9:    { label: 'Wizard',           color: '#818cf8', abbr: 'WIZ' },
  10:   { label: 'Blacksmith',       color: '#fb923c', abbr: 'BS'  },
  11:   { label: 'Hunter',           color: '#4ade80', abbr: 'HNT' },
  12:   { label: 'Assassin',         color: '#a78bfa', abbr: 'ASN' },
  14:   { label: 'Crusader',         color: '#ef4444', abbr: 'CRU' },
  15:   { label: 'Monk',             color: '#fbbf24', abbr: 'MNK' },
  16:   { label: 'Sage',             color: '#818cf8', abbr: 'SGE' },
  17:   { label: 'Rogue',            color: '#a78bfa', abbr: 'RGE' },
  18:   { label: 'Alchemist',        color: '#fb923c', abbr: 'ALC' },
  19:   { label: 'Bard',             color: '#34d399', abbr: 'BRD' },
  20:   { label: 'Dancer',           color: '#f472b6', abbr: 'DNC' },
  4008: { label: 'Lord Knight',      color: '#dc2626', abbr: 'LK'  },
  4009: { label: 'High Priest',      color: '#d97706', abbr: 'HP'  },
  4010: { label: 'High Wizard',      color: '#6366f1', abbr: 'HW'  },
  4011: { label: 'Whitesmith',       color: '#ea580c', abbr: 'WS'  },
  4012: { label: 'Sniper',           color: '#16a34a', abbr: 'SN'  },
  4013: { label: 'Assassin Cross',   color: '#7c3aed', abbr: 'SinX'},
  4015: { label: 'Paladin',          color: '#dc2626', abbr: 'PAL' },
  4016: { label: 'Champion',         color: '#d97706', abbr: 'CHP' },
  4017: { label: 'Professor',        color: '#6366f1', abbr: 'PRF' },
  4018: { label: 'Stalker',          color: '#7c3aed', abbr: 'STK' },
  4054: { label: 'Rune Knight',      color: '#dc2626', abbr: 'RK'  },
  4055: { label: 'Warlock',          color: '#6366f1', abbr: 'WL'  },
  4056: { label: 'Ranger',           color: '#16a34a', abbr: 'RNG' },
  4057: { label: 'Arch Bishop',      color: '#d97706', abbr: 'AB'  },
  4058: { label: 'Mechanic',         color: '#ea580c', abbr: 'MC'  },
  4059: { label: 'Guillotine Cross', color: '#7c3aed', abbr: 'GX'  },
  4066: { label: 'Royal Guard',      color: '#dc2626', abbr: 'RG'  },
  4067: { label: 'Sorcerer',         color: '#6366f1', abbr: 'SC'  },
  4070: { label: 'Sura',             color: '#d97706', abbr: 'SUR' },
  4071: { label: 'Genetic',          color: '#ea580c', abbr: 'GEN' },
  4252: { label: 'Dragon Knight',    color: '#991b1b', abbr: 'DK'  },
  4253: { label: 'Meister',          color: '#9a3412', abbr: 'MST' },
  4254: { label: 'Shadow Cross',     color: '#581c87', abbr: 'SX'  },
  4255: { label: 'Arch Mage',        color: '#3730a3', abbr: 'AM'  },
  4256: { label: 'Cardinal',         color: '#92400e', abbr: 'CDL' },
  4257: { label: 'Windhawk',         color: '#14532d', abbr: 'WH'  },
};

function getJob(cls: number) {
  return JOB[cls] ?? { label: `Class ${cls}`, color: '#6b7280', abbr: '???' };
}

export function SpriteAvatar({
  charClass, hairColor, size = 56, charPreview,
}: {
  charClass: number; hairColor: number; size?: number; charPreview?: string | null;
}) {
  const job = getJob(charClass);
  const hair = hairColorHex(hairColor);
  const [imgFailed, setImgFailed] = useState(false);

  // If server exposes a preview image, use it
  const src = (!imgFailed && charPreview) ? charPreview
    : !imgFailed ? `https://static.divine-pride.net/images/jobs/png/${charClass}.png`
    : null;

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: job.color, overflow: 'hidden', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {src ? (
        <img
          src={src}
          alt={job.label}
          width={size}
          height={size}
          style={{ objectFit: 'contain', imageRendering: 'pixelated' }}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span style={{ fontFamily: 'monospace', fontSize: size * 0.25, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
          {job.abbr}
        </span>
      )}
      {/* Hair color accent dot */}
      <span style={{
        position: 'absolute', bottom: 1, right: 1,
        width: size * 0.22, height: size * 0.22,
        borderRadius: '50%',
        background: hair,
        border: '1.5px solid rgba(255,255,255,0.8)',
      }} />
    </div>
  );
}

export default function AvatarPicker({
  chars,
  currentCharName,
}: {
  chars: Char[];
  currentCharName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(currentCharName);
  const [isPending, startTransition] = useTransition();

  function handleSelect(char: Char) {
    setSelected(char.name);
    startTransition(async () => {
      await selectAvatarAction({
        charName:     char.name,
        charClass:    char.class,
        charSex:      char.sex,
        hair:         char.hair,
        hairColor:    char.hair_color,
        clothesColor: char.clothes_color,
        headTop:      char.head_top,
        headMid:      char.head_mid,
        headBottom:   char.head_bottom,
        weapon:       char.weapon,
        shield:       char.shield,
      });
      setOpen(false);
    });
  }

  const selectedChar = chars.find(c => c.name === selected) ?? null;

  return (
    <>
      <button
        type="button"
        className={styles.avatarBtn}
        onClick={() => setOpen(true)}
        aria-label="Cambiar avatar"
      >
        {selectedChar ? (
          <SpriteAvatar charClass={selectedChar.class} hairColor={selectedChar.hair_color} size={72} />
        ) : (
          <div className={styles.avatarEmpty}>
            <span className={styles.avatarPlus}>+</span>
          </div>
        )}
        <span className={styles.avatarEditBadge}>✎</span>
      </button>

      {open && (
        <div className={styles.modalBackdrop} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Elige tu avatar</h2>
              <button className={styles.modalClose} onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
            </div>
            <p className={styles.modalSubtitle}>
              Selecciona el personaje cuyo sprite usarás como foto de perfil. El punto de color indica el color del pelo.
            </p>

            {chars.length === 0 ? (
              <p className={styles.modalEmpty}>No tienes personajes creados todavía.</p>
            ) : (
              <div className={styles.charPickerGrid}>
                {chars.map(char => {
                  const job = getJob(char.class);
                  const isSelected = char.name === selected;
                  return (
                    <button
                      key={char.char_id}
                      type="button"
                      className={`${styles.charPickerCard} ${isSelected ? styles.charPickerCardActive : ''}`}
                      onClick={() => handleSelect(char)}
                      disabled={isPending}
                    >
                      <SpriteAvatar charClass={char.class} hairColor={char.hair_color} size={52} />
                      <div className={styles.charPickerInfo}>
                        <span className={styles.charPickerName}>{char.name}</span>
                        <span className={styles.charPickerJob} style={{ color: job.color }}>{job.label}</span>
                        <span className={styles.charPickerLv}>Lv {char.base_level} · {char.sex === 'F' ? '♀' : '♂'}</span>
                      </div>
                      {isSelected && <span className={styles.charPickerCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
