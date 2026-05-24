import yaml, json, sys
from pathlib import Path

RATHENA = Path("/home/rathena/rathena")
DB_RE   = RATHENA / "db/re"

# ── 1. Elemental table ──────────────────────────────────────────────────────
def load_attr_fix():
    with open(DB_RE / "attr_fix.yml") as f:
        data = yaml.safe_load(f)
    # result[level][attacker][defender] = pct
    result = {}
    for entry in data.get("Body", []):
        lv = entry["Level"]
        result[lv] = {}
        for attacker, defenders in entry.items():
            if attacker == "Level":
                continue
            result[lv][attacker] = defenders
    return result

# ── 2. Full mob_db ──────────────────────────────────────────────────────────
def load_mob_db():
    with open(DB_RE / "mob_db.yml") as f:
        data = yaml.safe_load(f)
    mobs = {}
    for mob in data.get("Body", []):
        iid = mob.get("Id")
        if not iid:
            continue
        # Modes
        modes = list(mob.get("Modes", {}).keys()) if isinstance(mob.get("Modes"), dict) else []
        mobs[str(iid)] = {
            "id":             iid,
            "aegis":          mob.get("AegisName", ""),
            "name":           mob.get("Name", ""),
            "level":          mob.get("Level", 1),
            "hp":             mob.get("Hp", 0),
            "baseExp":        mob.get("BaseExp", 0),
            "jobExp":         mob.get("JobExp", 0),
            "attack":         mob.get("Attack", 0),
            "attack2":        mob.get("Attack2", 0),
            "defense":        mob.get("Defense", 0),
            "magicDefense":   mob.get("MagicDefense", 0),
            "str":            mob.get("Str", 0),
            "agi":            mob.get("Agi", 0),
            "vit":            mob.get("Vit", 0),
            "int":            mob.get("Int", 0),
            "dex":            mob.get("Dex", 0),
            "luk":            mob.get("Luk", 0),
            "attackRange":    mob.get("AttackRange", 1),
            "size":           mob.get("Size", ""),
            "race":           mob.get("Race", ""),
            "element":        mob.get("Element", ""),
            "elementLevel":   mob.get("ElementLevel", 1),
            "walkSpeed":      mob.get("WalkSpeed", 150),
            "attackDelay":    mob.get("AttackDelay", 1000),
            "modes":          modes,
        }
    return mobs

print("Loading attr_fix...", file=sys.stderr)
attr_fix = load_attr_fix()
print(f"  {len(attr_fix)} levels", file=sys.stderr)

print("Loading mob_db...", file=sys.stderr)
mob_db = load_mob_db()
print(f"  {len(mob_db)} mobs", file=sys.stderr)

print(json.dumps({"attr_fix": attr_fix, "mobs": mob_db}, ensure_ascii=False))
