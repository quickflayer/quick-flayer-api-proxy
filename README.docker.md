# Quick Flayer Docker Setup

## Prerequisites
- Docker
- Docker Compose
- pnpm (Node Package Manager)

## Development Setup

1. Copy environment file:
```bash
cp .env.docker.example .env.docker
```

2. Modify `.env.docker` with your specific configurations

3. Start development environment:
```bash
docker-compose up --build
```

## Production Deployment

1. Set production environment variables in `.env.docker`

2. Start production services:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## Services
- API: http://localhost:3001
- PostgreSQL: localhost:5432
- PgAdmin: http://localhost:5050
- Redis: localhost:6379

## Troubleshooting
- Ensure all environment variables are set
- Check Docker logs for specific service issues
- Verify network connectivity between containers

## Security Notes
- Never commit `.env.docker` with real credentials
- Use strong, unique passwords
- Rotate credentials periodically
