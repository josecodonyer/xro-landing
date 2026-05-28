/**
 * Ragnarok Online .spr file parser.
 *
 * Supports:
 *   v0x100 / v0x101 — indexed (palette) frames
 *   v0x200           — BGRA frames only
 *   v0x201 / v0x202  — indexed (RLE) + BGRA frames
 *
 * Returns an array of { width, height, data: Buffer (RGBA) } objects.
 */

function parseSpr(buffer) {
  let offset = 0;

  function read8()  { return buffer.readUInt8(offset++); }
  function read16() { const v = buffer.readUInt16LE(offset); offset += 2; return v; }
  function read32() { const v = buffer.readUInt32LE(offset); offset += 4; return v; }

  const magic = buffer.slice(0, 2).toString('ascii');
  if (magic !== 'SP') throw new Error('Not a valid .spr file');
  offset = 2;

  const version = read16();

  let indexedCount = 0;
  let rgbaCount    = 0;

  if (version >= 0x200) {
    indexedCount = read16();
    rgbaCount    = read16();
  } else {
    indexedCount = read16();
  }

  const indexedFrames = [];
  const rgbaFrames    = [];

  // ── Indexed frames ──────────────────────────────────────────────────────────
  for (let i = 0; i < indexedCount; i++) {
    const width  = read16();
    const height = read16();
    const size   = width * height;
    let   data;

    if (version >= 0x201) {
      // RLE encoded
      const rleSize = read16();
      const raw = buffer.slice(offset, offset + rleSize);
      offset += rleSize;
      data = new Uint8Array(size);
      let rPos = 0, wPos = 0;
      while (rPos < raw.length) {
        const b = raw[rPos++];
        if (b === 0) {
          const count = raw[rPos++];
          wPos += count || 1;
        } else {
          data[wPos++] = b;
        }
      }
    } else {
      data = buffer.slice(offset, offset + size);
      offset += size;
    }
    indexedFrames.push({ width, height, data });
  }

  // ── RGBA frames ─────────────────────────────────────────────────────────────
  for (let i = 0; i < rgbaCount; i++) {
    const width  = read16();
    const height = read16();
    const raw    = buffer.slice(offset, offset + width * height * 4);
    offset += width * height * 4;
    // BGRA → RGBA
    const rgba = Buffer.alloc(width * height * 4);
    for (let p = 0; p < width * height; p++) {
      rgba[p * 4 + 0] = raw[p * 4 + 2]; // R
      rgba[p * 4 + 1] = raw[p * 4 + 1]; // G
      rgba[p * 4 + 2] = raw[p * 4 + 0]; // B
      rgba[p * 4 + 3] = raw[p * 4 + 3]; // A
    }
    rgbaFrames.push({ width, height, data: rgba });
  }

  // ── Palette (for indexed frames) ─────────────────────────────────────────────
  let palette = null;
  if (indexedCount > 0) {
    palette = buffer.slice(offset, offset + 256 * 4);
  }

  // ── Apply palette to indexed frames ─────────────────────────────────────────
  const resolvedIndexed = indexedFrames.map(({ width, height, data }) => {
    const rgba = Buffer.alloc(width * height * 4);
    for (let p = 0; p < width * height; p++) {
      const idx = data[p];
      if (idx === 0 || !palette) {
        // index 0 = transparent
        rgba[p * 4 + 3] = 0;
      } else {
        rgba[p * 4 + 0] = palette[idx * 4 + 0]; // R
        rgba[p * 4 + 1] = palette[idx * 4 + 1]; // G
        rgba[p * 4 + 2] = palette[idx * 4 + 2]; // B
        rgba[p * 4 + 3] = 255;
      }
    }
    return { width, height, data: rgba };
  });

  return { indexed: resolvedIndexed, rgba: rgbaFrames };
}

module.exports = { parseSpr };
