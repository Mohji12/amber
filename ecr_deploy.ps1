# ECR Deployment Script for AMBER Application (PowerShell)
# Account ID: 013553866037
# Region: ap-south-1
# Repository: amber

param(
    [string]$ImageTag = "latest",
    [string]$VersionTag = "v1.0.0"
)

# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting ECR Deployment for AMBER Application" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Configuration
$AWS_ACCOUNT_ID = "013553866037"
$AWS_REGION = "ap-south-1"
$ECR_REPO_NAME = "amber"
$ECR_URI = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME"

Write-Host "📍 AWS Account ID: $AWS_ACCOUNT_ID" -ForegroundColor Cyan
Write-Host "🌍 AWS Region: $AWS_REGION" -ForegroundColor Cyan
Write-Host "📦 ECR Repository: $ECR_REPO_NAME" -ForegroundColor Cyan
Write-Host "🏷️  Image Tag: $ImageTag" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if ECR repository exists, create if not
Write-Host "📋 Step 1: Checking ECR Repository..." -ForegroundColor Yellow
try {
    $repo = aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AWS_REGION 2>$null
    if ($repo) {
        Write-Host "✅ ECR Repository '$ECR_REPO_NAME' already exists" -ForegroundColor Green
    }
} catch {
    Write-Host "🆕 Creating ECR Repository '$ECR_REPO_NAME'..." -ForegroundColor Yellow
    aws ecr create-repository `
        --repository-name $ECR_REPO_NAME `
        --region $AWS_REGION `
        --image-scanning-configuration scanOnPush=true `
        --encryption-configuration encryptionType=AES256
    Write-Host "✅ ECR Repository created successfully" -ForegroundColor Green
}
Write-Host ""

# Step 2: ECR Login
Write-Host "🔐 Step 2: Logging into ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI
Write-Host "✅ ECR Login successful" -ForegroundColor Green
Write-Host ""

# Step 3: Build Docker Image
Write-Host "🔨 Step 3: Building Docker Image..." -ForegroundColor Yellow
Write-Host "Building image with tag: $ImageTag" -ForegroundColor Cyan
Write-Host "Using requirements-lambda.txt for AWS Lambda deployment" -ForegroundColor Cyan
docker build -t $ECR_REPO_NAME`:$ImageTag .
Write-Host "✅ Docker image built successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Tag Images for ECR
Write-Host "🏷️  Step 4: Tagging Images for ECR..." -ForegroundColor Yellow
docker tag $ECR_REPO_NAME`:$ImageTag $ECR_URI`:$ImageTag
docker tag $ECR_REPO_NAME`:$ImageTag $ECR_URI`:$VersionTag
Write-Host "✅ Images tagged successfully:" -ForegroundColor Green
Write-Host "   - $ECR_URI`:$ImageTag" -ForegroundColor Cyan
Write-Host "   - $ECR_URI`:$VersionTag" -ForegroundColor Cyan
Write-Host ""

# Step 5: Push Images to ECR
Write-Host "📤 Step 5: Pushing Images to ECR..." -ForegroundColor Yellow
Write-Host "Pushing $ImageTag tag..." -ForegroundColor Cyan
docker push $ECR_URI`:$ImageTag
Write-Host "Pushing $VersionTag tag..." -ForegroundColor Cyan
docker push $ECR_URI`:$VersionTag
Write-Host "✅ Images pushed successfully to ECR" -ForegroundColor Green
Write-Host ""

# Step 6: Verify Images
Write-Host "🔍 Step 6: Verifying Images in ECR..." -ForegroundColor Yellow
aws ecr describe-images `
    --repository-name $ECR_REPO_NAME `
    --region $AWS_REGION `
    --query 'imageDetails[*].[imageTags,imageDigest,imagePushedAt]' `
    --output table

Write-Host ""
Write-Host "🎉 ECR Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "📦 Repository: $ECR_URI" -ForegroundColor Cyan
Write-Host "🏷️  Available Tags: $ImageTag, $VersionTag" -ForegroundColor Cyan
Write-Host "🌍 Region: $AWS_REGION" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Next Steps:" -ForegroundColor Yellow
Write-Host "   - Use these images in your ECS/EKS deployments" -ForegroundColor White
Write-Host "   - Update your deployment scripts with the new image URIs" -ForegroundColor White
Write-Host "   - Consider setting up CI/CD pipeline for automated deployments" -ForegroundColor White
