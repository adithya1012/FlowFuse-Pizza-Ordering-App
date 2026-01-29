# Pizza Ordering Application - Docker Deployment Guide

This guide explains how to run the complete Pizza Ordering Application using Docker Compose.

## Architecture

The application consists of three containerized services:

```
┌─────────────────────────────────────────────────────────┐
│                     Host Machine                         │
│                                                           │
│  Browser ──► http://localhost:8080                       │
│                      │                                    │
│  ┌───────────────────▼────────────────────────────────┐ │
│  │  Frontend Container (Nginx)                        │ │
│  │  - React UI served on port 80                      │ │
│  │  - Nginx proxies /api/* to backend                 │ │
│  └────────────────────┬───────────────────────────────┘ │
│                       │                                   │
│                       │ /api/* → http://backend:3000/*    │
│                       │                                   │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │  Backend Container (Node.js + Fastify)             │ │
│  │  - REST API on port 3000                           │ │
│  │  - Connects to MySQL via service name             │ │
│  └────────────────────┬───────────────────────────────┘ │
│                       │                                   │
│                       │ database:3306                     │
│                       │                                   │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │  Database Container (MySQL 8.0)                    │ │
│  │  - Stores users and orders                         │ │
│  │  - Port 3306 (internal only)                       │ │
│  │  - Persistent volume for data                      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  Network: pizza_network (bridge)                         │
└───────────────────────────────────────────────────────────┘
```

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0 or higher
- At least 2GB of available RAM
- Ports 8080 available on host machine

## Quick Start

### 1. Clean Start (Recommended)

Remove any existing containers, volumes, and images:

```bash
# Navigate to project root
cd /path/to/FlowFuse-Pizza-Ordering-App

# Remove old containers and volumes
docker-compose down -v

# Remove old images (optional)
docker rmi pizza_frontend pizza_backend
```

### 2. Build and Start All Services

```bash
# Build and start all containers
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

This command will:
1. Build frontend Docker image (React + Nginx)
2. Build backend Docker image (Node.js + Fastify)
3. Pull MySQL 8.0 image
4. Create Docker network `pizza_network`
5. Create persistent volume `pizza_mysql_data`
6. Start database → backend → frontend (in order)

### 3. Access the Application

Once all services are healthy (check logs or health status):

```bash
# Open in browser
http://localhost:8080
```

You can now:
- Sign up for a new account
- Log in
- Browse pizza menu
- Add items to cart
- Place orders
- View order history

## Docker Compose Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f database
```

### Stop Services
```bash
# Stop all services (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes database data)
docker-compose down -v
```

### Restart a Specific Service
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart database
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose up --build frontend

# Rebuild all services
docker-compose up --build
```

## Service Details

### Frontend Service
- **Container Name**: `pizza_frontend`
- **Technology**: React 19 + Vite + TypeScript, served by Nginx
- **Port Mapping**: `8080:80` (host:container)
- **Internal Communication**: Nginx proxies `/api/*` to `http://backend:3000/*`
- **Health Check**: Every 30s via `/health` endpoint

### Backend Service
- **Container Name**: `pizza_backend`
- **Technology**: Node.js 20 + Fastify
- **Port**: 3000 (internal only, accessed via frontend nginx)
- **Environment Variables**:
  - `DB_HOST=database` (MySQL service name)
  - `DB_PORT=3306` (internal MySQL port)
  - `DB_USER=pizza_user`
  - `DB_PASSWORD=pizza_password123`
  - `DB_NAME=pizza_app_db`
- **Health Check**: Every 30s via HTTP GET to root endpoint

### Database Service
- **Container Name**: `pizza_database`
- **Technology**: MySQL 8.0
- **Port**: 3306 (internal only, not exposed to host)
- **Volume**: `pizza_mysql_data` persists data
- **Initial Schema**: Loaded from `./database/init.sql`
- **Health Check**: Every 10s via `mysqladmin ping`

## Networking

All services communicate on the internal `pizza_network` bridge network:

- **Frontend → Backend**: `http://backend:3000` (via nginx proxy)
- **Backend → Database**: `database:3306` (direct connection)
- **External Access**: Only frontend exposed on port 8080

## Data Persistence

### MySQL Data
Database data is persisted in the Docker volume `pizza_mysql_data`:

```bash
# Inspect volume
docker volume inspect pizza_mysql_data

# Backup database
docker exec pizza_database mysqldump -u pizza_user -ppizza_password123 pizza_app_db > backup.sql

# Restore database
docker exec -i pizza_database mysql -u pizza_user -ppizza_password123 pizza_app_db < backup.sql
```

## Troubleshooting

### Services Not Starting

Check service status and logs:
```bash
docker-compose ps
docker-compose logs database
docker-compose logs backend
docker-compose logs frontend
```

### Database Connection Issues

1. Verify database is healthy:
```bash
docker-compose ps database
```

2. Check backend can reach database:
```bash
docker exec pizza_backend ping database
```

3. Verify environment variables:
```bash
docker exec pizza_backend env | grep DB_
```

### Frontend API Calls Failing

1. Check nginx proxy configuration:
```bash
docker exec pizza_frontend cat /etc/nginx/conf.d/default.conf
```

2. Test backend directly from frontend container:
```bash
docker exec pizza_frontend wget -O- http://backend:3000/
```

3. Check CORS configuration in backend

### Port Already in Use

If port 8080 is already in use, modify `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3001:80"  # Change host port to 3001 or any available port
```

### Clean Slate Restart

Remove everything and start fresh:
```bash
# Stop and remove all containers
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Remove images
docker rmi pizza_frontend pizza_backend

# Remove network
docker network rm pizza_network

# Rebuild and start
docker-compose up --build
```

## Development vs Production

### Development Mode (Local)
- Frontend: `npm run dev` on port 5173
- Backend: `node server.js` on port 3000
- Database: Docker on port 3307
- API calls: `http://localhost:3000/*`

### Production Mode (Docker)
- All services containerized
- Frontend: Nginx on port 80 (mapped to 8080)
- Backend: Internal port 3000
- Database: Internal port 3306
- API calls: `/api/*` (proxied by nginx)

The application automatically detects the environment and adjusts API URLs accordingly via `src/config/api.ts`.

## Health Checks

All services have health checks configured:

```bash
# Check health status
docker-compose ps

# Should show "healthy" for all services:
# - pizza_frontend
# - pizza_backend
# - pizza_database
```

## Scaling (Optional)

While not required for this application, you can scale services:

```bash
# Scale backend to 3 instances
docker-compose up --scale backend=3 -d

# Note: You'll need a load balancer for proper scaling
```

## Security Notes

1. **Default passwords**: Change `MYSQL_ROOT_PASSWORD` and `MYSQL_PASSWORD` in production
2. **Internal ports**: Database and backend ports are not exposed to host
3. **CORS**: Backend only accepts requests from frontend origin
4. **Nginx**: Security headers configured in `frontend/nginx.conf`

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify all services are healthy: `docker-compose ps`
3. Ensure no port conflicts on host machine
4. Confirm Docker Desktop has sufficient resources allocated

---

**Application Stack**:
- Frontend: React 19 + TypeScript + Vite
- Backend: Node.js 20 + Fastify
- Database: MySQL 8.0
- Reverse Proxy: Nginx (Alpine)
