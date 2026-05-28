/**
 * Express route: GET /api/character-preview
 *
 * Query params:
 *   classId    — RO job class ID (required)
 *   sex        — 'M' or 'F' (required)
 *   hair       — hair style 1-30 (default 1)
 *   hairColor  — hair colour index 0-29 (default 0)
 *   action     — ACT action index (default 0 = stand)
 *   frame      — frame index (default 0)
 *
 * Returns a PNG image.  Responses are cached in memory for 5 minutes.
 *
 * Integration in your Express app:
 *   const charPreviewRoute = require('./character-preview.route');
 *   app.use('/api/character-preview', charPreviewRoute);
 *
 * Required env vars (set in your .env / process manager):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET
 *   (R2_CACHE_DIR is optional, defaults to /tmp/ro-sprite-cache)
 *
 * Required npm packages:
 *   npm install canvas @aws-sdk/client-s3
 */

const express           = require('express');
const { renderCharacter } = require('./char-renderer');

const router = express.Router();

// Simple in-process PNG cache: key → { buf, expires }
const cache    = new Map();
const CACHE_MS = 5 * 60 * 1000; // 5 minutes

function cacheKey(params) {
  return `${params.classId}:${params.sex}:${params.hair}:${params.hairColor}:${params.action}:${params.frame}`;
}

router.get('/', async (req, res) => {
  const classId   = parseInt(req.query.classId,   10);
  const sex       = req.query.sex === 'F' ? 'F' : 'M';
  const hair      = parseInt(req.query.hair,      10) || 1;
  const hairColor = parseInt(req.query.hairColor, 10) || 0;
  const action    = parseInt(req.query.action,    10) || 0;
  const frame     = parseInt(req.query.frame,     10) || 0;

  if (!classId || isNaN(classId)) {
    return res.status(400).json({ error: 'classId is required' });
  }

  const key = cacheKey({ classId, sex, hair, hairColor, action, frame });
  const hit  = cache.get(key);
  if (hit && Date.now() < hit.expires) {
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=300');
    res.set('X-Cache', 'HIT');
    return res.send(hit.buf);
  }

  try {
    const png = await renderCharacter({ classId, sex, hair, hairColor, action, frame });
    cache.set(key, { buf: png, expires: Date.now() + CACHE_MS });
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=300');
    res.set('X-Cache', 'MISS');
    return res.send(png);
  } catch (err) {
    console.error('[char-preview] render error:', err.message);
    // Return a transparent 128×128 PNG placeholder on error so the UI
    // doesn't show a broken image.
    const { createCanvas } = require('canvas');
    const fallback = createCanvas(128, 128).toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    return res.status(200).send(fallback);
  }
});

module.exports = router;
