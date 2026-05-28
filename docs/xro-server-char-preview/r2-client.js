/**
 * Cloudflare R2 file fetcher with disk cache.
 *
 * R2 uses the S3-compatible API. Configure via env vars:
 *   R2_ACCOUNT_ID   — Cloudflare account ID
 *   R2_ACCESS_KEY   — R2 access key ID
 *   R2_SECRET_KEY   — R2 secret access key
 *   R2_BUCKET       — bucket name (e.g. "ro-client-files")
 *   R2_CACHE_DIR    — local directory for cached files (default: /tmp/ro-sprite-cache)
 *
 * Object keys match the paths returned by job-paths.js, e.g.:
 *   data/sprite/인간족/body/남자검사_남.spr
 */

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs   = require('fs');
const path = require('path');

let s3 = null;
let bucket = null;
let cacheDir = null;

function init() {
  if (s3) return;

  const accountId = process.env.R2_ACCOUNT_ID;
  if (!accountId) throw new Error('R2_ACCOUNT_ID env var not set');

  bucket   = process.env.R2_BUCKET ?? 'ro-client-files';
  cacheDir = process.env.R2_CACHE_DIR ?? '/tmp/ro-sprite-cache';

  s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY ?? '',
      secretAccessKey: process.env.R2_SECRET_KEY ?? '',
    },
  });

  fs.mkdirSync(cacheDir, { recursive: true });
}

/**
 * Returns a Buffer with the contents of the given R2 object key.
 * Caches to disk so repeated renders skip the network round-trip.
 */
async function fetchFile(key) {
  init();

  // Sanitise the key for use as a filesystem path
  const cachePath = path.join(cacheDir, key.replace(/[/\\]/g, '_'));

  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath);
  }

  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const res = await s3.send(cmd);

  // Collect stream
  const chunks = [];
  for await (const chunk of res.Body) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const buf = Buffer.concat(chunks);

  fs.writeFileSync(cachePath, buf);
  return buf;
}

module.exports = { fetchFile };
