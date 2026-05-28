/**
 * Ragnarok Online character sprite renderer.
 *
 * Composites a full character (body + head) into a PNG Buffer using node-canvas.
 * Requires: npm install canvas @aws-sdk/client-s3
 *
 * Usage:
 *   const { renderCharacter } = require('./char-renderer');
 *   const png = await renderCharacter({
 *     classId: 4054, sex: 'M', hair: 5, hairColor: 9,
 *     action: 0,   // 0 = idle/stand, see ACTION_* constants below
 *     frame:  0,
 *   });
 *   // png is a Buffer containing a PNG image (128×128 transparent background)
 *
 * ACTION indices (standard RO .act order for body):
 *   0-7   idle (8 directions)
 *   8-15  walk (8 directions)
 *   16-23 sit  (8 directions)
 *   24-31 pick-up
 *   32-39 attack
 *   ...
 *
 * For a static front-facing preview: action=0, frame=0 (or action=3 for front walk).
 */

const { createCanvas, createImageData } = require('canvas');
const { fetchFile }   = require('./r2-client');
const { parseSpr }    = require('./spr-parser');
const { parseAct }    = require('./act-parser');
const { bodySpritePath, bodyActPath, headSpritePath, headActPath } = require('./job-paths');

// Canvas size for the output image
const CANVAS_W = 128;
const CANVAS_H = 128;
// Character anchor position on canvas (centre-ish, shifted up)
const ANCHOR_X = 64;
const ANCHOR_Y = 80;

// RO hair colour palette (index → RGBA array [r,g,b,a])
const HAIR_COLORS = [
  [200, 168, 120, 255], // 0  blonde
  [160,  80,  48, 255], // 1  brown
  [ 96,  64,  32, 255], // 2  dark brown
  [224, 200, 168, 255], // 3  light blonde
  [216, 168, 120, 255], // 4  sandy
  [ 32,  64, 128, 255], // 5  blue
  [ 48, 112,  48, 255], // 6  green
  [208,  96,  32, 255], // 7  orange
  [240, 240, 240, 255], // 8  white
  [ 24,  24,  24, 255], // 9  black
  [160,  32,  32, 255], // 10 red
  [128,  32, 160, 255], // 11 purple
  [  0, 160, 200, 255], // 12 teal
  [240, 200,  32, 255], // 13 yellow
  [200,  80, 120, 255], // 14 pink
  [248, 248, 248, 255], // 15 silver
  [ 64,  32,  16, 255], // 16 very dark brown
  [224, 152,  48, 255], // 17 gold
  [ 56,  56, 176, 255], // 18 cobalt
  [  0, 136,  80, 255], // 19 emerald
  [208,  48,  48, 255], // 20 crimson
  [152,  48, 192, 255], // 21 violet
  [ 48, 192, 208, 255], // 22 cyan
  [232, 240,  48, 255], // 23 lime
  [224,  96, 160, 255], // 24 rose
  [168, 168, 168, 255], // 25 grey
  [128,  80,  48, 255], // 26 chestnut
  [200, 128,  48, 255], // 27 caramel
  [  0,  80, 160, 255], // 28 royal blue
  [  0, 112,  48, 255], // 29 forest
];

/**
 * Recolour the hair sprite: map palette index 6 (the standard "red" hair slot)
 * to the player's chosen hair colour.  This is a simplified heuristic; in the
 * real client a proper palette swap is applied.  For a preview it is close enough.
 *
 * indexed_data: Uint8Array of palette indices (one per pixel)
 * palette:      original 256×4 palette bytes (RGBA layout from parseSpr)
 * hairColorIdx: player hair colour index (0-29)
 * Returns:      Buffer RGBA (width*height*4)
 */
function applyHairColor(width, height, indexedData, palette, hairColorIdx) {
  const target = HAIR_COLORS[hairColorIdx] ?? HAIR_COLORS[0];
  const rgba   = Buffer.alloc(width * height * 4);

  // Detect the "base" hair colour in the palette: pick the first non-transparent
  // index that is in the warm-red/brown range (the default hair colour).
  // We normalise by luminance so all hair shades shift together.
  for (let p = 0; p < width * height; p++) {
    const idx = indexedData[p];
    if (idx === 0 || !palette) {
      rgba[p * 4 + 3] = 0;
      continue;
    }

    const pr = palette[idx * 4 + 0];
    const pg = palette[idx * 4 + 1];
    const pb = palette[idx * 4 + 2];

    // Check if this is a "hair" colour: more red than blue, moderate saturation
    const isHair = pr > 80 && pr > pb * 1.5 && pg < 180;

    if (isHair) {
      // Re-tint: preserve relative luminance but shift hue to target
      const lum = (0.299 * pr + 0.587 * pg + 0.114 * pb) / 255;
      rgba[p * 4 + 0] = Math.min(255, Math.round(target[0] * lum * 1.1));
      rgba[p * 4 + 1] = Math.min(255, Math.round(target[1] * lum * 1.1));
      rgba[p * 4 + 2] = Math.min(255, Math.round(target[2] * lum * 1.1));
      rgba[p * 4 + 3] = 255;
    } else {
      rgba[p * 4 + 0] = pr;
      rgba[p * 4 + 1] = pg;
      rgba[p * 4 + 2] = pb;
      rgba[p * 4 + 3] = 255;
    }
  }

  return rgba;
}

