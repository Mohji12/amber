# Docker Setup for Amber Global Project

This project is now containerized with Docker for easy development and deployment.

## 🐳 Docker Architecture

- **Backend**: FastAPI application running on Python 3.11
- **Frontend**: React application served by nginx
- **Database**: MySQL 8.0 with persistent storage

## 📋 Prerequisites

- Docker Desktop installed and running
- Git (to clone the repository)

## 🚀 Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd import-main
   ```

2. **Copy environment variables**:
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your specific values.

3. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:3306

## 🛠️ Development Commands

### Start all services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### Rebuild and start
```bash
docker-compose up --build
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Access containers
```bash
# Backend container
docker-compose exec backend bash

# Frontend container
docker-compose exec frontend sh

# Database container
docker-compose exec db mysql -u amber_user -p amber_global
```

## 🔧 Configuration

### Environment Variables

The main configuration is in the `.env` file:

```env
# Database
DATABASE_URL=mysql+mysqlconnector://amber_user:amber_password@db:3306/amber_global
MYSQL_DATABASE=amber_global
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_USER=amber_user
MYSQL_PASSWORD=amber_password

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Ports

- **Frontend**: 3000
- **Backend**: 8000
- **Database**: 3306

## 📁 Project Structure

```
import-main/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt
│   └── app/
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml
├── env.example
└── DOCKER_SETUP.md
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database connection issues**:
   ```bash
   # Check if database is running
   docker-compose ps
   # Check database logs
   docker-compose logs db
   ```

3. **Build failures**:
   ```bash
   # Clean up and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

### Database Reset

To reset the database:

```bash
# Stop services
docker-compose down

# Remove volume
docker volume rm import-main_mysql_data

# Start fresh
docker-compose up --build
```

## 🚀 Production Deployment

For production deployment:

1. **Update environment variables** in `.env`
2. **Change default passwords** in docker-compose.yml
3. **Use proper SSL certificates**
4. **Set up proper logging**
5. **Configure backups for database**

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/)

## 🤝 Contributing

When contributing to this project:

1. Make sure Docker is working locally
2. Test changes in the containerized environment
3. Update documentation if needed
4. Ensure all services start correctly

---

**Note**: This setup is for development. For production, additional security measures and optimizations should be implemented. 