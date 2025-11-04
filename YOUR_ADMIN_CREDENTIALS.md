# 🔐 YOUR AMBER GLOBAL SUPER ADMIN

## ✅ **SECURE SUPER ADMIN CREDENTIALS**

```
Username: amber_admin
Password: Amberglobal@2424
Email: amberglobaltrade1@gmail.com
Role: super_admin (Full Access)
```

---

## 🚀 **HOW TO APPLY (Choose One Method):**

### **Method 1: Automatic with Docker (Recommended)**
```bash
# Navigate to project root
cd C:\Amber(Client)\import-main

# Restart containers to apply new admin
docker-compose down
docker-compose up -d

# Your admin will be created automatically!
```

### **Method 2: Manual SQL Execution**
```sql
-- Connect to your MySQL database and run:

-- Remove any old default admins
DELETE FROM admins WHERE username = 'superadmin';

-- Add your secure super admin
INSERT INTO admins (
    username, email, password_hash, full_name, role, 
    is_active, is_super_admin, permissions, created_at
) VALUES (
    'amber_admin',
    'amberglobaltrade1@gmail.com',
    '$2b$12$IPZdVCOPR3l08UIsHVl2c.1WL/Fv1IMWrYpluWMoKNI3JvWaBtdNi',
    'Amber Global Super Administrator',
    'super_admin',
    TRUE,
    TRUE,
    JSON_OBJECT(
        'manage_users', true, 'manage_admins', true, 
        'manage_products', true, 'manage_categories', true,
        'manage_blogs', true, 'manage_enquiries', true,
        'view_analytics', true, 'system_admin', true
    ),
    NOW()
);
```

### **Method 3: Use the Simple SQL Script**
```bash
# Execute the simple setup script
mysql -h amber-database.cbeyuko6yxme.ap-south-1.rds.amazonaws.com -P 3306 -u admin -p amberdata1 < simple_admin_setup.sql
```

---

## 🔍 **TEST YOUR LOGIN:**

```bash
curl -X POST "http://localhost:8000/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "amber_admin",
    "password": "Amberglobal@2424"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "admin_id": 1,
  "username": "amber_admin",
  "role": "super_admin",
  "permissions": {...}
}
```

---

## 📊 **ADMIN ENDPOINTS YOU CAN ACCESS:**

- **Login**: `POST /admin/login`
- **Dashboard Stats**: `GET /admin/dashboard/stats` 
- **User Management**: `GET /admin/users/list`
- **Enquiry Management**: `GET /admin/enquiries/list`
- **Create New Admins**: `POST /admin/create`
- **View All Admins**: `GET /admin/list`

**Full API Documentation**: http://localhost:8000/docs

---

## 🛡️ **SECURITY FEATURES:**

✅ **Secure Password**: `Amberglobal@2424` (14 characters, mixed case, numbers, symbols)
✅ **Bcrypt Hashing**: Password stored as secure hash, never plain text
✅ **Recovery Email**: `amberglobaltrade1@gmail.com` for account recovery
✅ **Full Permissions**: Complete system access as super admin
✅ **JWT Tokens**: 8-hour secure session tokens
✅ **Activity Logging**: All admin actions are tracked

---

## ⚡ **QUICK START:**

1. **Start Docker**: `docker-compose up -d`
2. **Login**: Use credentials above at `/admin/login`
3. **Access Dashboard**: Visit http://localhost:8000/docs
4. **Manage System**: Full access to all admin features

**Your admin system is ready to go!** 🎉
