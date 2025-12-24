-- SQL script to add `about_you` column to enquiries table
-- Run this against your existing Amber database once.

-- 1) Add the new column (optional, nullable)
ALTER TABLE enquiries
  ADD COLUMN about_you VARCHAR(50) NULL AFTER destination_country;

-- 2) (Optional) verify that the column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'enquiries'
  AND column_name = 'about_you';


