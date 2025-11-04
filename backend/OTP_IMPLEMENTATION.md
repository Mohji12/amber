# OTP Email Verification Implementation

This document describes the OTP (One-Time Password) email verification system implemented for the Amber Import application.

## Overview

The OTP system ensures that users verify their email addresses during signup before they can access the application. The system uses Zoho Zepto mail service for sending verification emails.

## Features

- ✅ Email verification during signup
- ✅ 6-digit OTP codes
- ✅ 5-minute expiration time
- ✅ Automatic cleanup of expired OTPs
- ✅ Resend OTP functionality
- ✅ Beautiful HTML email templates
- ✅ Secure OTP storage in database

## Database Changes

### New Tables
- `otps` - Stores OTP codes with expiration times

### Updated Tables
- `users` - Added `is_verified` boolean field

## API Endpoints

### 1. Signup with OTP
```
POST /auth/signup
```
**Request Body:**
```json
{
  "user_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "business_name": "My Business",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "message": "Registration successful! Please check your email for verification code.",
  "email": "john@example.com"
}
```

### 2. Verify OTP
```
POST /auth/verify-otp
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "john@example.com"
}
```

### 3. Resend OTP
```
POST /auth/resend-otp
```
**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully! Please check your email.",
  "email": "john@example.com"
}
```

## Email Configuration

The system uses Zoho Zepto mail service with the following configuration:

- **SMTP Server:** smtp.zeptomail.in
- **Port:** 587 (TLS)
- **Username:** emailapikey
- **Authentication:** TLS

### Email Template Features

- Professional HTML design
- Responsive layout
- Clear OTP display
- Security warnings
- Branded with Amber Import

## Setup Instructions

### 1. Run Database Migration
```bash
cd backend
python migrate_otp_tables.py
```

### 2. Update Email Configuration
Edit `backend/app/email_service.py` and update:
- `sender_email` - Your verified sender email address
- SMTP credentials if needed

### 3. Test the Implementation
```bash
cd backend
python test_otp.py
```

## Security Features

- OTP codes expire after 5 minutes
- Used OTPs are marked and cannot be reused
- Automatic cleanup of expired OTPs
- Email verification required before login
- Secure password hashing maintained

## Maintenance

### Cleanup Expired OTPs
Run the cleanup script periodically:
```bash
cd backend
python cleanup_expired_otps.py
```

### Cron Job Setup (Optional)
Add to crontab for automatic cleanup:
```bash
# Clean up expired OTPs every hour
0 * * * * cd /path/to/backend && python cleanup_expired_otps.py
```

## Error Handling

The system handles various error scenarios:
- Invalid OTP codes
- Expired OTP codes
- Email sending failures
- Database connection issues
- User not found scenarios

## Frontend Integration

The frontend should be updated to:
1. Handle the new signup flow (show OTP input after signup)
2. Display OTP verification screen
3. Handle resend OTP functionality
4. Show appropriate error messages

## Testing

Use the provided test script to verify functionality:
```bash
python test_otp.py
```

## Troubleshooting

### Common Issues

1. **Email not sending:**
   - Check SMTP credentials
   - Verify sender email is authorized
   - Check network connectivity

2. **OTP not working:**
   - Verify database migration completed
   - Check OTP table exists
   - Ensure proper timezone settings

3. **User can't login after verification:**
   - Check if `is_verified` field was added to users table
   - Verify OTP verification completed successfully

## Files Modified/Created

### New Files
- `backend/app/email_service.py` - Email service implementation
- `backend/migrate_otp_tables.py` - Database migration script
- `backend/cleanup_expired_otps.py` - OTP cleanup script
- `backend/test_otp.py` - Test script
- `backend/OTP_IMPLEMENTATION.md` - This documentation

### Modified Files
- `backend/app/models.py` - Added OTP model and is_verified field
- `backend/app/schemas.py` - Added OTP-related schemas
- `backend/app/crud.py` - Added OTP CRUD operations
- `backend/app/routers/auth.py` - Updated signup flow and added OTP endpoints 