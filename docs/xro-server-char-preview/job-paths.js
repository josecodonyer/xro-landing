// Mapping of RO job class ID -> sprite filename stem (without sex suffix)
// File structure assumed: data/sprite/인간족/body/{sex_prefix}{stem}_{sex_suffix}.spr
// For Doram classes: data/sprite/도람족/body/{sex_prefix}{stem}_{sex_suffix}.spr

const JOBS = {
  // ── Base / 1st ──────────────────────────────────────────────────────────────
  0:    { stem: '초보자',         race: '인간족' },
  1:    { stem: '검사',           race: '인간족' },
  2:    { stem: '마법사',         race: '인간족' },
  3:    { stem: '궁수',           race: '인간족' },
  4:    { stem: '성직자',         race: '인간족' },
  5:    { stem: '상인',           race: '인간족' },
  6:    { stem: '도적',           race: '인간족' },
  // ── 2nd ─────────────────────────────────────────────────────────────────────
  7:    { stem: '기사',           race: '인간족' },
  8:    { stem: '신관',           race: '인간족' },
  9:    { stem: '위자드',         race: '인간족' },
  10:   { stem: '대장장이',       race: '인간족' },
  11:   { stem: '헌터',           race: '인간족' },
  12:   { stem: '어쎄신',         race: '인간족' },
  14:   { stem: '크루세이더',     race: '인간족' },
  15:   { stem: '몽크',           race: '인간족' },
  16:   { stem: '세이지',         race: '인간족' },
  17:   { stem: '로그',           race: '인간족' },
  18:   { stem: '알케미스트',     race: '인간족' },
  19:   { stem: '바드',           race: '인간족' },
  20:   { stem: '무희',           race: '인간족' },
  23:   { stem: '슈퍼노비스',     race: '인간족' },
  24:   { stem: '건슬링거',       race: '인간족' },
  25:   { stem: '닌자',           race: '인간족' },
  // ── Transcendent ────────────────────────────────────────────────────────────
  4001: { stem: '초보자',         race: '인간족' },
  4002: { stem: '검사',           race: '인간족' },
  4003: { stem: '마법사',         race: '인간족' },
  4004: { stem: '궁수',           race: '인간족' },
  4005: { stem: '성직자',         race: '인간족' },
  4006: { stem: '상인',           race: '인간족' },
  4007: { stem: '도적',           race: '인간족' },
  4008: { stem: '로드나이트',     race: '인간족' },
  4009: { stem: '하이프리스트',   race: '인간족' },
  4010: { stem: '하이위자드',     race: '인간족' },
  4011: { stem: '화이트스미스',   race: '인간족' },
  4012: { stem: '스나이퍼',       race: '인간족' },
  4013: { stem: '어쎄신크로스',   race: '인간족' },
  4015: { stem: '팔라딘',         race: '인간족' },
  4016: { stem: '챔피온',         race: '인간족' },
  4017: { stem: '프로페서',       race: '인간족' },
  4018: { stem: '스토커',         race: '인간족' },
  4019: { stem: '크리에이터',     race: '인간족' },
  4020: { stem: '클라운',         race: '인간족' },
  4021: { stem: '집시',           race: '인간족' },
  // ── 3rd ─────────────────────────────────────────────────────────────────────
  4054: { stem: '런나이트',       race: '인간족' },
  4055: { stem: '워록',           race: '인간족' },
  4056: { stem: '레인저',         race: '인간족' },
  4057: { stem: '아크비숍',       race: '인간족' },
  4058: { stem: '미케닉',         race: '인간족' },
  4059: { stem: '길로틴크로스',   race: '인간족' },
  4060: { stem: '런나이트',       race: '인간족' },  // female rune knight
  4061: { stem: '워록',           race: '인간족' },
  4062: { stem: '레인저',         race: '인간족' },
  4063: { stem: '아크비숍',       race: '인간족' },
  4064: { stem: '미케닉',         race: '인간족' },
  4065: { stem: '길로틴크로스',   race: '인간족' },
  4066: { stem: '로얄가드',       race: '인간족' },
  4067: { stem: '소서러',         race: '인간족' },
  4068: { stem: '민스트럴',       race: '인간족' },
  4069: { stem: '완더러',         race: '인간족' },
  4070: { stem: '수라',           race: '인간족' },
  4071: { stem: '제네틱',         race: '인간족' },
  4072: { stem: '쉐도우체이서',   race: '인간족' },
  4073: { stem: '로얄가드',       race: '인간족' },
  4074: { stem: '소서러',         race: '인간족' },
  4075: { stem: '민스트럴',       race: '인간족' },
  4076: { stem: '완더러',         race: '인간족' },
  4077: { stem: '수라',           race: '인간족' },
  4078: { stem: '제네틱',         race: '인간족' },
  4079: { stem: '쉐도우체이서',   race: '인간족' },
  // ── 4th ─────────────────────────────────────────────────────────────────────
  4252: { stem: '드래곤나이트',   race: '인간족' },
  4253: { stem: '마이스터',       race: '인간족' },
  4254: { stem: '쉐도우크로스',   race: '인간족' },
  4255: { stem: '아크메이지',     race: '인간족' },
  4256: { stem: '카디날',         race: '인간족' },
  4257: { stem: '윈드호크',       race: '인간족' },
  4258: { stem: '임페리얼가드',   race: '인간족' },
  4259: { stem: '바이올로',       race: '인간족' },
  4260: { stem: '어비스체이서',   race: '인간족' },
  4261: { stem: '엘리멘탈마스터', race: '인간족' },
  4262: { stem: '인퀴지터',       race: '인간족' },
  4263: { stem: '트루바두르',     race: '인간족' },
  4264: { stem: '트루베르',       race: '인간족' },
};

/**
 * Returns the R2 object key for a character body sprite.
 * sex: 'M' | 'F'
 */
function bodySpritePath(classId, sex) {
  const job = JOBS[classId] ?? JOBS[0];
  const sexPrefix = sex === 'F' ? '여자' : '남자';
  const sexSuffix = sex === 'F' ? '_여' : '_남';
  return `data/sprite/${job.race}/body/${sexPrefix}${job.stem}${sexSuffix}.spr`;
}

function bodyActPath(classId, sex) {
  return bodySpritePath(classId, sex).replace(/\.spr$/, '.act');
}

/**
 * Returns the R2 object key for a head/hair sprite.
 * hairId: 1-30
 */
function headSpritePath(hairId, sex) {
  const sexPrefix = sex === 'F' ? '여자' : '남자';
  const sexSuffix = sex === 'F' ? '_여' : '_남';
  return `data/sprite/인간족/head/${sexPrefix}머리${hairId}${sexSuffix}.spr`;
}

function headActPath(hairId, sex) {
  return headSpritePath(hairId, sex).replace(/\.spr$/, '.act');
}

module.exports = { bodySpritePath, bodyActPath, headSpritePath, headActPath };
