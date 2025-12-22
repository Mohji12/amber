# PowerShell script for building and pushing Docker image to ECR
# AWS ECR Configuration
$AWS_ACCOUNT_ID = "474833638797"
$REPO_NAME = "amber"
$REGION = "ap-south-1"
$IMAGE_TAG = "latest"

# ECR Repository URI
$ECR_REPO_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}"

Write-Host "🔐 Authenticating Docker to ECR..." -ForegroundColor Cyan
$loginCommand = aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REPO_URI
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to authenticate with ECR" -ForegroundColor Red
    exit 1
}

Write-Host "🏗️ Building Docker image..." -ForegroundColor Cyan
docker build -t "${REPO_NAME}:${IMAGE_TAG}" -f Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed" -ForegroundColor Red
    exit 1
}

Write-Host "🏷️ Tagging image for ECR..." -ForegroundColor Cyan
docker tag "${REPO_NAME}:${IMAGE_TAG}" "${ECR_REPO_URI}:${IMAGE_TAG}"

Write-Host "📤 Pushing image to ECR..." -ForegroundColor Cyan
docker push "${ECR_REPO_URI}:${IMAGE_TAG}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker push failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Image pushed successfully!" -ForegroundColor Green
Write-Host "Image URI: ${ECR_REPO_URI}:${IMAGE_TAG}" -ForegroundColor Green


