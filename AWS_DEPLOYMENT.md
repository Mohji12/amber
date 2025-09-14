# AWS Deployment Guide for Amber Global

## 🔐 **Security Checklist - COMPLETED**

### ✅ **Environment Variables Secured**
- All passwords moved to environment variables
- No hardcoded secrets in docker-compose.yml
- Template file provided (env.example)

### ✅ **Health Checks Added**
- Backend health endpoint: `/health`
- Database health checks
- Frontend health checks
- Service dependency management

### ✅ **Production Optimizations**
- Multi-stage Docker builds
- Minimal requirements file
- Proper logging configuration
- CORS configured for production

## 🚀 **AWS Deployment Options**

### **Option 1: AWS ECS (Recommended)**

#### Prerequisites:
```bash
# Install AWS CLI
aws configure

# Create .env file for production
cp env.example .env
# Edit .env with your production values
```

#### Deployment Steps:

1. **Create ECR Repository:**
```bash
aws ecr create-repository --repository-name amber-global-backend
aws ecr create-repository --repository-name amber-global-frontend
```

2. **Build and Push Images:**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag images
docker build -t amber-global-backend ./backend
docker build -t amber-global-frontend ./frontend

# Tag for ECR
docker tag amber-global-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/amber-global-backend:latest
docker tag amber-global-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/amber-global-frontend:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/amber-global-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/amber-global-frontend:latest
```

3. **Create ECS Cluster and Services**
4. **Set up RDS for MySQL**
5. **Configure Application Load Balancer**

### **Option 2: AWS EC2 with Docker**

#### Prerequisites:
- EC2 instance with Docker installed
- Security groups configured
- Domain name (optional)

#### Deployment Steps:

1. **Launch EC2 Instance:**
```bash
# Ubuntu 22.04 LTS recommended
# Instance type: t3.medium or larger
# Security groups: 22 (SSH), 80 (HTTP), 443 (HTTPS), 8000 (Backend), 3000 (Frontend)
```

2. **Install Docker on EC2:**
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker ubuntu
```

3. **Deploy Application:**
```bash
# Clone repository
git clone <your-repo>
cd import-main

# Create production .env file
cp env.example .env
# Edit with production values

# Start services
docker-compose up -d
```

4. **Set up Nginx Reverse Proxy:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 **Security Best Practices**

### **Environment Variables (CRITICAL):**
```bash
# Create .env file with strong passwords
MYSQL_ROOT_PASSWORD=YourSuperSecurePassword123!
SECRET_KEY=your-very-long-random-secret-key-here
```

### **Database Security:**
- Use RDS instead of containerized MySQL for production
- Enable encryption at rest
- Use VPC security groups
- Regular backups

### **Network Security:**
- Use HTTPS (SSL/TLS)
- Configure security groups properly
- Use VPC for network isolation
- Enable CloudTrail for logging

### **Application Security:**
- Regular security updates
- Monitor logs for suspicious activity
- Use AWS Secrets Manager for sensitive data
- Enable AWS CloudWatch monitoring

## 📊 **Monitoring and Logging**

### **AWS CloudWatch:**
```bash
# Set up CloudWatch agent
# Monitor CPU, memory, disk usage
# Set up alarms for critical metrics
```

### **Application Logs:**
```bash
# View container logs
docker-compose logs -f

# Set up log aggregation
# Use AWS CloudWatch Logs
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Example:**
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy to ECS
        run: |
          # Your deployment commands here
```

## 🚨 **Pre-Deployment Checklist**

- [ ] All passwords moved to environment variables
- [ ] Health checks implemented
- [ ] SSL certificate configured
- [ ] Database backups enabled
- [ ] Monitoring and alerting set up
- [ ] Security groups configured
- [ ] Domain name configured (if applicable)
- [ ] CI/CD pipeline tested
- [ ] Load testing completed
- [ ] Documentation updated

## 📞 **Support**

For deployment issues:
1. Check AWS CloudWatch logs
2. Verify security group configurations
3. Test database connectivity
4. Review application logs 