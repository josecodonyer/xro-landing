/**
 * Ragnarok Online .act file parser.
 *
 * Returns an array of actions, each containing frames, each frame containing layers.
 * Layer fields:
 *   x, y         — offset from anchor
 *   frameIndex   — index into the spr frame list (indexed | rgba depending on spriteType)
 *   isMirror     — flip horizontally
 *   color        — { r, g, b, a } tint (v0x202+)
 *   scaleX/Y     — scale (v0x205+)
 *   spriteType   — 0=indexed, 1=rgba
 *   rotation     — degrees (v0x204+)
 */

function parseAct(buffer) {
  let offset = 0;

  function read8()  { return buffer.readUInt8(offset++); }
  function read16() { const v = buffer.readUInt16LE(offset); offset += 2; return v; }
  function read32() { const v = buffer.readInt32LE(offset); offset += 4; return v; }
  function readF()  { const v = buffer.readFloatLE(offset); offset += 4; return v; }

  const magic = buffer.slice(0, 2).toString('ascii');
  if (magic !== 'AC') throw new Error('Not a valid .act file');
  offset = 2;

  const version     = read16();
  const actionCount = read16();
  offset += 10; // reserved

  const actions = [];

  for (let a = 0; a < actionCount; a++) {
    const frameCount = read32();
    const frames = [];

    for (let f = 0; f < frameCount; f++) {
      offset += 32; // range1, range2 (ignored)

      const layerCount = read32();
      const layers = [];

      for (let l = 0; l < layerCount; l++) {
        const x           = read32();
        const y           = read32();
        const frameIndex  = read32();
        const isMirror    = read32() !== 0;

        let color      = { r: 255, g: 255, b: 255, a: 255 };
        let scaleX     = 1, scaleY = 1;
        let rotation   = 0;
        let spriteType = 0;

        if (version >= 0x200) {
          color = { r: read8(), g: read8(), b: read8(), a: read8() };
          scaleX = scaleY = readF();
          rotation   = read32();
          spriteType = read32();
          if (version >= 0x204) rotation = readF();
          if (version >= 0x205) { scaleX = readF(); scaleY = readF(); }
        }

        layers.push({ x, y, frameIndex, isMirror, color, scaleX, scaleY, rotation, spriteType });
      }

      let delay = 150;
      if (version >= 0x200) delay = readF() * 25;

      let soundId = -1;
      if (version >= 0x200) soundId = read32();

      let anchor = null;
      if (version >= 0x203) {
        const anchorCount = read32();
        for (let i = 0; i < anchorCount; i++) {
          offset += 4; // ignored
          const ax = read32();
          const ay = read32();
          offset += 4; // attr
          if (i === 0) anchor = { x: ax, y: ay };
        }
      }

      frames.push({ layers, delay, soundId, anchor });
    }

    actions.push({ frames });
  }

  return { version, actions };
}

module.exports = { parseAct };
