#!/bin/bash

# ECR Deployment Script for AMBER Application
# Account ID: 013553866037
# Region: ap-south-1
# Repository: amber

set -e

echo "🚀 Starting ECR Deployment for AMBER Application"
echo "=================================================="

# Configuration
AWS_ACCOUNT_ID="013553866037"
AWS_REGION="ap-south-1"
ECR_REPO_NAME="amber"
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"
IMAGE_TAG="latest"
VERSION_TAG="v1.0.0"

echo "📍 AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "🌍 AWS Region: ${AWS_REGION}"
echo "📦 ECR Repository: ${ECR_REPO_NAME}"
echo "🏷️  Image Tag: ${IMAGE_TAG}"
echo ""

# Step 1: Check if ECR repository exists, create if not
echo "📋 Step 1: Checking ECR Repository..."
if aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} 2>/dev/null; then
    echo "✅ ECR Repository '${ECR_REPO_NAME}' already exists"
else
    echo "🆕 Creating ECR Repository '${ECR_REPO_NAME}'..."
    aws ecr create-repository \
        --repository-name ${ECR_REPO_NAME} \
        --region ${AWS_REGION} \
        --image-scanning-configuration scanOnPush=true \
        --encryption-configuration encryptionType=AES256
    echo "✅ ECR Repository created successfully"
fi
echo ""

# Step 2: ECR Login
echo "🔐 Step 2: Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}
echo "✅ ECR Login successful"
echo ""

# Step 3: Build Docker Image
echo "🔨 Step 3: Building Docker Image..."
echo "Building image with tag: ${IMAGE_TAG}"
echo "Using requirements-lambda.txt for AWS Lambda deployment"
docker build -t ${ECR_REPO_NAME}:${IMAGE_TAG} .
echo "✅ Docker image built successfully"
echo ""

# Step 4: Tag Images for ECR
echo "🏷️  Step 4: Tagging Images for ECR..."
docker tag ${ECR_REPO_NAME}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}
docker tag ${ECR_REPO_NAME}:${IMAGE_TAG} ${ECR_URI}:${VERSION_TAG}
echo "✅ Images tagged successfully:"
echo "   - ${ECR_URI}:${IMAGE_TAG}"
echo "   - ${ECR_URI}:${VERSION_TAG}"
echo ""

# Step 5: Push Images to ECR
echo "📤 Step 5: Pushing Images to ECR..."
echo "Pushing ${IMAGE_TAG} tag..."
docker push ${ECR_URI}:${IMAGE_TAG}
echo "Pushing ${VERSION_TAG} tag..."
docker push ${ECR_URI}:${VERSION_TAG}
echo "✅ Images pushed successfully to ECR"
echo ""

# Step 6: Verify Images
echo "🔍 Step 6: Verifying Images in ECR..."
aws ecr describe-images \
    --repository-name ${ECR_REPO_NAME} \
    --region ${AWS_REGION} \
    --query 'imageDetails[*].[imageTags,imageDigest,imagePushedAt]' \
    --output table

echo ""
echo "🎉 ECR Deployment Completed Successfully!"
echo "=========================================="
echo "📦 Repository: ${ECR_URI}"
echo "🏷️  Available Tags: ${IMAGE_TAG}, ${VERSION_TAG}"
echo "🌍 Region: ${AWS_REGION}"
echo ""
echo "💡 Next Steps:"
echo "   - Use these images in your ECS/EKS deployments"
echo "   - Update your deployment scripts with the new image URIs"
echo "   - Consider setting up CI/CD pipeline for automated deployments"
