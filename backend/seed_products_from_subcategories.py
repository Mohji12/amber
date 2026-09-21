"""
Create one product per subcategory so category/subcategory pages show products.
Maps each product to its category_id + subcategory_id and copies image/description.
"""
from __future__ import annotations

import os
from datetime import datetime

import pymysql
from dotenv import load_dotenv

load_dotenv()


def main():
    conn = pymysql.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        connect_timeout=20,
        autocommit=False,
        cursorclass=pymysql.cursors.DictCursor,
    )
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) AS n FROM products")
    before = cur.fetchone()["n"]
    print("products_before", before)

    cur.execute(
        """
        SELECT s.id, s.name, s.description, s.image_url, s.category_id, c.name AS category_name
        FROM subcategories s
        LEFT JOIN categories c ON c.id = s.category_id
        ORDER BY s.id
        """
    )
    subs = cur.fetchall()
    print("subcategories", len(subs))

    created = 0
    skipped = 0
    now = datetime.utcnow()

    for s in subs:
        # Skip if a product with same name already exists for this subcategory
        cur.execute(
            """
            SELECT id FROM products
            WHERE subcategory_id = %s AND name = %s
            LIMIT 1
            """,
            (s["id"], s["name"]),
        )
        if cur.fetchone():
            skipped += 1
            continue

        details = s.get("description") or f"Premium quality {s['name']} for export."
        if s.get("category_name"):
            details = f"{details} Category: {s['category_name']}."

        cur.execute(
            """
            INSERT INTO products (
              name, grade, moq, origin, image_url, certifications, details,
              additional_info, created_at, specs, highlights, private_label_options,
              use_cases, status, is_featured, category_id, subcategory_id
            ) VALUES (
              %s, %s, %s, %s, %s, %s, %s,
              %s, %s, %s, %s, %s,
              %s, %s, %s, %s, %s
            )
            """,
            (
                s["name"],
                "Export Grade",
                "As per requirement",
                "India",
                s.get("image_url"),
                "APEDA, FSSAI",
                details,
                None,
                now,
                None,
                f"High-quality {s['name']} sourced for global markets.",
                "Custom branding and packaging available on request.",
                "Wholesale, retail, and private label supply.",
                "In Stock",
                0,
                s.get("category_id"),
                s["id"],
            ),
        )
        created += 1

    conn.commit()

    cur.execute("SELECT COUNT(*) AS n FROM products")
    after = cur.fetchone()["n"]

    # Verify Industrial Shoes
    cur.execute(
        """
        SELECT p.id, p.name, p.category_id, p.subcategory_id, LEFT(p.image_url, 80) AS img
        FROM products p
        JOIN subcategories s ON s.id = p.subcategory_id
        WHERE s.name = 'Industrial Shoes'
        """
    )
    sample = cur.fetchall()

    # Counts by category
    cur.execute(
        """
        SELECT c.name AS category, COUNT(p.id) AS product_count
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        GROUP BY c.name
        ORDER BY c.name
        """
    )
    by_cat = cur.fetchall()

    print(
        {
            "created": created,
            "skipped": skipped,
            "products_after": after,
            "industrial_shoes": sample,
            "by_category": by_cat,
        }
    )
    conn.close()


if __name__ == "__main__":
    main()
