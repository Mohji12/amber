# 🔐 AMBER GLOBAL ADMIN CREDENTIALS

## 🚨 SECURITY NOTICE
**The default weak admin password has been replaced with secure credentials.**

---

## 🔥 SUPER ADMIN (Full Access)
```
Username: amber_admin
Password: AmberAdmin2024!@#
Email: admin@amber-global.com
Role: super_admin
Permissions: ALL
```

## 👤 CONTENT MANAGER (Content Management)
```
Username: content_manager
Password: ContentMgr2024!
Email: content@amber-global.com
Role: admin
Permissions: Products, Categories, Blogs, Analytics
```

## 👤 USER SUPPORT (User Management)
```
Username: user_support
Password: UserSupport2024!
Email: support@amber-global.com
Role: admin
Permissions: Users, Enquiries, Analytics
```

---

## 🚀 HOW TO APPLY CHANGES

### Method 1: Automatic Script (Recommended)
```bash
cd backend
python update_admin_passwords.py
```

### Method 2: Manual SQL Execution
```bash
# Connect to MySQL
mysql -h database-1.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com -P 3306 -u admin -p amberdata1

# Execute the SQL file
source admin_management.sql;

# Verify changes
SELECT username, email, role, is_super_admin FROM admins;
```

### Method 3: Docker Exec
```bash
# Copy SQL file to container
docker cp backend/admin_management.sql amber_db:/tmp/

# Execute in container
mysql -h database-1.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com -P 3306 -u admin -p amberdata1 -e "source admin_management.sql"
```

---

## 🔍 VERIFICATION

### Test Login
```bash
curl -X POST "http://localhost:8000/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "amber_admin",
    "password": "AmberAdmin2024!@#"
  }'
```

### Check Admin List
```bash
# Use token from login response
curl -X GET "http://localhost:8000/admin/list" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚠️ SECURITY REMINDERS

1. **Change Passwords**: Update these passwords after first login
2. **Secure Storage**: Store credentials in password manager
3. **Environment Variables**: Use `.env` for production passwords
4. **Regular Rotation**: Change passwords every 90 days
5. **Access Monitoring**: Review admin activity logs regularly

---

## 🗑️ OLD CREDENTIALS REMOVED

The following insecure default credentials have been **DELETED**:
- ❌ Username: `superadmin`
- ❌ Password: `admin123456`
- ❌ Email: `admin@amberglobal.com`

---

## 📞 LOGIN ENDPOINTS

- **Admin Login**: `POST /admin/login`
- **Dashboard**: `GET /admin/dashboard/stats`
- **API Documentation**: http://localhost:8000/docs

---

## 🛡️ PASSWORD POLICY

All new passwords follow security best practices:
- ✅ Minimum 12 characters
- ✅ Mixed case letters
- ✅ Numbers and special characters
- ✅ Bcrypt hashing with salt
- ✅ No dictionary words
- ✅ Unique per account
