# xro-server character preview module

Drop these files into your `xro-server` repo and wire up the route.
Requires Node ≥ 18 and the packages listed below.

## Files

| File | Purpose |
|---|---|
| `job-paths.js` | Maps RO class IDs to Korean sprite filenames; builds R2 object keys |
| `spr-parser.js` | Decodes `.spr` files (v0x100–v0x202) → RGBA pixel buffers |
| `act-parser.js` | Decodes `.act` files → actions / frames / layers |
| `r2-client.js` | S3-compatible Cloudflare R2 downloader with disk cache |
| `char-renderer.js` | node-canvas compositor: body + head → PNG Buffer |
| `character-preview.route.js` | Express router, mounts at `/api/character-preview` |

## Install dependencies

```bash
npm install canvas @aws-sdk/client-s3
```

`canvas` requires system libraries. On Debian/Ubuntu:

```bash
apt-get install -y build-essential libcairo2-dev libpango1.0-dev \
  libjpeg-dev libgif-dev librsvg2-dev
```

## Environment variables

```
R2_ACCOUNT_ID=<Cloudflare account ID>
R2_ACCESS_KEY=<R2 access key ID>
R2_SECRET_KEY=<R2 secret access key>
R2_BUCKET=ro-client-files        # your bucket name
R2_CACHE_DIR=/tmp/ro-sprite-cache  # optional
```

## Wire up in Express

```js
const charPreviewRoute = require('./character-preview.route');
app.use('/api/character-preview', charPreviewRoute);
```

## Endpoint

```
GET /api/character-preview?classId=4054&sex=M&hair=5&hairColor=9
```

| Param | Required | Default | Description |
|---|---|---|---|
| `classId` | ✓ | — | RO job class ID |
| `sex` | ✓ | `M` | `M` or `F` |
| `hair` | | `1` | Hair style 1–30 |
| `hairColor` | | `0` | Hair colour 0–29 |
| `action` | | `0` | ACT action index (0 = stand) |
| `frame` | | `0` | Frame within the action |

Returns a 128×128 `image/png` with transparent background.
Responses are cached in-process for 5 minutes and the raw R2 files are
cached to `R2_CACHE_DIR` so repeated renders are fast.

## Using from xro-landing

In `.env.local` add:

```
NEXT_PUBLIC_CHAR_PREVIEW_URL=https://yinx-ragnarok.duckdns.org
```

Then build sprite URLs in your frontend:

```ts
function charPreviewUrl(classId: number, sex: string, hair: number, hairColor: number) {
  const base = process.env.NEXT_PUBLIC_CHAR_PREVIEW_URL;
  if (!base) return null;
  return `${base}/api/character-preview?classId=${classId}&sex=${sex}&hair=${hair}&hairColor=${hairColor}`;
}
```
