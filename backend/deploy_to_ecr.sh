#!/bin/bash

# Amber Global Backend - AWS ECR Deployment Script
# This script builds the Docker image and pushes it to AWS ECR

set -e  # Exit on any error

# Configuration - UPDATE THESE VALUES
AWS_REGION="ap-south-1"  # Change to your AWS region
AWS_ACCOUNT_ID=""  # Your AWS Account ID (will be auto-detected if empty)
ECR_REPOSITORY_NAME="amber-global-backend"
IMAGE_TAG="latest"
DOCKER_IMAGE_NAME="amber-global-backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists aws; then
        print_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    # Check if AWS CLI is configured
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Get AWS Account ID
get_aws_account_id() {
    if [ -z "$AWS_ACCOUNT_ID" ]; then
        print_status "Getting AWS Account ID..."
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        print_success "AWS Account ID: $AWS_ACCOUNT_ID"
    fi
}

# Create ECR repository if it doesn't exist
create_ecr_repository() {
    print_status "Checking if ECR repository exists..."
    
    if aws ecr describe-repositories --repository-names "$ECR_REPOSITORY_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
        print_success "ECR repository '$ECR_REPOSITORY_NAME' already exists"
    else
        print_status "Creating ECR repository '$ECR_REPOSITORY_NAME'..."
        aws ecr create-repository \
            --repository-name "$ECR_REPOSITORY_NAME" \
            --region "$AWS_REGION" \
            --image-scanning-configuration scanOnPush=true \
            --encryption-configuration encryptionType=AES256
        
        print_success "ECR repository '$ECR_REPOSITORY_NAME' created successfully"
    fi
}

# Get ECR login token
get_ecr_login_token() {
    print_status "Getting ECR login token..."
    aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
    print_success "Logged in to ECR successfully"
}

# Build Docker image
build_docker_image() {
    print_status "Building Docker image..."
    
    # Build the image
    docker build -t "$DOCKER_IMAGE_NAME:$IMAGE_TAG" .
    
    # Tag the image for ECR
    docker tag "$DOCKER_IMAGE_NAME:$IMAGE_TAG" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG"
    
    print_success "Docker image built and tagged successfully"
}

# Push image to ECR
push_to_ecr() {
    print_status "Pushing image to ECR..."
    docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG"
    print_success "Image pushed to ECR successfully"
}

# Display deployment information
show_deployment_info() {
    echo ""
    print_success "Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Information:"
    echo "   AWS Region: $AWS_REGION"
    echo "   AWS Account ID: $AWS_ACCOUNT_ID"
    echo "   ECR Repository: $ECR_REPOSITORY_NAME"
    echo "   Image Tag: $IMAGE_TAG"
    echo "   Full Image URI: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Update your ECS task definition or deployment configuration"
    echo "   2. Deploy the new image to your ECS cluster or other AWS services"
    echo "   3. Monitor the deployment in AWS Console"
    echo ""
    echo "🔗 Useful Commands:"
    echo "   # Pull the image locally (if needed):"
    echo "   docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG"
    echo ""
    echo "   # Run the image locally (for testing):"
    echo "   docker run -p 8000:8000 -e DATABASE_URL='your-db-url' $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG"
    echo ""
}

# Main execution
main() {
    echo "🐳 Amber Global Backend - AWS ECR Deployment"
    echo "============================================="
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Get AWS Account ID
    get_aws_account_id
    
    # Create ECR repository
    create_ecr_repository
    
    # Get ECR login token
    get_ecr_login_token
    
    # Build Docker image
    build_docker_image
    
    # Push to ECR
    push_to_ecr
    
    # Show deployment information
    show_deployment_info
}

# Run main function
main "$@"

