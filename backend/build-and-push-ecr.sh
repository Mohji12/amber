#!/bin/bash

# AWS ECR Configuration
AWS_ACCOUNT_ID=474833638797
REPO_NAME=amber
REGION=ap-south-1
IMAGE_TAG=latest

# ECR Repository URI
ECR_REPO_URI=${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}

echo "🔐 Authenticating Docker to ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_REPO_URI}

echo "🏗️ Building Docker image..."
docker build -t ${REPO_NAME}:${IMAGE_TAG} -f Dockerfile .

echo "🏷️ Tagging image for ECR..."
docker tag ${REPO_NAME}:${IMAGE_TAG} ${ECR_REPO_URI}:${IMAGE_TAG}

echo "📤 Pushing image to ECR..."
docker push ${ECR_REPO_URI}:${IMAGE_TAG}

echo "✅ Image pushed successfully!"
echo "Image URI: ${ECR_REPO_URI}:${IMAGE_TAG}"


