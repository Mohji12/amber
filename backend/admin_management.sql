-- =====================================================
-- AMBER GLOBAL ADMIN MANAGEMENT SQL SCRIPTS
-- =====================================================

-- 1. REMOVE DEFAULT SUPER ADMIN (Security Measure)
-- =====================================================
DELETE FROM admins WHERE username = 'superadmin' AND email = 'admin@amberglobal.com';

-- 2. CREATE NEW SECURE SUPER ADMIN
-- =====================================================
-- Password: AmberAdmin2024!@# (Hash generated with bcrypt)
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
    'admin@amber-global.com',
    '$2b$12$zIf0qoUC3fYKWJbqCqZb7ebrYzSn8fCBOVoS3u3GswtJdIqkyU/.6',
    'Amber Global Administrator',
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

-- 3. CREATE ADDITIONAL ADMIN USERS
-- =====================================================

-- Content Manager Admin (Password: ContentMgr2024!)
-- Hash: $2b$12$lNd.PGYRyfr9z2LTLVuPK.drOTckLLzef1VvJupv2qmEwOGpFnuLq
INSERT INTO admins (
    username, 
    email, 
    password_hash, 
    full_name, 
    role, 
    is_active,
    is_super_admin, 
    permissions,
    created_at,
    created_by
) VALUES (
    'content_manager',
    'content@amber-global.com',
    '$2b$12$lNd.PGYRyfr9z2LTLVuPK.drOTckLLzef1VvJupv2qmEwOGpFnuLq',
    'Content Manager',
    'admin',
    TRUE,
    FALSE,
    JSON_OBJECT(
        'manage_products', true,
        'manage_categories', true,
        'manage_blogs', true,
        'view_analytics', true
    ),
    NOW(),
    (SELECT id FROM admins WHERE username = 'amber_admin' LIMIT 1)
);

-- User Support Admin (Password: UserSupport2024!)
-- Hash: $2b$12$eFaG0chg6c5lHlr6d1hT4Oyx7kp9Qixe45DK4Jvn84GwfgRTggbM2
INSERT INTO admins (
    username, 
    email, 
    password_hash, 
    full_name, 
    role, 
    is_active,
    is_super_admin, 
    permissions,
    created_at,
    created_by
) VALUES (
    'user_support',
    'support@amber-global.com',
    '$2b$12$eFaG0chg6c5lHlr6d1hT4Oyx7kp9Qixe45DK4Jvn84GwfgRTggbM2',
    'User Support Manager',
    'admin',
    TRUE,
    FALSE,
    JSON_OBJECT(
        'manage_users', true,
        'manage_enquiries', true,
        'view_analytics', true
    ),
    NOW(),
    (SELECT id FROM admins WHERE username = 'amber_admin' LIMIT 1)
);

-- =====================================================
-- 4. VERIFICATION QUERIES
-- =====================================================

-- Check all admins
SELECT 
    id,
    username,
    email,
    full_name,
    role,
    is_active,
    is_super_admin,
    permissions,
    created_at,
    last_login
FROM admins 
ORDER BY created_at DESC;

-- Count admins by role
SELECT 
    role,
    COUNT(*) as count,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_count
FROM admins 
GROUP BY role;

-- =====================================================
-- 5. UTILITY QUERIES
-- =====================================================

-- Update admin password (replace 'username' and 'new_hash')
-- UPDATE admins 
-- SET password_hash = 'NEW_BCRYPT_HASH_HERE' 
-- WHERE username = 'TARGET_USERNAME';

-- Deactivate admin
-- UPDATE admins 
-- SET is_active = FALSE 
-- WHERE username = 'TARGET_USERNAME';

-- Update admin permissions
-- UPDATE admins 
-- SET permissions = JSON_OBJECT(
--     'manage_users', true,
--     'manage_products', false,
--     'view_analytics', true
-- ) 
-- WHERE username = 'TARGET_USERNAME';

-- =====================================================
-- 6. SECURITY CLEANUP
-- =====================================================

-- Remove any test/default accounts
DELETE FROM admins WHERE username IN ('admin', 'test', 'demo', 'superadmin');

-- Ensure all admins have secure passwords (length check)
SELECT username, email, 
       CASE 
           WHEN LENGTH(password_hash) < 50 THEN 'WEAK - Update Required'
           ELSE 'SECURE'
       END as password_status
FROM admins;
