"""
Upload local product images to S3 under Amber/<Category>/<Product>.<ext>
and update subcategory image_url in the database.
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path

import boto3
import pymysql
from dotenv import load_dotenv
from botocore.exceptions import ClientError

load_dotenv()

IMAGES_DIR = Path(r"D:\amber-main\amber-main\images")
BUCKET = os.getenv("S3_BUCKET", "caruk2026")
REGION = os.getenv("AWS_REGION", "us-east-1")
PREFIX = os.getenv("S3_PREFIX", "Amber")

# Local filename stem -> DB subcategory name (for typos / naming differences)
FILENAME_ALIASES = {
    "belt": "Belts",
    "black paper": "Black Pepper",
    "cardamon": "Cardamom",
    "coco-fibre": "Coir Mats",
    "chana dal": "Chana Dal",
    "chickpeas": "Chickpeas",
    "door handles": "Door Handles",
    "green gram": "Green Gram",
    "hinge": "Hinges",
    "jute carpet": "Jute Carpets",
    "lobia": "Lobia",
    "olive oil": "Olive Oil",
    "papaya": "Papaya",
    "pipes": "Pipes",
    "rope": "Ropes",
    "wallet": "Wallets",
    "finger millet (ragi  nachni)": "Finger Millet (Ragi / Nachni)",
    "foxtail millet (kangni  thinai)": "Foxtail Millet (Kangni / Thinai)",
    "kodo millet (kodra  arikelu)": "Kodo Millet (Kodra / Arikelu)",
    "little millet (kutki  sama)": "Little Millet (Kutki / Sama)",
    "pearl millet (bajra  sajje)": "Pearl Millet (Bajra / Sajje)",
    "barnyard millet (sanwa / kuthiraivali)": "Barnyard Millet (Sanwa / Kuthiraivali)",
    "browntop millet (korale / andu korralu)": "Browntop Millet (Korale / Andu Korralu)",
}


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = text.replace("&", " and ")
    text = re.sub(r"[/\\|_+\-]+", " ", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def safe_key_part(name: str) -> str:
    # Keep readable names; encode spaces as + for URL friendliness like existing Amber paths
    return name.strip().replace("/", "-")


def build_name_index(rows: list[dict]) -> dict[str, dict]:
    index = {}
    for row in rows:
        index[normalize(row["subcategory"])] = row
    return index


def resolve_row(stem: str, index: dict[str, dict]) -> dict | None:
    key = normalize(stem)
    if key in FILENAME_ALIASES:
        alias = FILENAME_ALIASES[key]
        return index.get(normalize(alias))
    if key in index:
        return index[key]

    # Fuzzy: exact containment
    for nk, row in index.items():
        if key == nk or key in nk or nk in key:
            return row
    return None


def main():
    map_path = Path(__file__).with_name("subcategory_category_map.json")
    rows = json.loads(map_path.read_text(encoding="utf-8"))
    index = build_name_index(rows)

    access_key = os.environ.get("AWS_ACCESS_KEY_ID")
    secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
    if not access_key or not secret_key:
        raise SystemExit("AWS credentials missing in environment")

    s3 = boto3.client(
        "s3",
        region_name=REGION,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
    )

    # Ensure bucket reachable
    try:
        s3.head_bucket(Bucket=BUCKET)
    except ClientError as e:
        raise SystemExit(f"Cannot access bucket {BUCKET}: {e}")

    # Create category "folders" (zero-byte markers) + upload images
    categories = sorted({r["category"] for r in rows if r.get("category")})
    for cat in categories:
        key = f"{PREFIX}/{safe_key_part(cat)}/"
        s3.put_object(Bucket=BUCKET, Key=key, Body=b"")
        print(f"folder  s3://{BUCKET}/{key}")

    files = sorted(
        [
            p
            for p in IMAGES_DIR.iterdir()
            if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif"}
        ]
    )
    print(f"local images: {len(files)}")

    uploads = []
    unmatched = []

    for path in files:
        row = resolve_row(path.stem, index)
        if not row or not row.get("category"):
            unmatched.append(path.name)
            print(f"UNMATCHED  {path.name}")
            continue

        category = row["category"]
        product = row["subcategory"]
        # Prefer canonical product filename
        filename = f"{safe_key_part(product)}{path.suffix.lower()}"
        key = f"{PREFIX}/{safe_key_part(category)}/{filename}"

        content_type = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
            ".gif": "image/gif",
        }.get(path.suffix.lower(), "application/octet-stream")

        # Bucket has ACLs disabled (Object Ownership); upload without ACL
        s3.upload_file(
            str(path),
            BUCKET,
            key,
            ExtraArgs={"ContentType": content_type},
        )

        # Virtual-hosted–style URL
        if REGION == "us-east-1":
            url = f"https://{BUCKET}.s3.amazonaws.com/{urllib_quote(key)}"
        else:
            url = f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{urllib_quote(key)}"

        uploads.append(
            {
                "id": row["id"],
                "name": product,
                "category": category,
                "local": path.name,
                "key": key,
                "url": url,
            }
        )
        print(f"uploaded {path.name} -> s3://{BUCKET}/{key}")

    # Update DB image URLs for matched rows (all IDs with that product name)
    conn = pymysql.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        autocommit=False,
    )
    cur = conn.cursor()
    updated = 0
    for item in uploads:
        cur.execute(
            "UPDATE subcategories SET image_url=%s WHERE name=%s",
            (item["url"], item["name"]),
        )
        updated += cur.rowcount
    conn.commit()
    conn.close()

    report = {
        "uploaded": len(uploads),
        "db_rows_updated": updated,
        "unmatched": unmatched,
        "bucket": BUCKET,
        "prefix": PREFIX,
    }
    out = Path(__file__).with_name("s3_upload_report.json")
    out.write_text(json.dumps({"report": report, "uploads": uploads}, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    print(f"report: {out}")


def urllib_quote(key: str) -> str:
    from urllib.parse import quote

    return quote(key, safe="/")


if __name__ == "__main__":
    main()
