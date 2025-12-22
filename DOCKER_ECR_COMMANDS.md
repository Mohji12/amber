# Docker and ECR Commands for Amber

## Configuration
- **AWS Account ID**: 474833638797
- **Repository Name**: amber
- **Region**: ap-south-1
- **ECR Repository URI**: `474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber`

---

## Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   aws --version
   ```

2. **Docker installed and running**
   ```bash
   docker --version
   ```

3. **Create ECR Repository** (if not exists)
   ```bash
   aws ecr create-repository --repository-name amber --region ap-south-1
   ```

---

## Step-by-Step Commands

### 1. Authenticate Docker to ECR

**Linux/Mac (Bash):**
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com
```

**Windows (PowerShell):**
```powershell
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com
```

### 2. Build Docker Image

Navigate to the `backend` directory first:
```bash
cd backend
```

**Build the image:**
```bash
docker build -t amber:latest -f Dockerfile .
```

**Or with a specific tag:**
```bash
docker build -t amber:v1.0.0 -f Dockerfile .
```

### 3. Tag Image for ECR

**For latest tag:**
```bash
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

**For version tag:**
```bash
docker tag amber:v1.0.0 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0
```

### 4. Push Image to ECR

**Push latest:**
```bash
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

**Push version:**
```bash
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0
```

---

## One-Line Commands

### Linux/Mac (Bash)
```bash
cd backend && aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com && docker build -t amber:latest -f Dockerfile . && docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest && docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

### Windows (PowerShell)
```powershell
cd backend; aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com; docker build -t amber:latest -f Dockerfile .; docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest; docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

---

## Verify Commands

### List Images in ECR
```bash
aws ecr describe-images --repository-name amber --region ap-south-1
```

### List Local Docker Images
```bash
docker images | grep amber
```

### Check ECR Repository
```bash
aws ecr describe-repositories --repository-names amber --region ap-south-1
```

---

## Using Different Tags

Replace `latest` with your desired tag:

```bash
# Build with version tag
docker build -t amber:v1.0.0 -f Dockerfile .

# Tag for ECR
docker tag amber:v1.0.0 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0

# Push to ECR
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0
```

**Common tag examples:**
- `latest` - Latest version
- `v1.0.0` - Version number
- `production` - Production environment
- `staging` - Staging environment
- `dev` - Development environment

---

## Quick Reference

```bash
# Full workflow (from backend directory)
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com
docker build -t amber:latest -f Dockerfile .
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

---

## Troubleshooting

### Authentication Error
If you get authentication errors, ensure:
1. AWS CLI is configured: `aws configure`
2. Your AWS credentials have ECR permissions
3. The ECR repository exists

### Permission Denied
Ensure your IAM user/role has these ECR permissions:
- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:BatchGetImage`
- `ecr:PutImage`
- `ecr:InitiateLayerUpload`
- `ecr:UploadLayerPart`
- `ecr:CompleteLayerUpload`

### Repository Not Found
Create the repository first:
```bash
aws ecr create-repository --repository-name amber --region ap-south-1
```

