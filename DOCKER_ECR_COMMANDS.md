# Docker & ECR Commands - Amber Repository

## 📋 Configuration
- **AWS Account ID:** `474833638797`
- **ECR Repository:** `amber`
- **AWS Region:** `ap-south-1`
- **ECR URI:** `474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber`

---

## 🔐 Step 1: Login to Amazon ECR

```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com
```

**Expected Output:** `Login Succeeded`

---

## 📦 Step 2: Create ECR Repository (First Time Only)

```bash
aws ecr create-repository \
    --repository-name amber \
    --region ap-south-1 \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256
```

---

## 🏷️ Step 3: Tag Docker Image

```bash
# Tag with 'latest'
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest

# Tag with timestamp
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:$(date +%Y%m%d-%H%M%S)

# Tag with version (example)
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0
```

---

## 📤 Step 4: Push Image to ECR

```bash
# Push latest tag
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest

# Push timestamp tag
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:$(date +%Y%m%d-%H%M%S)

# Push version tag
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0
```

---

## 🚀 Combined Commands (Tag + Push)

### Tag and Push Latest
```bash
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest && \
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

### Tag and Push with Timestamp
```bash
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:$(date +%Y%m%d-%H%M%S) && \
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:$(date +%Y%m%d-%H%M%S)
```

### Complete: Login + Tag + Push
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com && \
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest && \
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

---

## 📥 Pull Image from ECR

```bash
# Pull latest
docker pull 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest

# Pull specific tag
docker pull 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:v1.0.0
```

---

## 🔍 List Images in ECR

```bash
# List all images
aws ecr list-images --repository-name amber --region ap-south-1

# List with details
aws ecr describe-images --repository-name amber --region ap-south-1 --output table
```

---

## 🗑️ Delete Image from ECR

```bash
# Delete specific tag
aws ecr batch-delete-image \
    --repository-name amber \
    --region ap-south-1 \
    --image-ids imageTag=old-tag

# Delete multiple tags
aws ecr batch-delete-image \
    --repository-name amber \
    --region ap-south-1 \
    --image-ids imageTag=tag1 imageTag=tag2
```

---

## 🚀 Deployment Script (Bash)

Create `deploy-amber.sh`:

```bash
#!/bin/bash

set -e

ECR_URI="474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber"
AWS_REGION="ap-south-1"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "=== Login to ECR ==="
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

echo "=== Tag Image ==="
docker tag amber:latest ${ECR_URI}:latest
docker tag amber:latest ${ECR_URI}:${TIMESTAMP}

echo "=== Push Image ==="
docker push ${ECR_URI}:latest
docker push ${ECR_URI}:${TIMESTAMP}

echo "=== Deployment Complete ==="
echo "Image: ${ECR_URI}:latest"
echo "Timestamp: ${TIMESTAMP}"
```

**Run:**
```bash
chmod +x deploy-amber.sh
./deploy-amber.sh
```

---

## 📋 Deployment Script (PowerShell)

Create `deploy-amber.ps1`:

```powershell
$ECR_URI = "474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber"
$AWS_REGION = "ap-south-1"
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"

Write-Host "=== Login to ECR ===" -ForegroundColor Blue
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

Write-Host "=== Tag Image ===" -ForegroundColor Blue
docker tag amber:latest "${ECR_URI}:latest"
docker tag amber:latest "${ECR_URI}:${TIMESTAMP}"

Write-Host "=== Push Image ===" -ForegroundColor Blue
docker push "${ECR_URI}:latest"
docker push "${ECR_URI}:${TIMESTAMP}"

Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host "Image: ${ECR_URI}:latest"
Write-Host "Timestamp: $TIMESTAMP"
```

**Run:**
```powershell
.\deploy-amber.ps1
```

---

## 🔧 Quick Reference

### Login
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com
```

### Tag
```bash
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

### Push
```bash
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

### Tag + Push (One Line)
```bash
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest && docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

### Pull
```bash
docker pull 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

---

## 🐛 Troubleshooting

### Re-login (Token Expired)
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com
```

### Create Repository
```bash
aws ecr create-repository --repository-name amber --region ap-south-1
```

### Verify Repository
```bash
aws ecr describe-repositories --repository-names amber --region ap-south-1
```

---

**Repository:** `amber`  
**Region:** `ap-south-1`  
**Account ID:** `474833638797`  
**ECR URI:** `474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber`
