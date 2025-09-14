# 🐳 Docker & AWS ECR Deployment Commands

## Prerequisites

1. **Install Docker**: https://docs.docker.com/get-docker/
2. **Install AWS CLI**: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
3. **Configure AWS CLI**: `aws configure`

## Quick Deployment (Using Scripts)

### For Linux/Mac:
```bash
chmod +x deploy_to_ecr.sh
./deploy_to_ecr.sh
```

### For Windows PowerShell:
```powershell
.\deploy_to_ecr.ps1
```

## Manual Commands (Step by Step)

### 1. Set Variables
```bash
# Update these values
AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID="123456789012"  # Your AWS Account ID
ECR_REPOSITORY_NAME="amber-global-backend"
IMAGE_TAG="latest"
```

### 2. Get AWS Account ID (if not known)
```bash
aws sts get-caller-identity --query Account --output text
```

### 3. Create ECR Repository
```bash
aws ecr create-repository \
    --repository-name $ECR_REPOSITORY_NAME \
    --region $AWS_REGION \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256
```

### 4. Login to ECR
```bash
aws ecr get-login-password --region $AWS_REGION | \
docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

### 5. Build Docker Image
```bash
# Build the image
docker build -t amber-global-backend:$IMAGE_TAG .

# Tag for ECR
docker tag amber-global-backend:$IMAGE_TAG \
    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG
```

### 6. Push to ECR
```bash
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG
```

## Complete One-Liner Commands

### For Linux/Mac:
```bash
# Set variables
export AWS_REGION="ap-south-1"
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_REPOSITORY_NAME="amber-global-backend"
export IMAGE_TAG="latest"

# Create repository (if doesn't exist)
aws ecr create-repository --repository-name $ECR_REPOSITORY_NAME --region $AWS_REGION --image-scanning-configuration scanOnPush=true --encryption-configuration encryptionType=AES256 2>/dev/null || true

# Login, build, tag, and push
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com && \
docker build -t amber-global-backend:$IMAGE_TAG . && \
docker tag amber-global-backend:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG && \
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG
```

### For Windows PowerShell:
```powershell
# Set variables
$AWS_REGION = "ap-south-1"
$AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$ECR_REPOSITORY_NAME = "amber-global-backend"
$IMAGE_TAG = "latest"

# Create repository (if doesn't exist)
aws ecr create-repository --repository-name $ECR_REPOSITORY_NAME --region $AWS_REGION --image-scanning-configuration scanOnPush=true --encryption-configuration encryptionType=AES256 2>$null

# Login, build, tag, and push
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
docker build -t "amber-global-backend:$IMAGE_TAG" .
docker tag "amber-global-backend:$IMAGE_TAG" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME`:$IMAGE_TAG"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME`:$IMAGE_TAG"
```

## Useful Commands

### List ECR Repositories
```bash
aws ecr describe-repositories --region $AWS_REGION
```

### List Images in Repository
```bash
aws ecr describe-images --repository-name $ECR_REPOSITORY_NAME --region $AWS_REGION
```

### Pull Image from ECR
```bash
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG
```

### Run Image Locally (for testing)
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="mysql+mysqlconnector://admin:Amberglobaltrade2424@amber-database.cbeyuko6yxme.ap-south-1.rds.amazonaws.com:3306/amberdata1" \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG
```

### Delete Image from ECR
```bash
aws ecr batch-delete-image \
    --repository-name $ECR_REPOSITORY_NAME \
    --region $AWS_REGION \
    --image-ids imageTag=$IMAGE_TAG
```

## Environment Variables for Production

When running the container, make sure to set these environment variables:

```bash
DATABASE_URL="mysql+mysqlconnector://admin:Amberglobaltrade2424@amber-database.cbeyuko6yxme.ap-south-1.rds.amazonaws.com:3306/amberdata1"
SECRET_KEY="your-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES="480"
```

## Troubleshooting

### Common Issues:

1. **AWS CLI not configured**:
   ```bash
   aws configure
   ```

2. **Docker not running**:
   ```bash
   # Start Docker Desktop or Docker service
   sudo systemctl start docker  # Linux
   ```

3. **Permission denied**:
   ```bash
   # Add user to docker group (Linux)
   sudo usermod -aG docker $USER
   ```

4. **ECR repository already exists**:
   - The script will handle this automatically
   - Or manually check: `aws ecr describe-repositories --repository-names amber-global-backend`

5. **Image push fails**:
   - Check ECR login: `aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com`

## Next Steps After ECR Push

1. **Update ECS Task Definition** with the new image URI
2. **Deploy to ECS Cluster** or other AWS services
3. **Monitor deployment** in AWS Console
4. **Test the deployed application**

## Image URI Format

Your image will be available at:
```
{ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com/{REPOSITORY_NAME}:{TAG}
```

Example:
```
123456789012.dkr.ecr.ap-south-1.amazonaws.com/amber-global-backend:latest
```

