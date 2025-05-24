# Docker Setup for Complete Quick Flayer Monorepo

Set up Docker containers for the entire Quick Flayer monorepo including React Native/Expo app, Next.js web application, NestJS API, and PostgreSQL database with proper networking, environment management, and development/production configurations.

## Updated Project Structure

```
my-monorepo/
├─ docker/
│  ├─ api/
│  │  └─ Dockerfile
│  ├─ web/
│  │  └─ Dockerfile
│  ├─ app/
│  │  └─ Dockerfile
│  ├─ database/
│  │  ├─ init.sql
│  │  └─ Dockerfile (optional)
│  └─ nginx/
│     └─ nginx.conf
├─ docker-compose.yml
├─ docker-compose.prod.yml
├─ .dockerignore
├─ .env.docker
├─ .env.docker.example
└─ README.docker.md
```

## Requirements for Each Application Dockerfile

### 1. NestJS API Dockerfile (`docker/api/Dockerfile`)
- **Multi-stage build**: base, deps, build, production, development
- **Use Node 18 Alpine** for smaller image size
- **Install pnpm globally** in base stage
- **Development stage**: Hot reload with volume mounting, expose port 3001
- **Production stage**: Optimized build, only production dependencies
- **Health check**: Curl endpoint for /health
- **Working directory**: /app
- **Environment**: NODE_ENV handling for dev/prod

### 2. Next.js Web Dockerfile (`docker/web/Dockerfile`)
- **Multi-stage build**: base, deps, build, production, development
- **Use Node 18 Alpine** for consistency
- **Install pnpm globally**
- **Development stage**: Next.js dev server with hot reload, expose port 3000
- **Production stage**: Static build with `next start`, optimized layers
- **Build-time environment variables**: NEXT_PUBLIC_* variables
- **Static file optimization**: Proper caching headers
- **Working directory**: /app
- **Handle Next.js specific requirements**: .next directory, public assets

### 3. React Native/Expo App Dockerfile (`docker/app/Dockerfile`)
- **Multi-stage build**: base, deps, development (no production build needed)
- **Use Node 18 Alpine**
- **Install pnpm and Expo CLI globally**
- **Development stage**: Expo dev server with tunnel/LAN mode, expose ports 19000, 19001, 19002
- **Metro bundler configuration**: Enable network access
- **Environment variables**: EXPO_PUBLIC_* variables
- **Volume mounting**: For development with hot reload
- **Expo-specific requirements**: Handle .expo directory, assets
- **Network mode**: For mobile device access

## Updated Docker Compose Configuration

### Development Environment (`docker-compose.yml`)

**Services to include:**
1. **PostgreSQL Database**: Same as before with health checks
2. **Redis Cache**: Same as before
3. **NestJS API**: Updated to use new Dockerfile location
4. **Next.js Web**: New service with development configuration
5. **Expo App**: New service with special networking for mobile access
6. **pgAdmin**: Database management UI

**Key Updates:**
- **Networking**: All services on same network for inter-communication
- **Environment variables**: Shared across services with proper API URLs
- **Port mapping**: 3001 (API), 3000 (Web), 19000-19002 (Expo)
- **Volume mounting**: All three apps for development hot reload
- **Dependencies**: Proper service dependencies and health checks
- **CORS configuration**: API allows requests from web and mobile

### Production Environment (`docker-compose.prod.yml`)

**Services to include:**
1. **Nginx Reverse Proxy**: Routes to API and serves static web files
2. **PostgreSQL**: Production database with security
3. **Redis**: Production cache with authentication
4. **NestJS API**: Production build
5. **Next.js Web**: Production build served by Nginx
6. **Expo App**: Production build (optional, for web export)

**Key Updates:**
- **Nginx configuration**: Serve Next.js static files and proxy API
- **SSL/TLS**: HTTPS configuration with certificates
- **Security**: Production environment variables, no dev tools
- **Optimization**: Multi-stage builds, minimal layers
- **Monitoring**: Health checks and restart policies

## Environment Configuration Updates

### Shared Environment Variables (`.env.docker.example`)

**Add variables for all services:**
- **Database**: Same as before
- **Redis**: Same as before  
- **API**: Add CORS origins for web and mobile
- **Web**: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL
- **Mobile**: EXPO_PUBLIC_API_URL, EXPO_PUBLIC_WEB_URL
- **Networking**: Internal service URLs vs external URLs
- **Ports**: Configurable ports for all services

## Updated Dockerfile Requirements

