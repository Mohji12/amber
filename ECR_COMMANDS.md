# 🚀 ECR Commands for AMBER Application

## 📋 **Your AWS Credentials**
- **Account ID**: `013553866037`
- **Region**: `ap-south-1`
- **Repository**: `amber`
- **ECR URI**: `013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber`

---

## 🔐 **Quick Commands (Copy-Paste)**

### **1. ECR Login**
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 013553866037.dkr.ecr.ap-south-1.amazonaws.com
```

### **2. Build & Tag**
```bash
# Build image
docker build -t amber .

# Tag for ECR
docker tag amber:latest 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
docker tag amber:latest 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0
```

### **3. Push to ECR**
```bash
# Push latest
docker push 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest

# Push version
docker push 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0
```

---

## 🎯 **One-Line Commands**

### **Complete Deployment (Linux/Mac)**
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 013553866037.dkr.ecr.ap-south-1.amazonaws.com && docker build -t amber . && docker tag amber:latest 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest && docker push 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

### **Complete Deployment (Windows PowerShell)**
```powershell
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 013553866037.dkr.ecr.ap-south-1.amazonaws.com; docker build -t amber .; docker tag amber:latest 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest; docker push 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

---

## 📁 **Available Scripts**

### **Linux/Mac (Bash)**
```bash
chmod +x ecr_deploy.sh
./ecr_deploy.sh
```

### **Windows (PowerShell)**
```powershell
.\ecr_deploy.ps1
```

---

## 🔍 **Verification Commands**

### **List Images in Repository**
```bash
aws ecr describe-images --repository-name amber --region ap-south-1 --output table
```

### **List Repositories**
```bash
aws ecr describe-repositories --region ap-south-1 --output table
```

---

## ⚠️ **Prerequisites**

1. **AWS CLI installed and configured**
2. **Docker installed and running**
3. **Proper AWS permissions** for ECR operations
4. **Dockerfile** in current directory

---

## 🚨 **Troubleshooting**

### **Permission Denied**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Configure AWS CLI if needed
aws configure
```

### **Docker Login Failed**
```bash
# Clear Docker credentials
docker logout 013553866037.dkr.ecr.ap-south-1.amazonaws.com

# Try login again
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 013553866037.dkr.ecr.ap-south-1.amazonaws.com
```

### **Repository Not Found**
```bash
# Create repository manually
aws ecr create-repository --repository-name amber --region ap-south-1
```

---

## 📚 **Next Steps After Push**

1. **Use in ECS Task Definition**:
   ```json
   "image": "013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest"
   ```

2. **Use in EKS Deployment**:
   ```yaml
   image: 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
   ```

3. **Use in Docker Compose**:
   ```yaml
   image: 013553866037.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
   ```
