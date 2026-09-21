"""Update subcategory image_url from objects already in S3 Amber/ prefix."""
from __future__ import annotations

import json
import os
import re
from pathlib import Path
from urllib.parse import quote

import boto3
import pymysql
from dotenv import load_dotenv

load_dotenv()

BUCKET = "caruk2026"
REGION = "us-east-1"
PREFIX = "Amber/"


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = text.replace("&", " and ")
    text = re.sub(r"[/\\|_+\-]+", " ", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def main():
    s3 = boto3.client(
        "s3",
        region_name=REGION,
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    keys = []
    token = None
    while True:
        kwargs = {"Bucket": BUCKET, "Prefix": PREFIX}
        if token:
            kwargs["ContinuationToken"] = token
        resp = s3.list_objects_v2(**kwargs)
        for obj in resp.get("Contents") or []:
            key = obj["Key"]
            if key.endswith("/") or key.endswith("test-upload.txt"):
                continue
            keys.append(key)
        if not resp.get("IsTruncated"):
            break
        token = resp.get("NextContinuationToken")

    # Map normalized product filename -> url
    name_to_url = {}
    uploads = []
    for key in keys:
        filename = key.split("/")[-1]
        stem = Path(filename).stem  # may have - instead of /
        # Restore slash form used in DB millet names
        candidate_names = [stem, stem.replace(" - ", " / ")]
        url = f"https://{BUCKET}.s3.amazonaws.com/{quote(key, safe='/')}"
        for cand in candidate_names:
            name_to_url[normalize(cand)] = url
        uploads.append({"key": key, "url": url, "stem": stem})

    map_rows = json.loads(
        Path(__file__).with_name("subcategory_category_map.json").read_text(encoding="utf-8")
    )

    conn = pymysql.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        connect_timeout=20,
        autocommit=False,
    )
    cur = conn.cursor()
    updated = 0
    missing = []
    for row in map_rows:
        n = normalize(row["subcategory"])
        url = name_to_url.get(n)
        if not url:
            # try loose match
            for nk, u in name_to_url.items():
                if n in nk or nk in n:
                    url = u
                    break
        if not url:
            missing.append(row["subcategory"])
            continue
        cur.execute(
            "UPDATE subcategories SET image_url=%s WHERE id=%s",
            (url, row["id"]),
        )
        updated += cur.rowcount

    conn.commit()
    conn.close()

    report = {
        "s3_objects": len(keys),
        "db_rows_updated": updated,
        "missing_in_s3": missing,
    }
    Path(__file__).with_name("s3_upload_report.json").write_text(
        json.dumps({"report": report, "uploads": uploads}, indent=2),
        encoding="utf-8",
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
