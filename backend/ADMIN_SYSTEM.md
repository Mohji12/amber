# Admin System Documentation

## Overview

The Amber Global Admin System provides comprehensive administrative capabilities for managing users, products, enquiries, and system operations. It features role-based access control, secure authentication, and detailed activity logging.

## Features

### 🔐 Authentication & Security
- JWT-based authentication with 8-hour token expiration
- Secure password hashing using bcrypt
- Role-based access control (RBAC)
- Permission-based endpoint protection
- Activity logging for all admin actions

### 👥 User Management
- View and manage all registered users
- Update user verification status
- Monitor user activities
- User statistics and analytics

### 📦 Content Management
- Product management with CRUD operations
- Category and subcategory management
- Blog post management
- Enquiry management and status updates

### 📊 Dashboard & Analytics
- Real-time system statistics
- Recent activity monitoring
- User engagement metrics
- System health monitoring

## Admin Roles & Permissions

### Super Admin (`super_admin`)
- **Full system access**
- Can create, update, and delete other admins
- Access to all system features
- Cannot be deleted or have super admin status removed by other admins

### Admin (`admin`)
- **Limited administrative access**
- Permissions defined by permission set
- Cannot manage other admins
- Can be managed by super admins

### Moderator (`moderator`)
- **Content moderation focus**
- Manage enquiries and user content
- Limited system access
- Focused on community management

## Permission System

Permissions are stored as JSON and include:
- `manage_users`: User management capabilities
- `manage_admins`: Admin management (super admin only)
- `manage_products`: Product and catalog management
- `manage_categories`: Category management
- `manage_blogs`: Blog management
- `manage_enquiries`: Enquiry management
- `view_analytics`: Dashboard and analytics access
- `system_admin`: System-level operations

## API Endpoints

### Authentication
```
POST /admin/login
GET /admin/me
POST /admin/change-password
```

### Admin Management (Super Admin Only)
```
POST /admin/create
GET /admin/list
GET /admin/{admin_id}
PUT /admin/{admin_id}
DELETE /admin/{admin_id}
```

### Dashboard
```
GET /admin/dashboard/stats
GET /admin/activities/recent
```

### User Management
```
GET /admin/users/list
PUT /admin/users/{user_id}/status
```

### Enquiry Management
```
GET /admin/enquiries/list
PUT /admin/enquiries/{enquiry_id}/status
```

## Setup Instructions

### 1. Database Setup

The admin table is automatically created when you start the Docker containers. It includes a default super admin:

- **Username**: `superadmin`
- **Email**: `admin@amberglobal.com`
- **Password**: `admin123456`

⚠️ **IMPORTANT**: Change this default password immediately after first login!

### 2. Manual Admin Creation

You can also create admins manually using the provided script:

```bash
# Run the admin creation script
cd backend
python create_admin_table.py
```

### 3. Docker Setup

The admin system is already integrated into the Docker setup. When you run:

```bash
docker-compose up -d
```

The admin table will be created automatically with the default super admin.

## Usage Examples

### 1. Admin Login

```bash
curl -X POST "http://localhost:8000/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "admin123456"
  }'
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "admin_id": 1,
  "username": "superadmin",
  "role": "super_admin",
  "permissions": {...}
}
```

### 2. Get Dashboard Stats

```bash
curl -X GET "http://localhost:8000/admin/dashboard/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Create New Admin

```bash
curl -X POST "http://localhost:8000/admin/create" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newadmin",
    "email": "newadmin@amberglobal.com",
    "password": "securepassword123",
    "confirm_password": "securepassword123",
    "full_name": "New Administrator",
    "role": "admin",
    "permissions": {
      "manage_users": true,
      "manage_products": true,
      "view_analytics": true
    }
  }'
```

### 4. List All Users

```bash
curl -X GET "http://localhost:8000/admin/users/list?skip=0&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Update Enquiry Status

```bash
curl -X PUT "http://localhost:8000/admin/enquiries/123/status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '"resolved"'
```

## Security Best Practices

### 1. Password Security
- Minimum 8 characters required
- Use strong, unique passwords
- Change default passwords immediately
- Regular password rotation recommended

### 2. Token Management
- Tokens expire after 8 hours
- Store tokens securely (not in localStorage for production)
- Implement token refresh mechanism
- Use HTTPS in production

### 3. Permission Management
- Follow principle of least privilege
- Regular permission audits
- Remove unused permissions
- Monitor admin activities

### 4. Production Deployment
- Change default admin credentials
- Use environment variables for secrets
- Enable HTTPS/SSL
- Implement rate limiting
- Regular security audits

## Activity Logging

All admin actions are automatically logged with:
- Action type and description
- Admin username and email
- Timestamp
- Affected resources

Activity types include:
- `admin_login`
- `admin_created`
- `admin_updated`
- `admin_deleted`
- `admin_password_change`
- `user_status_updated`
- `enquiry_status_updated`

## Troubleshooting

### Common Issues

1. **"Admin not found" error**
   - Check if admin exists in database
   - Verify admin is active (`is_active = true`)

2. **"Permission denied" errors**
   - Check admin role and permissions
   - Verify token is valid and not expired

3. **"Token has expired" error**
   - Re-authenticate to get new token
   - Check system time synchronization

4. **Database connection issues**
   - Verify database is running
   - Check database credentials in `.env`
   - Ensure admin table exists

### Debug Mode

Enable debug logging by setting environment variable:
```bash
export LOG_LEVEL=DEBUG
```

## API Documentation

For complete API documentation with interactive testing, visit:
http://localhost:8000/docs

The admin endpoints will be listed under the "Admin" tag with full request/response schemas.

## Support

For issues or questions regarding the admin system:
1. Check the logs for error details
2. Verify database connectivity
3. Ensure proper authentication tokens
4. Review permission settings

The admin system is designed to be secure, scalable, and easy to use while providing comprehensive administrative capabilities for the Amber Global platform.
