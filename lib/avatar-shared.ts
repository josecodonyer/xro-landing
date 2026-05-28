// Client-safe avatar utilities — no server imports allowed here.

const HAIR_COLORS: Record<number, string> = {
  0:  '#c8a878', 1:  '#a05030', 2:  '#f0d050', 3:  '#c89060',
  4:  '#906048', 5:  '#302010', 6:  '#d0d0d0', 7:  '#909090',
  8:  '#484848', 9:  '#181818', 10: '#c03030', 11: '#d07080',
  12: '#e0a0a0', 13: '#9030a0', 14: '#6830c0', 15: '#2050c0',
  16: '#3080d0', 17: '#60b0e0', 18: '#309050', 19: '#70c060',
  20: '#e0a030', 21: '#c06020', 22: '#784c30', 23: '#a07060',
  24: '#f0e8d0', 25: '#d0c0a0', 26: '#f0b0c0', 27: '#b03060',
  28: '#e070a0', 29: '#a0a0ff',
};

export function hairColorHex(index: number): string {
  return HAIR_COLORS[index] ?? '#c8a878';
}

export function jobSpriteUrl(charClass: number): string {
  return `https://static.divine-pride.net/images/jobs/png/${charClass}.png`;
}
