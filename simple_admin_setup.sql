-- =====================================================
-- AMBER GLOBAL SUPER ADMIN SETUP
-- =====================================================

-- 1. REMOVE ANY EXISTING DEFAULT/TEST ADMINS
-- =====================================================
DELETE FROM admins WHERE username IN ('superadmin', 'admin', 'test', 'demo');
DELETE FROM admins WHERE email LIKE '%amberglobal.com%';

-- 2. CREATE YOUR SECURE SUPER ADMIN
-- =====================================================
-- Username: amber_admin
-- Password: Amberglobal@2424
-- Email: amberglobaltrade1@gmail.com
-- Hash: $2b$12$IPZdVCOPR3l08UIsHVl2c.1WL/Fv1IMWrYpluWMoKNI3JvWaBtdNi

INSERT INTO admins (
    username, 
    email, 
    password_hash, 
    full_name, 
    role, 
    is_active,
    is_super_admin, 
    permissions,
    created_at
) VALUES (
    'amber_admin',
    'amberglobaltrade1@gmail.com',
    '$2b$12$IPZdVCOPR3l08UIsHVl2c.1WL/Fv1IMWrYpluWMoKNI3JvWaBtdNi',
    'Amber Global Super Administrator',
    'super_admin',
    TRUE,
    TRUE,
    JSON_OBJECT(
        'manage_users', true,
        'manage_admins', true,
        'manage_products', true,
        'manage_categories', true,
        'manage_blogs', true,
        'manage_enquiries', true,
        'view_analytics', true,
        'system_admin', true
    ),
    NOW()
);

-- 3. VERIFY THE SETUP
-- =====================================================
SELECT 
    id,
    username,
    email,
    full_name,
    role,
    is_active,
    is_super_admin,
    created_at
FROM admins 
ORDER BY created_at DESC;

-- Show admin count
SELECT 
    COUNT(*) as total_admins,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_admins,
    COUNT(CASE WHEN is_super_admin = TRUE THEN 1 END) as super_admins
FROM admins;
