# Docker Setup for Quick Flayer API and Database

Set up Docker containers for the NestJS API and PostgreSQL database with proper networking, environment management, and development/production configurations.

## Project Structure After Setup

```
quick-flayer-api/
├─ docker/
│  ├─ api/
│  │  └─ Dockerfile
│  ├─ database/
│  │  ├─ init.sql
│  │  └─ Dockerfile (optional)
│  └─ nginx/
│     └─ nginx.conf (for production)
├─ docker-compose.yml
├─ docker-compose.prod.yml
├─ .dockerignore
├─ .env.docker
├─ .env.docker.example
└─ README.docker.md
```

## Step 1: Create Dockerfile for NestJS API

### Create `docker/api/Dockerfile`:
```dockerfile
# Multi-stage build for production optimization
FROM node:18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main.js"]

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3001
CMD ["pnpm", "start:dev"]
```

## Step 2: Create Docker Compose Configuration

### Create `docker-compose.yml` (Development):
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: quick-flayer-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: quick_flayer_db
      POSTGRES_USER: quick_flayer_user
      POSTGRES_PASSWORD: ${DB_PASSWORD:-dev_password}
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - quick-flayer-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U quick_flayer_user -d quick_flayer_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache (Optional but recommended)
  redis:
    image: redis:7-alpine
    container_name: quick-flayer-redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    networks:
      - quick-flayer-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # NestJS API
  api:
    build:
      context: .
      dockerfile: docker/api/Dockerfile
      target: development
    container_name: quick-flayer-api
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://quick_flayer_user:${DB_PASSWORD:-dev_password}@postgres:5432/quick_flayer_db
      REDIS_URL: redis://redis:6379
      API_PORT: 3001
      JWT_SECRET: ${JWT_SECRET:-dev_jwt_secret}
      CORS_ORIGIN: ${CORS_ORIGIN:-http://localhost:3000}
    ports:
      - "${API_PORT:-3001}:3001"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/dist
    networks:
      - quick-flayer-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  # pgAdmin (Database Management UI)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: quick-flayer-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@quickflayer.com
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin123}
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "${PGADMIN_PORT:-5050}:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - quick-flayer-network
    depends_on:
      - postgres

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  pgadmin_data:
    driver: local

networks:
  quick-flayer-network:
    driver: bridge
```

## Step 3: Create Production Docker Compose

### Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: quick-flayer-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - quick-flayer-network
    depends_on:
      - api

  # PostgreSQL Database (Production)
  postgres:
    image: postgres:15-alpine
    container_name: quick-flayer-postgres-prod
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./docker/database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - quick-flayer-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache (Production)
  redis:
    image: redis:7-alpine
    container_name: quick-flayer-redis-prod
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_prod_data:/data
    networks:
      - quick-flayer-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # NestJS API (Production)
  api:
    build:
      context: .
      dockerfile: docker/api/Dockerfile
      target: production
    container_name: quick-flayer-api-prod
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      API_PORT: 3001
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
    networks:
      - quick-flayer-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_prod_data:
    driver: local
  redis_prod_data:
    driver: local

networks:
  quick-flayer-network:
    driver: bridge
```

## Step 4: Database Initialization

### Create `docker/database/init.sql`:
```sql
-- Create database if not exists
SELECT 'CREATE DATABASE quick_flayer_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'quick_flayer_db');

-- Connect to the database
\c quick_flayer_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create initial tables (example)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name) 
VALUES (
    'admin@quickflayer.com', 
    crypt('admin123', gen_salt('bf')), 
    'Admin', 
    'User'
) ON CONFLICT (email) DO NOTHING;

-- Create additional tables as needed
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
```

## Step 5: Nginx Configuration (Production)

### Create `docker/nginx/nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:3001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        listen 80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # API proxy
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            
            proxy_pass http://api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Health check
        location /health {
            proxy_pass http://api/health;
            access_log off;
        }
    }
}
```

## Step 6: Environment Configuration

### Create `.env.docker.example`:
```env
# Database Configuration
DB_NAME=quick_flayer_db
DB_USER=quick_flayer_user
DB_PASSWORD=secure_password_here
DB_PORT=5432

# Redis Configuration
REDIS_PASSWORD=secure_redis_password

# API Configuration
API_PORT=3001
JWT_SECRET=your_super_secure_jwt_secret_here
CORS_ORIGIN=http://localhost:3000

# PgAdmin Configuration
PGADMIN_PASSWORD=secure_admin_password

# Production specific
NODE_ENV=production
```

### Create `.dockerignore`:
```dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.nyc_output
coverage
.vscode
.idea
```

## Step 7: Docker Commands and Scripts

### Add to API's `package.json`:
```json
{
  "scripts": {
    "docker:dev": "docker-compose up -d",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up -d",
    "docker:build": "docker-compose build",
    "docker:logs": "docker-compose logs -f api",
    "docker:down": "docker-compose down",
    "docker:clean": "docker-compose down -v --remove-orphans",
    "docker:db:reset": "docker-compose down postgres && docker volume rm quick-flayer-api_postgres_data && docker-compose up -d postgres"
  }
}
```

## Step 8: Development Workflow

### Development Commands:
```bash
# Copy environment file
cp .env.docker.example .env.docker

# Start development environment
pnpm docker:dev

# View logs
pnpm docker:logs

# Access database
docker exec -it quick-flayer-postgres psql -U quick_flayer_user -d quick_flayer_db

# Access Redis CLI
docker exec -it quick-flayer-redis redis-cli

# Stop services
pnpm docker:down

# Clean everything (including volumes)
pnpm docker:clean
```

### Production Deployment:
```bash
# Set production environment variables
cp .env.docker.example .env.docker
# Edit .env.docker with production values

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Monitor
docker-compose -f docker-compose.prod.yml logs -f
```

## Step 9: Update NestJS API Configuration

### Update `src/app.module.ts` to use environment variables:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.docker', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

## Expected Results:

1. **Development**: API runs on port 3001, PostgreSQL on 5432, Redis on 6379, pgAdmin on 5050
2. **Production**: Nginx handles requests, API behind reverse proxy, secure database setup
3. **Database**: Automatically initialized with tables and admin user
4. **Networking**: All containers communicate through dedicated Docker network
5. **Health Checks**: Services wait for dependencies to be healthy before starting
6. **Data Persistence**: Database and Redis data survive container restarts
7. **Development Workflow**: Hot reload works with volume mounting
8. **Production Ready**: Optimized builds, security headers, rate limiting