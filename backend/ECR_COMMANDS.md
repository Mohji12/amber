# Docker and ECR Commands

## Prerequisites
- AWS CLI installed and configured
- Docker installed and running
- AWS credentials with ECR permissions

## Step-by-Step Commands

### 1. Authenticate Docker to ECR
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com
```

### 2. Build Docker Image
```bash
docker build -t amber:latest -f Dockerfile .
```

### 3. Tag Image for ECR
```bash
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

### 4. Push Image to ECR
```bash
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

## One-Line Command (Linux/Mac)
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com && docker build -t amber:latest -f Dockerfile . && docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest && docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

## PowerShell Commands (Windows)
```powershell
# Authenticate
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com

# Build
docker build -t amber:latest -f Dockerfile .

# Tag
docker tag amber:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest

# Push
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber:latest
```

## Important Notes

1. **Create ECR Repository First** (if not exists):
   ```bash
   aws ecr create-repository --repository-name amber --region ap-south-1
   ```

2. **ECR Repository URI**: `474833638797.dkr.ecr.ap-south-1.amazonaws.com/amber`

3. **Using Different Tags**: Replace `latest` with your desired tag (e.g., `v1.0.0`, `production`, etc.)

4. **Verify Image**: After pushing, verify in AWS Console or using:
   ```bash
   aws ecr describe-images --repository-name amber --region ap-south-1
   ```