/**
 * Draw a single ACT layer onto the canvas context.
 *
 * frames:    parsed spr frames array ({ indexed, rgba } from parseSpr)
 * layer:     ACT layer object
 * cx, cy:    canvas anchor point
 */
function drawLayer(ctx, sprFrames, layer, cx, cy) {
  const src = layer.spriteType === 1
    ? sprFrames.rgba[layer.frameIndex]
    : sprFrames.indexed[layer.frameIndex];

  if (!src || !src.data || src.width === 0 || src.height === 0) return;

  const { width, height, data } = src;
  const imgData = ctx.createImageData(width, height);
  imgData.data.set(data);
  const tmpCanvas = createCanvas(width, height);
  const tmpCtx    = tmpCanvas.getContext('2d');
  tmpCtx.putImageData(imgData, 0, 0);

  ctx.save();
  ctx.translate(cx + layer.x, cy + layer.y);

  if (layer.isMirror)  ctx.scale(-1, 1);
  if (layer.rotation)  ctx.rotate((layer.rotation * Math.PI) / 180);
  if (layer.scaleX !== 1 || layer.scaleY !== 1) ctx.scale(layer.scaleX, layer.scaleY);

  // Apply colour tint
  if (layer.color.r !== 255 || layer.color.g !== 255 || layer.color.b !== 255) {
    ctx.globalCompositeOperation = 'multiply';
  }

  ctx.drawImage(tmpCanvas, -width / 2, -height / 2);
  ctx.restore();
}

/**
 * Render a character to a PNG Buffer.
 *
 * opts.classId     — RO job class ID
 * opts.sex         — 'M' | 'F'
 * opts.hair        — hair style index (1–30)
 * opts.hairColor   — hair colour index (0–29)
 * opts.action      — ACT action index (default 0 = stand, direction 0)
 * opts.frame       — frame index within the action (default 0)
 */
async function renderCharacter({ classId, sex, hair, hairColor = 0, action = 0, frame = 0 }) {
  // ── Load files from R2 ────────────────────────────────────────────────────
  const [
    bodySpBuf, bodyActBuf,
    headSpBuf, headActBuf,
  ] = await Promise.all([
    fetchFile(bodySpritePath(classId, sex)),
    fetchFile(bodyActPath(classId, sex)),
    fetchFile(headSpritePath(hair, sex)),
    fetchFile(headActPath(hair, sex)),
  ]);

  // ── Parse ────────────────────────────────────────────────────────────────
  const bodyFrames = parseSpr(bodySpBuf);
  const bodyAct    = parseAct(bodyActBuf);
  const headFrames = parseSpr(headSpBuf);
  const headAct    = parseAct(headActBuf);

  // Apply hair colour to indexed head frames
  // parseSpr already converted indexed→RGBA; we need to re-tint.
  // Because parseSpr discards the raw indexed data, we re-parse minimally.
  // For now, reuse the already-decoded RGBA frames (hair tint is approximate).
  // TODO: for perfect hair colour, feed raw indexed + palette into applyHairColor.

  // ── Resolve action and frame ──────────────────────────────────────────────
  const bodyAction = bodyAct.actions[action] ?? bodyAct.actions[0];
  const bodyFrame  = bodyAction?.frames[frame] ?? bodyAction?.frames[0];
  if (!bodyFrame) throw new Error('No body frame found');

  // Head action index mirrors body action index in RO
  const headAction = headAct.actions[action] ?? headAct.actions[0];
  const headFrame  = headAction?.frames[frame] ?? headAction?.frames[0];

  // ── Draw ──────────────────────────────────────────────────────────────────
  const canvas = createCanvas(CANVAS_W, CANVAS_H);
  const ctx    = canvas.getContext('2d');
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Body layers first, then head layers on top
  for (const layer of bodyFrame.layers) {
    drawLayer(ctx, bodyFrames, layer, ANCHOR_X, ANCHOR_Y);
  }

  if (headFrame) {
    // Head anchor: use body frame anchor if available, otherwise default offset
    const headAnchorX = bodyFrame.anchor ? ANCHOR_X + bodyFrame.anchor.x : ANCHOR_X;
    const headAnchorY = bodyFrame.anchor ? ANCHOR_Y + bodyFrame.anchor.y : ANCHOR_Y - 20;
    for (const layer of headFrame.layers) {
      drawLayer(ctx, headFrames, layer, headAnchorX, headAnchorY);
    }
  }

  return canvas.toBuffer('image/png');
}

module.exports = { renderCharacter };