### General Requirements for All Dockerfiles:
1. **Use pnpm** consistently across all applications
2. **Multi-stage builds** for development and production
3. **Proper .dockerignore** for each application
4. **Security**: Non-root user, minimal attack surface
5. **Optimization**: Layer caching, minimal image size
6. **Health checks** where applicable
7. **Signal handling**: Proper SIGTERM handling

### Specific Dockerfile Instructions:

#### API Dockerfile Updates:
- **Context**: Build from monorepo root, not API directory
- **Copy strategy**: Copy only necessary files for each stage
- **Database integration**: Wait for database health check
- **CORS**: Environment-based CORS configuration

#### Web Dockerfile Requirements:
- **Build-time variables**: Handle NEXT_PUBLIC_* at build time
- **Static optimization**: Optimize static assets and images
- **ISR support**: If using Incremental Static Regeneration
- **API integration**: Proper API URL configuration for SSR/SSG

#### App Dockerfile Requirements:
- **Expo CLI**: Install and configure properly
- **Network access**: Configure for LAN/tunnel mode
- **Mobile debugging**: Enable remote debugging capabilities
- **Asset handling**: Proper asset resolution and optimization
- **Platform builds**: Support for iOS/Android if needed

## Networking and Communication

### Service Communication:
1. **Internal network**: All services communicate via service names
2. **API URLs**: 
   - Internal: `http://api:3001`
   - External: `http://localhost:3001`
3. **Web URLs**:
   - Internal: `http://web:3000`
   - External: `http://localhost:3000`
4. **Mobile access**: Configure Expo for network access to API

### Port Mapping Strategy:
- **5432**: PostgreSQL
- **6379**: Redis
- **3001**: API
- **3000**: Web
- **19000-19002**: Expo dev server
- **5050**: pgAdmin
- **80/443**: Nginx (production)

## Updated Package.json Scripts

### Root package.json additions:
```json
{
  "scripts": {
    "docker:dev": "docker-compose up -d",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up -d",
    "docker:build": "docker-compose build",
    "docker:build:api": "docker-compose build api",
    "docker:build:web": "docker-compose build web", 
    "docker:build:app": "docker-compose build app",
    "docker:logs": "docker-compose logs -f",
    "docker:logs:api": "docker-compose logs -f api",
    "docker:logs:web": "docker-compose logs -f web",
    "docker:logs:app": "docker-compose logs -f app",
    "docker:down": "docker-compose down",
    "docker:clean": "docker-compose down -v --remove-orphans",
    "docker:restart": "docker-compose restart",
    "docker:shell:api": "docker-compose exec api sh",
    "docker:shell:web": "docker-compose exec web sh",
    "docker:shell:app": "docker-compose exec app sh"
  }
}
```

## Development Workflow

### Development Commands:
- **Start all services**: `pnpm docker:dev`
- **Build specific service**: `pnpm docker:build:web`
- **View logs**: `pnpm docker:logs:api`
- **Access shells**: `pnpm docker:shell:web`
- **Restart service**: `docker-compose restart web`

### Mobile Development:
- **Expo access**: Configure for LAN mode to access from physical device
- **QR code**: Access Expo dev tools via browser
- **Hot reload**: Changes reflect immediately on device
- **API integration**: Mobile app connects to dockerized API

## Production Considerations

### Nginx Configuration Updates:
1. **Static file serving**: Serve Next.js static files
2. **API proxying**: Proxy /api requests to NestJS
3. **Expo web build**: Serve Expo web export if needed
4. **Gzip compression**: Optimize file transfer
5. **Caching headers**: Proper cache control
6. **Security headers**: HSTS, CSP, etc.

### Build Optimization:
1. **Multi-stage builds**: Minimize final image size
2. **Layer caching**: Optimize for faster rebuilds
3. **Dependencies**: Only production dependencies in final stage
4. **Asset optimization**: Compress images, minify files

## Integration Points

### API Integration:
- **CORS**: Configure for web and mobile origins
- **Environment URLs**: Different URLs for development vs production
- **Authentication**: JWT tokens work across all platforms

### Database Integration:
- **Migrations**: Run database migrations on API startup
- **Seeding**: Initial data seeding in development
- **Backup**: Production backup strategies

### Inter-service Communication:
- **Service discovery**: Use Docker service names
- **Health checks**: Services wait for dependencies
- **Error handling**: Graceful degradation when services unavailable

This setup provides a complete containerized development environment where all applications can run simultaneously with proper networking, shared databases, and development tools while maintaining production-ready configurations.