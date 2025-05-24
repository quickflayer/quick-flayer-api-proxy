# Quick Flayer Docker Setup Guide

This guide provides instructions for setting up and using Docker with the Quick Flayer monorepo, which includes the NestJS API, Next.js web application, and React Native/Expo app.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system
- Node.js and pnpm installed for local development (optional)

## Getting Started

1. **Setup Environment Variables**

   Copy the example environment file to create your own:

   ```bash
   cp .env.docker.example .env.docker
   ```

   Modify the values in `.env.docker` as needed.

2. **Start Development Environment**

   ```bash
   pnpm docker:dev
   ```

   This will start all the services in development mode with hot reloading enabled.

3. **View Logs**

   ```bash
   pnpm docker:logs        # All services
   pnpm docker:logs:api    # Just the API
   pnpm docker:logs:web    # Just the web app
   pnpm docker:logs:app    # Just the mobile app
   ```

## Service Access

- **API**: http://localhost:3001
- **Web App**: http://localhost:3000
- **Expo App**: 
  - Scan the QR code displayed in the terminal
  - Or open http://localhost:19002 in your browser
- **pgAdmin**: http://localhost:5050
  - Email: admin@quickflayer.com
  - Password: admin123 (or as configured in .env.docker)

## Mobile Development

For mobile development with a physical device:

1. Ensure your mobile device is on the same network as your development machine
2. In `.env.docker`, set `REACT_NATIVE_PACKAGER_HOSTNAME` to your development machine's IP address
3. Restart the docker containers with `pnpm docker:restart`
4. Scan the QR code from the Expo app on your device

## Production Deployment

1. **Prepare Production Environment Variables**

   Create a `.env.docker.prod` file with your production configuration.

2. **Build and Start Production Environment**

   ```bash
   pnpm docker:build   # Build all services
   pnpm docker:prod    # Start in production mode
   ```

## Common Commands

```bash
# Build services
pnpm docker:build         # Build all services
pnpm docker:build:api     # Build just the API
pnpm docker:build:web     # Build just the web app
pnpm docker:build:app     # Build just the mobile app

# Start/stop services
pnpm docker:dev           # Start development environment
pnpm docker:prod          # Start production environment
pnpm docker:down          # Stop all services
pnpm docker:restart       # Restart all services

# Shell access
pnpm docker:shell:api     # Open shell in API container
pnpm docker:shell:web     # Open shell in web container
pnpm docker:shell:app     # Open shell in app container

# Cleanup
pnpm docker:clean         # Remove containers, volumes, and orphaned containers
```

## Troubleshooting

### Port Conflicts

If you encounter port conflicts, modify the port mappings in `.env.docker` and restart the services.

### Container Access

To access a running container:

```bash
pnpm docker:shell:api    # For the API container
pnpm docker:shell:web    # For the web container
pnpm docker:shell:app    # For the mobile app container
```

### Database Reset

To reset the database:

```bash
pnpm docker:down
docker volume rm quick-flayer-root_postgres_data
pnpm docker:dev
```

## Further Customization

- **Custom Nginx Configuration**: Modify `docker/nginx/nginx.conf`
- **Database Initialization**: Modify `app/quick-flayer-api/docker/database/init.sql`
- **SSL Setup**: Add certificates to `docker/nginx/ssl/` and uncomment the HTTPS server block in nginx.conf
