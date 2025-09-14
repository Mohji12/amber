# Amber Global Backend - AWS ECR Deployment Script (PowerShell)
# This script builds the Docker image and pushes it to AWS ECR

param(
    [string]$AWSRegion = "ap-south-1",
    [string]$AWSAccountId = "",
    [string]$ECRRepositoryName = "amber-global-backend",
    [string]$ImageTag = "latest",
    [string]$DockerImageName = "amber-global-backend"
)

# Function to write colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Check prerequisites
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    if (-not (Test-Command "docker")) {
        Write-Error "Docker is not installed. Please install Docker first."
        exit 1
    }
    
    if (-not (Test-Command "aws")) {
        Write-Error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    }
    
    # Check if AWS CLI is configured
    try {
        aws sts get-caller-identity | Out-Null
    }
    catch {
        Write-Error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    }
    
    Write-Success "All prerequisites are met!"
}

# Get AWS Account ID
function Get-AWSAccountId {
    if ([string]::IsNullOrEmpty($AWSAccountId)) {
        Write-Status "Getting AWS Account ID..."
        $AWSAccountId = aws sts get-caller-identity --query Account --output text
        Write-Success "AWS Account ID: $AWSAccountId"
    }
}

# Create ECR repository if it doesn't exist
function New-ECRRepository {
    Write-Status "Checking if ECR repository exists..."
    
    try {
        aws ecr describe-repositories --repository-names $ECRRepositoryName --region $AWSRegion | Out-Null
        Write-Success "ECR repository '$ECRRepositoryName' already exists"
    }
    catch {
        Write-Status "Creating ECR repository '$ECRRepositoryName'..."
        aws ecr create-repository `
            --repository-name $ECRRepositoryName `
            --region $AWSRegion `
            --image-scanning-configuration scanOnPush=true `
            --encryption-configuration encryptionType=AES256
        
        Write-Success "ECR repository '$ECRRepositoryName' created successfully"
    }
}

# Get ECR login token
function Get-ECRLoginToken {
    Write-Status "Getting ECR login token..."
    aws ecr get-login-password --region $AWSRegion | docker login --username AWS --password-stdin "$AWSAccountId.dkr.ecr.$AWSRegion.amazonaws.com"
    Write-Success "Logged in to ECR successfully"
}

# Build Docker image
function Build-DockerImage {
    Write-Status "Building Docker image..."
    
    # Build the image
    docker build -t "$DockerImageName`:$ImageTag" .
    
    # Tag the image for ECR
    docker tag "$DockerImageName`:$ImageTag" "$AWSAccountId.dkr.ecr.$AWSRegion.amazonaws.com/$ECRRepositoryName`:$ImageTag"
    
    Write-Success "Docker image built and tagged successfully"
}

# Push image to ECR
function Push-ToECR {
    Write-Status "Pushing image to ECR..."
    docker push "$AWSAccountId.dkr.ecr.$AWSRegion.amazonaws.com/$ECRRepositoryName`:$ImageTag"
    Write-Success "Image pushed to ECR successfully"
}

# Display deployment information
function Show-DeploymentInfo {
    Write-Host ""
    Write-Success "Deployment completed successfully!"
    Write-Host ""
    Write-Host "📋 Deployment Information:" -ForegroundColor Cyan
    Write-Host "   AWS Region: $AWSRegion"
    Write-Host "   AWS Account ID: $AWSAccountId"
    Write-Host "   ECR Repository: $ECRRepositoryName"
    Write-Host "   Image Tag: $ImageTag"
    Write-Host "   Full Image URI: $AWSAccountId.dkr.ecr.$AWSRegion.amazonaws.com/$ECRRepositoryName`:$ImageTag"
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Update your ECS task definition or deployment configuration"
    Write-Host "   2. Deploy the new image to your ECS cluster or other AWS services"
    Write-Host "   3. Monitor the deployment in AWS Console"
    Write-Host ""
    Write-Host "🔗 Useful Commands:" -ForegroundColor Cyan
    Write-Host "   # Pull the image locally (if needed):"
    Write-Host "   docker pull $AWSAccountId.dkr.ecr.$AWSRegion.amazonaws.com/$ECRRepositoryName`:$ImageTag"
    Write-Host ""
    Write-Host "   # Run the image locally (for testing):"
    Write-Host "   docker run -p 8000:8000 -e DATABASE_URL='your-db-url' $AWSAccountId.dkr.ecr.$AWSRegion.amazonaws.com/$ECRRepositoryName`:$ImageTag"
    Write-Host ""
}

# Main execution
function Main {
    Write-Host "🐳 Amber Global Backend - AWS ECR Deployment" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check prerequisites
    Test-Prerequisites
    
    # Get AWS Account ID
    Get-AWSAccountId
    
    # Create ECR repository
    New-ECRRepository
    
    # Get ECR login token
    Get-ECRLoginToken
    
    # Build Docker image
    Build-DockerImage
    
    # Push to ECR
    Push-ToECR
    
    # Show deployment information
    Show-DeploymentInfo
}

# Run main function
Main

