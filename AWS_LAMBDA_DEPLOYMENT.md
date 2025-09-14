# 🚀 AWS Lambda Deployment Guide for AMBER Application

## 📋 **Issues Fixed**

### ✅ **1. Pydantic V2 Compatibility**
- **Issue**: `'orm_mode' has been renamed to 'from_attributes'`
- **Fix**: Updated all schemas in `backend/app/schemas.py`
- **Changes**: Replaced `orm_mode = True` with `from_attributes = True`

### ✅ **2. JWT Import Issue**
- **Issue**: `ModuleNotFoundError: No module named 'jwt'`
- **Fix**: Removed conflicting local import in `backend/app/routers/auth.py`
- **Changes**: Using `from jose import JWTError, jwt` consistently

### ✅ **3. bcrypt Version Compatibility**
- **Issue**: `AttributeError: module 'bcrypt' has no attribute '__about__'`
- **Fix**: Specified compatible versions in `requirements-lambda.txt`
- **Changes**: `bcrypt==4.0.1` and `passlib==1.7.4`

## 🔧 **Files Updated**

### **Backend Code Fixes**
- ✅ `backend/app/schemas.py` - Updated Pydantic configs
- ✅ `backend/app/routers/auth.py` - Fixed JWT imports
- ✅ `backend/app/models.py` - Added missing database fields

### **Deployment Files**
- ✅ `backend/requirements-lambda.txt` - Minimal Lambda requirements
- ✅ `backend/Dockerfile` - Updated for Lambda deployment
- ✅ `ecr_deploy.sh` - Updated deployment script
- ✅ `ecr_deploy.ps1` - Updated PowerShell script

## 🚀 **Deployment Steps**

### **1. Build and Push to ECR**
```bash
# Linux/Mac
chmod +x ecr_deploy.sh
./ecr_deploy.sh

# Windows PowerShell
.\ecr_deploy.ps1
```

### **2. Manual Commands (if needed)**
```bash
# ECR Login
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 013553866037.dkr.ecr.ap-south-1.amazonaws.com

# Build with Lambda requirements
docker build -t amber:latest .

# Tag for ECR
docker tag amber:latest 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest

# Push to ECR
docker push 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

## 📦 **Lambda Requirements**

The `requirements-lambda.txt` includes only essential dependencies:

```txt
fastapi==0.115.8
uvicorn==0.34.0
mangum==0.17.0
sqlalchemy==2.0.39
mysql-connector-python==9.2.0
python-jose[cryptography]==3.4.0
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
python-multipart==0.0.20
email-validator==2.2.0
python-dotenv==1.0.1
pydantic==2.10.5
pydantic-settings==2.7.1
```

## 🔍 **Verification**

### **Check ECR Images**
```bash
aws ecr describe-images --repository-name amber --region ap-south-1 --output table
```

### **Test Lambda Function**
```bash
# Test the deployed Lambda function
aws lambda invoke \
  --function-name your-lambda-function-name \
  --payload '{"httpMethod": "GET", "path": "/health"}' \
  response.json
```

## ⚙️ **Environment Variables**

Make sure your Lambda function has these environment variables:

```bash
DATABASE_URL=mysql+mysqlconnector://admin:Amberglobaltrade2424@amber-database.cbeyuko6yxme.ap-south-1.rds.amazonaws.com:3306/amberdata1
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

## 🚨 **Troubleshooting**

### **If Lambda Still Fails**
1. **Check CloudWatch Logs** for detailed error messages
2. **Verify Environment Variables** are set correctly
3. **Test Database Connection** from Lambda
4. **Check IAM Permissions** for RDS access

### **Common Issues**
- **Database Connection**: Ensure Lambda has VPC access to RDS
- **Memory/Timeout**: Increase Lambda memory and timeout if needed
- **Dependencies**: Verify all packages are in `requirements-lambda.txt`

## 📚 **Next Steps**

1. **Deploy to ECR** using the updated scripts
2. **Update Lambda Function** with new image
3. **Test All Endpoints** to ensure functionality
4. **Monitor CloudWatch Logs** for any remaining issues

## 🎯 **Expected Results**

After deployment, your Lambda function should:
- ✅ Start without Pydantic warnings
- ✅ Handle JWT operations correctly
- ✅ Connect to RDS database successfully
- ✅ Process all API requests without errors

---

**Your AMBER application is now ready for AWS Lambda deployment!** 🎉
