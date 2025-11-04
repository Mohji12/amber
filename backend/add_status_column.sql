-- SQL script to add status column to products table
-- Run this script on your database to add the status field

-- Add status column to products table
ALTER TABLE products ADD COLUMN status VARCHAR(50) DEFAULT 'In Stock';

-- Update existing products to have 'In Stock' status
UPDATE products SET status = 'In Stock' WHERE status IS NULL;

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'status';
