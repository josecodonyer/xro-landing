"""
Extrae stats y scripts de item_db.yml / item_db2.yml de rAthena.
Genera public/item_detail.json.

Uso:
    python3 scripts/gen_item_detail.py > public/item_detail.json
    python3 scripts/gen_item_detail.py         (escribe al fichero directamente)
"""
import yaml, json, sys
from pathlib import Path

RATHENA  = Path("/home/rathena/rathena")
DB_RE    = RATHENA / "db/re"
DB_GLOB  = RATHENA / "db"
OUT_PATH = Path(__file__).parent.parent / "public" / "item_detail.json"

# ── Mapeo de LocationMask / Locations keys → etiquetas legibles ──────────────
LOCATION_MAP = {
    "HeadTop":              "Cabeza superior",
    "HeadMid":              "Cabeza media",
    "HeadLow":              "Cabeza inferior",
    "Armor":                "Armadura",
    "RightHand":            "Mano derecha",
    "LeftHand":             "Mano izquierda / Escudo",
    "Garment":              "Capa",
    "Shoes":                "Calzado",
    "RightAccessory":       "Accesorio derecho",
    "LeftAccessory":        "Accesorio izquierdo",
    "CostumeHeadTop":       "Disfraz cabeza sup.",
    "CostumeHeadMid":       "Disfraz cabeza med.",
    "CostumeHeadLow":       "Disfraz cabeza inf.",
    "CostumeGarment":       "Disfraz capa",
    "ShadowArmor":          "Shadow armadura",
    "ShadowWeapon":         "Shadow arma",
    "ShadowShield":         "Shadow escudo",
    "ShadowShoes":          "Shadow calzado",
    "ShadowRightAccessory": "Shadow acc. derecho",
    "ShadowLeftAccessory":  "Shadow acc. izquierdo",
    "BothHands":            "Ambas manos",
    "Both":                 "Ambos accesorios",
}


def parse_item_db(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        data = yaml.safe_load(f)

    result = {}
    for item in data.get("Body", []):
        iid = item.get("Id")
        if not iid:
            continue

        # Jobs → dict of {JobName: True}
        jobs = {}
        raw_jobs = item.get("Jobs") or {}
        if isinstance(raw_jobs, dict):
            jobs = {k: bool(v) for k, v in raw_jobs.items() if v}

        # Locations → dict of {LocationKey: True}
        location = {}
        raw_loc = item.get("Locations") or {}
        if isinstance(raw_loc, dict):
            location = {k: bool(v) for k, v in raw_loc.items() if v}

        script    = (item.get("Script")    or "").strip()
        equip_script = (item.get("EquipScript") or "").strip()
        unequip_script = (item.get("UnEquipScript") or "").strip()

        result[str(iid)] = {
            "atk":       int(item.get("Atk",  0) or 0),
            "matk":      int(item.get("Matk", 0) or 0),
            "def":       int(item.get("Def",  0) or 0),
            "slots":     int(item.get("Slots", 0) or 0),
            "reqLv":     int(item.get("EquipLevelMin", 0) or 0),
            "weaponLv":  int(item.get("WeaponLevel",   0) or 0),
            "refineable": bool(item.get("Refineable", False)),
            "gradeable":  bool(item.get("Gradable",   False)),
            "jobs":      jobs,
            "location":  location,
            "script":    script,
            "equipScript":   equip_script,
            "unequipScript": unequip_script,
        }

    return result


def main():
    items: dict = {}

    # Re: Renewal databases (primary)
    for fname in ["item_db.yml", "item_db2.yml"]:
        p = DB_RE / fname
        if p.exists():
            print(f"  Loading {p} …", file=sys.stderr)
            chunk = parse_item_db(p)
            items.update(chunk)
            print(f"    {len(chunk)} items", file=sys.stderr)
        else:
            print(f"  Skipping {p} (not found)", file=sys.stderr)

    # Pre-re database (some servers keep extra items there)
    for fname in ["item_db.yml", "item_db2.yml"]:
        p = DB_GLOB / fname
        if p.exists():
            print(f"  Loading {p} …", file=sys.stderr)
            chunk = parse_item_db(p)
            # Don't overwrite Re entries
            for k, v in chunk.items():
                if k not in items:
                    items[k] = v
            print(f"    {len(chunk)} items (extras)", file=sys.stderr)

    # Write output
    output = json.dumps(items, ensure_ascii=False, separators=(",", ":"))
    if len(sys.argv) > 1 and sys.argv[1] == "--stdout":
        print(output)
    else:
        OUT_PATH.write_text(output, encoding="utf-8")
        print(f"\nEscrito: {OUT_PATH}  ({len(items)} items)", file=sys.stderr)


if __name__ == "__main__":
    main()
